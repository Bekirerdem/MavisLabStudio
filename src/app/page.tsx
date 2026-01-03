'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Quote from '@/components/sections/Quote'
import Lookbook from '@/components/sections/Lookbook'
import AppointmentSection from '@/components/sections/AppointmentSection'
import Services from '@/components/sections/Services'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import AIChatLauncher from '@/components/ai/AIChatLauncher'
import Preloader from '@/components/ui/Preloader'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
// Smooth scroll for the whole page
import Lenis from 'lenis'

export default function Home() {
  const [loading, setLoading] = useState(true)

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    // Only init lenis after loading is done to prevent scroll during preloader
    if (loading) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [loading])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <main className="relative bg-[#050505] text-white min-h-screen selection:bg-[#D4AF37] selection:text-black">
        
        {/* Navigation */}
        <Navbar />

        {/* Sections */}
        <Hero />
        
        <Quote />
        
        <Lookbook />
        
        {/* New Dedicated Appointment Form */}
        <AppointmentSection />
        
        <Services />

        {/* Location Section */}
        <section id="location" className="py-32 px-4 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <span className="text-[#D4AF37] text-sm tracking-widest uppercase">BİZİ ZİYARET EDİN</span>
              <h2 className="mt-4 text-5xl font-light text-white leading-tight">
                Stüdyo
                <br />
                <span className="text-[#D4AF37]">Konumu</span>
              </h2>
              <div className="mt-12 space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37]">📍</div>
                  <div>
                    <h3 className="text-xl font-medium">Bursa, TR</h3>
                    <p className="text-gray-500 mt-2">Bağlaraltı, 413. Sk. No:4-6/A<br/>16300 Yıldırım</p>
                    <a href="https://maps.app.goo.gl/bVz9d4XJ6tF4A5pJ8" target="_blank" className="text-[#D4AF37] mt-4 inline-block text-sm uppercase tracking-wider border-b border-[#D4AF37] pb-1 hover:text-white transition-colors">Haritada Göster</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Container - Full Color */}
            <div className="flex-1 h-[400px] bg-white/5 rounded-sm overflow-hidden relative group border border-white/10">
              <div className="absolute inset-0 bg-[#111] flex items-center justify-center z-0">
                  <span className="text-gray-600 tracking-[0.5em] uppercase text-xs">Harita Yükleniyor...</span>
              </div>
              <iframe 
                src="https://maps.google.com/maps?q=54JP%2BWQ%20Y%C4%B1ld%C4%B1r%C4%B1m%2C%20Bursa&t=m&z=15&output=embed&iwloc=near"
                width="100%" 
                height="100%" 
                className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 bg-black text-center">
          <Image src="/logo-vectorel.png" width={40} height={40} alt="Logo" className="mx-auto opacity-50 mb-6" />
          <p className="text-gray-600 text-sm tracking-widest">© 2026 MAVİŞ LAB STUDIO</p>
        </footer>

        {/* Floating Actions */}
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-4">
          <WhatsAppButton />
        </div>
        
        <AIChatLauncher />

      </main>
    </>
  )
}
