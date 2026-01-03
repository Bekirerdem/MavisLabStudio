'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCalendar(false)
    }
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-[20px] border-b border-white/5 py-4' 
            : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-[80px] h-[80px]">
              <Image
                src="/logo-vectorel.png"
                alt="MAVİŞ LAB"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden md:flex flex-col justify-center">
               <span className="text-white font-bold tracking-wider text-lg leading-none">MAVİŞ LAB</span>
               <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] leading-none mt-1">Studio</span>
            </div>
          </div>

          {/* Center Menu */}
          <div className="hidden md:flex items-center gap-8 bg-black/20 backdrop-blur-sm px-8 py-3 rounded-full border border-white/5">
            {[
              { name: 'HİZMETLER', href: '#services' },
              { name: 'KOLEKSİYON', href: '#lookbook' },
              { name: 'MANIFESTO', href: '#manifesto' },
              { name: 'KONUM', href: '#location' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-xs font-bold text-gray-300 hover:text-[#D4AF37] transition-colors uppercase tracking-widest group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={() => setShowCalendar(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow"
          >
            Randevu Al
          </motion.button>
        </div>
      </motion.nav>

      {/* Appointment Modal */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] w-full max-w-4xl h-[80vh] rounded-2xl border border-[#D4AF37]/20 overflow-hidden relative shadow-2xl shadow-[#D4AF37]/10"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="w-full h-full bg-white">
                {/* Google Calendar Appointment Page Iframe */}
                {/* Replace src with your actual Google Calendar Appointment URL */}
                <iframe 
                  src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0c0j2r0g0c0h0e0c0k?gv=true" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                  title="Randevu Al"
                  className="w-full h-full"
                ></iframe>
                
                {/* Fallback if no URL provided yet */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#111] pointer-events-none opacity-0">
                   <p className="text-gray-400">Takvim Yükleniyor...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
