import { NextRequest, NextResponse } from 'next/server'
import { getServices, createAppointment, getServiceByName } from '@/lib/supabase'

// MAVIS LAB Konum Bilgisi - Salon Maviş Erkek Kuaför Salonu
const MAVIS_LAB_LOCATION = {
  name: 'Salon Maviş Erkek Kuaför Salonu',
  address: 'Bağlaraltı, 413. Sk. No:4-6/A, 16300 Yıldırım/Bursa',
  googleMapsUrl: 'https://www.google.com/maps/place/Salon+Mavi%C5%9F+Erkek+Kuaf%C3%B6r+Salonu/@40.1823897,29.1364704,19z',
  phone: '0537 372 75 07',
}

// Çalışma Saatleri
const WORKING_HOURS = `
- Pazartesi: 08:00 - 22:00
- Salı: 08:00 - 22:00
- Çarşamba: 08:00 - 22:00
- Perşembe: 08:00 - 22:00
- Cuma: 08:00 - 23:00
- Cumartesi: 24 saat açık
- Pazar: KAPALI
`

// System Prompt for Mehmet Ali Kurtdiş
const SYSTEM_PROMPT = `Sen Mehmet Ali Kurtdiş'sin. MAVIS LAB STUDIO'nun kurucusu ve baş berberisin.
Bursa Yıldırım'da, Bağlaraltı Mahallesi 413. Sokak No:4-6/A adresinde hizmet veriyorsun.

⚠️ KRİTİK KURAL: HER ZAMAN SADECE TÜRKÇE KONUŞ! İNGİLİZCE KELİME KULLANMA!
- "appointment" değil "randevu"
- "service" değil "hizmet"  
- "price" değil "fiyat"
- "location" değil "konum"
- "thank you" değil "teşekkür ederim"

KİMLİĞİN:
- Adın: Mehmet Ali Kurtdiş
- İşletmen: MAVIS LAB STUDIO - Premium Kuaför Salonu
- Konum: Bursa, Yıldırım
- Tarzın: Samimi, profesyonel, premium hizmet odaklı

ÇALIŞMA SAATLERİ:
${WORKING_HOURS}

GÖREV VE KURALLARIN:

1. MÜŞTERİ KARŞILAMA:
   - Her zaman sıcak ve profesyonel ol
   - Müşteriyi adıyla hitap et (öğrendiysen)
   - MAVIS LAB'ın premium deneyimini vurgula

2. HİZMET BİLGİSİ:
   - Sana verilen hizmet listesinden fiyat ve süre bilgisi sun
   - Her hizmeti detaylı açıkla
   - Premium kaliteyi vurgula

3. RANDEVU OLUŞTURMA:
   - Müşteriden şu bilgileri al: Ad, tarih/saat, hizmet türü
   - Çalışma saatlerine uygunluğu kontrol et
   - Pazar günü randevu ALMA (kapalıyız)
   - Cumartesi 24 saat müsait olduğumuzu belirt

4. RANDEVU ONAYI:
   - Tüm bilgiler tamamlandığında randevuyu onayla
   - Şu mesajı ver: "Randevunuz oluşturuldu! Mehmet Ali Kurtdiş sizi MAVIS LAB'da ağırlamaktan mutluluk duyacak. 🎉"
   - Ardından konum bilgisini paylaş

5. KONUM PAYLAŞIMI:
   - Adres: ${MAVIS_LAB_LOCATION.address}
   - Google Haritalar linki: ${MAVIS_LAB_LOCATION.googleMapsUrl}
   - Konum sorulduğunda SADECE bu linki paylaş, başka link üretme!

6. DİL KURALLARI (ÇOK ÖNEMLİ):
   - SADECE TÜRKÇE KONUŞ, HİÇBİR İNGİLİZCE KELİME KULLANMA
   - Nazik, yardımsever ve profesyonel ol
   - Samimi ama saygılı bir dil kullan
   - Kaba mesajlara yanıt verme

ÖNEMLİ: Randevu bilgileri tamamsa (isim, tarih/saat, hizmet), yanıtının EN SONUNA bu etiketi ekle:
[RANDEVU_ONAYI:{"customer_name":"MÜŞTERİ_ADI","service_name":"HİZMET_ADI","appointment_date":"YYYY-MM-DDTHH:MM:SS"}]
`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body as {
      message: string
      conversationHistory: ChatMessage[]
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      )
    }

    // Get services from database for context
    const services = await getServices()
    const servicesContext = services.length > 0
      ? services.map(s => `- ${s.name}: ${s.price}₺ (${s.duration} dakika)`).join('\n')
      : 'Henüz hizmet tanımlanmamış.'

    // Build the full system prompt with context
    const fullSystemPrompt = `${SYSTEM_PROMPT}

MEVCUT HİZMETLER:
${servicesContext}

BUGÜNÜN TARİHİ: ${new Date().toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
`

    // Build messages array for OpenRouter
    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // Models to try (primary + fallbacks) - Türkçe destekli modeller
    const models = [
      process.env.NEXT_PUBLIC_AI_MODEL || 'google/gemini-2.0-flash-exp:free',
      'google/gemma-3-27b-it:free',           // Gemma 3 - iyi Türkçe desteği
      'qwen/qwen-2.5-72b-instruct:free',      // Qwen - güçlü çok dilli model
      'deepseek/deepseek-chat-v3-0324:free',  // DeepSeek - alternatif
    ]

    let aiResponse = ''
    let lastError: Error | null = null

    // Try each model until one works
    for (const model of models) {
      try {
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mavis-lab.studio',
            'X-Title': 'MAVIS LAB Studio AI'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.8,
            max_tokens: 1024,
          })
        })

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json()
          aiResponse = data.choices[0]?.message?.content || ''
          if (aiResponse) {
            console.log(`Successfully used model: ${model}`)
            break
          }
        } else {
          const errorData = await openRouterResponse.json()
          console.log(`Model ${model} failed:`, errorData.error?.message || 'Unknown error')
          lastError = new Error(errorData.error?.message || 'API error')
        }
      } catch (err) {
        console.log(`Model ${model} error:`, err)
        lastError = err as Error
      }
    }

    if (!aiResponse) {
      throw lastError || new Error('Tüm modeller başarısız oldu')
    }

    // Parse the response for appointment confirmation
    const { hasAppointment, appointmentData, cleanResponse } = parseAppointmentFromResponse(aiResponse)

    // If appointment confirmed, save to database
    if (hasAppointment && appointmentData) {
      // Find the service by name
      const service = await getServiceByName(appointmentData.service_name)
      
      // Create the appointment
      const appointment = await createAppointment({
        customer_name: appointmentData.customer_name,
        service_id: service?.id || null,
        appointment_date: appointmentData.appointment_date,
      })

      if (appointment) {
        // Check if AI already mentioned location in response - check for any maps URLs
        const alreadyHasLocation = cleanResponse.includes('Bağlaraltı') || 
                                   cleanResponse.includes('413') || 
                                   cleanResponse.includes('maps.app.goo.gl') ||
                                   cleanResponse.includes('google.com/maps') ||
                                   cleanResponse.includes('goo.gl/')
        
        // Only add location if AI didn't already include it
        let responseWithLocation = cleanResponse
        if (!alreadyHasLocation) {
          responseWithLocation = `${cleanResponse}

📍 Adresimiz: ${MAVIS_LAB_LOCATION.address}`
        }
        
        return NextResponse.json({
          response: responseWithLocation,
          appointmentCreated: true,
          appointment: {
            id: appointment.id,
            date: appointmentData.appointment_date,
            service: service?.name || appointmentData.service_name,
          },
          location: MAVIS_LAB_LOCATION,
        })
      }
    }

    return NextResponse.json({
      response: cleanResponse,
      appointmentCreated: false,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

// Parse appointment confirmation from AI response
function parseAppointmentFromResponse(response: string): {
  hasAppointment: boolean
  appointmentData?: {
    customer_name: string
    service_name: string
    appointment_date: string
  }
  cleanResponse: string
} {
  const appointmentRegex = /\[RANDEVU_ONAYI:(\{.*?\})\]/
  const match = response.match(appointmentRegex)
  
  if (match && match[1]) {
    try {
      const appointmentData = JSON.parse(match[1])
      const cleanResponse = response.replace(appointmentRegex, '').trim()
      
      return {
        hasAppointment: true,
        appointmentData,
        cleanResponse,
      }
    } catch {
      return {
        hasAppointment: false,
        cleanResponse: response,
      }
    }
  }
  
  return {
    hasAppointment: false,
    cleanResponse: response,
  }
}
