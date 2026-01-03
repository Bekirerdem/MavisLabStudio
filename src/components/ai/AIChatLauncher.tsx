'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  location?: {
    name: string
    address: string
    googleMapsUrl: string
  }
}

export default function AIChatLauncher() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Merhaba! Ben Mehmet Ali Kurtdiş, MAVİŞ LAB STUDIO\'nun kurucusuyum. 👋\n\nSize randevu oluşturma, hizmetlerimiz hakkında bilgi verme veya stüdyomuza nasıl ulaşacağınızı gösterme konusunda yardımcı olabilirim.\n\nNasıl yardımcı olabilirim?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Convert messages to conversation history format for API
  const getConversationHistory = () => {
    return messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role,
        content: m.content,
      }))
  }

  // Send message to AI
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: getConversationHistory(),
        }),
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        location: data.location,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin veya bizi doğrudan ziyaret edin.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      appointment: 'Randevu almak istiyorum',
      services: 'Hizmetlerinizi ve fiyatlarınızı görebilir miyim?',
      location: 'Stüdyonuz nerede, nasıl ulaşabilirim?',
      hours: 'Çalışma saatleriniz nedir?',
    }
    sendMessage(quickMessages[action] || action)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  // Render message content with Google Maps button
  const renderMessageContent = (message: Message) => {
    const content = message.content

    // Check if message contains Google Maps link
    const mapsRegex = /(https:\/\/maps\.app\.goo\.gl\/[^\s]+|https:\/\/maps\.google\.com[^\s]+)/g
    const parts = content.split(mapsRegex)
    const matches = content.match(mapsRegex)

    if (matches && matches.length > 0) {
      return (
        <>
          {parts.map((part, index) => (
            <span key={index}>
              {part}
              {matches[index] && (
                <a
                  href={matches[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-mavis-gold to-amber-500 text-mavis-black rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-mavis-gold/30 transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Google Maps&apos;te Aç
                </a>
              )}
            </span>
          ))}
        </>
      )
    }

    return <span className="whitespace-pre-wrap">{content}</span>
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          FLOATING CHAT BUTTON
          Premium glassmorphism design with gold accents
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 2.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="glass px-5 py-3 rounded-2xl shadow-xl border border-[#D4AF37]/20">
                <p className="text-sm text-gray-300">
                  Randevu almak ister misiniz?
                </p>
                <p className="text-xs text-[#D4AF37] mt-1 font-medium">
                  Mehmet Ali Kurtdiş
                </p>
              </div>
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-mavis-gray/70" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Outer pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-[#D4AF37]/30"
          />
          
          {/* Inner pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute inset-0 rounded-full bg-[#D4AF37]/20"
          />

          {/* Button container */}
          <div className="relative glass w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20 group-hover:shadow-[#D4AF37]/40 transition-shadow duration-500 border border-[#D4AF37]/30">
            {/* Icon */}
            <motion.div
              animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              )}
            </motion.div>

            {/* Gold accent ring */}
            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-colors duration-500" />
          </div>
        </motion.button>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          CHAT PANEL - Premium AI Integration
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-28 right-6 z-50 w-80 md:w-[400px]"
          >
            <div className="glass rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                      <span className="text-mavis-black font-bold text-sm">MAK</span>
                    </div>
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-mavis-black animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Mehmet Ali Kurtdiş</h3>
                    <p className="text-xs text-[#D4AF37]">MAVİŞ LAB STUDIO • Çevrimiçi</p>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat body */}
              <div 
                className="p-4 h-[350px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-transparent overscroll-contain"
                onWheel={(e) => e.stopPropagation()} // Prevent body scroll
              >
                {/* Messages */}
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex-shrink-0 flex items-center justify-center border border-[#D4AF37]/20">
                        <span className="text-[#D4AF37] text-xs font-bold">M</span>
                      </div>
                    )}
                    <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`inline-block rounded-2xl p-4 max-w-[85%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-[#D4AF37] to-amber-600 text-mavis-black rounded-tr-sm shadow-lg shadow-[#D4AF37]/20'
                            : 'bg-white/5 text-gray-300 rounded-tl-sm border border-white/10'
                        }`}
                      >
                        <div className="text-sm leading-relaxed break-words overflow-hidden">
                          {renderMessageContent(message)}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1.5 mx-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Premium Typing Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex-shrink-0 flex items-center justify-center border border-[#D4AF37]/20">
                      <span className="text-[#D4AF37] text-xs font-bold">M</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 inline-flex items-center gap-1 border border-white/10">
                        {/* Premium typing dots */}
                        <motion.div
                          className="flex items-center gap-1"
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{
                                y: [0, -6, 0],
                                opacity: [0.4, 1, 0.4],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                              }}
                              className="w-2 h-2 bg-gradient-to-br from-[#D4AF37] to-amber-500 rounded-full shadow-sm shadow-[#D4AF37]/50"
                            />
                          ))}
                        </motion.div>
                        <span className="text-xs text-gray-500 ml-2">yazıyor...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />

                {/* Quick actions - only show when no user messages */}
                {messages.length === 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 space-y-2"
                  >
                    <p className="text-xs text-gray-500 mb-3">Hızlı İşlemler</p>
                    {[
                      { key: 'appointment', icon: '📅', label: 'Randevu Oluştur' },
                      { key: 'services', icon: '💈', label: 'Hizmetleri Görüntüle' },
                      { key: 'hours', icon: '🕐', label: 'Çalışma Saatleri' },
                      { key: 'location', icon: '📍', label: 'Konum ve Ulaşım' },
                    ].map((action) => (
                      <button
                        key={action.key}
                        onClick={() => handleQuickAction(action.key)}
                        className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 group"
                      >
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {action.icon} {action.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 border-t border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    disabled={isLoading}
                    className="w-full px-5 py-3 pr-12 rounded-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 text-sm text-white placeholder-gray-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <svg
                      className="w-4 h-4 text-mavis-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
                {/* Powered by badge */}
                <p className="text-center text-[10px] text-gray-600 mt-3">
                  Powered by <span className="text-[#D4AF37]">MAVIS LAB AI</span>
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
