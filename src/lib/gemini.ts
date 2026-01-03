import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini with API key (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// MAVIS LAB konumu - Berber salonu adresi
export const MAVIS_LAB_LOCATION = {
  name: 'MAVIS LAB BARBER',
  googleMapsUrl: 'https://maps.google.com/?q=MAVIS+LAB+BARBER',
  // Gerçek koordinatlar eklendiğinde:
  // lat: 41.0082,
  // lng: 28.9784,
}

// System prompt for Mehmet Ali Kurtdiş persona
const SYSTEM_PROMPT = `Sen Mehmet Ali Kurtdiş'sin, MAVIS LAB berber salonunun sahibi ve baş berberisin. 
Müşterilerle samimi, sıcak ve profesyonel bir şekilde iletişim kuruyorsun.

KARAKTER ÖZELLİKLERİ:
- Adın: Mehmet Ali Kurtdiş
- Mesleğin: Berber, MAVIS LAB sahibi
- Tarzın: Samimi, güler yüzlü, profesyonel
- Konuşma şeklin: Türkçe, doğal ve arkadaşça

GÖREV VE KURALLARIN:

1. RANDEVU OLUŞTURMA:
   - Müşteriden ad, tarih/saat ve hizmet türü bilgilerini al
   - Hizmet seçildiyse fiyat ve süre bilgisini paylaş
   - Tüm bilgiler tamamlandığında randevuyu onayla

2. HİZMET BİLGİSİ:
   - Sana verilen hizmet listesinden fiyat ve süre bilgisi sun
   - Hizmeti bulamıyorsan özür dile ve mevcut hizmetleri listele

3. RANDEVU ONAYI:
   - Randevu onaylandığında şu mesajı ver:
   - "Randevunuz alındı, Mehmet Ali Kurtdiş sizi bekliyor! 🎉"
   - Ardından Google Maps konumunu paylaş

4. KONUM PAYLAŞIMI:
   - Konum sorulduğunda veya randevu onaylandığında Google Maps linkini ver
   - Link: ${MAVIS_LAB_LOCATION.googleMapsUrl}

5. GENEL KURALLAR:
   - Her zaman Türkçe konuş
   - Nazik ve yardımsever ol
   - Emin olmadığın konularda müşteriye doğrudan MAVIS LAB'ı aramayı öner
   - Kaba veya uygunsuz mesajlara yanıt verme

ÖNEMLİ: Eğer müşteri randevu almak istiyorsa ve tüm bilgiler (isim, tarih/saat, hizmet) tamamsa, 
yanıtının sonuna [RANDEVU_ONAYI] etiketini ekle. Bu etiket sistemin randevuyu kaydetmesi için gerekli.
[RANDEVU_ONAYI:{"customer_name":"MÜŞTERİ_ADI","service_name":"HİZMET_ADI","appointment_date":"YYYY-MM-DDTHH:MM:SS"}]
`

// Message type for conversation history
export interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

// Get Gemini model configured for chat
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  })
}

// Generate chat response with context
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  servicesContext: string
): Promise<string> {
  const model = getGeminiModel()
  
  // Build the full context
  const fullSystemPrompt = `${SYSTEM_PROMPT}

MEVCUT HİZMETLER:
${servicesContext}

Bugünün tarihi: ${new Date().toLocaleDateString('tr-TR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
`

  // Convert conversation history to Gemini format
  const history = conversationHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: fullSystemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Anladım! Ben Mehmet Ali Kurtdiş, MAVIS LAB\'ın sahibiyim. Müşterilerime yardımcı olmaya hazırım.' }],
      },
      ...history,
    ],
  })

  const result = await chat.sendMessage(userMessage)
  const response = result.response.text()
  
  return response
}

// Parse appointment confirmation from AI response
export function parseAppointmentFromResponse(response: string): {
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
