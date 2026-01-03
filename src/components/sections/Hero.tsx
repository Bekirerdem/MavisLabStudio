'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  // Mouse interaction
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    
    // Normalize -0.5 to 0.5
    const x = (clientX / innerWidth) - 0.5
    const y = (clientY / innerHeight) - 0.5
    
    mouseX.set(x)
    mouseY.set(y)
  }

  // Smooth lerp for mouse parallax
  const xSpring = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const ySpring = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Transform values based on mouse
  const bgX = useTransform(xSpring, [-0.5, 0.5], ['-2%', '2%'])
  const bgY = useTransform(ySpring, [-0.5, 0.5], ['-2%', '2%'])
  
  const contentX = useTransform(xSpring, [-0.5, 0.5], ['2%', '-2%'])
  const contentY = useTransform(ySpring, [-0.5, 0.5], ['2%', '-2%'])

  // Scroll parallax
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.8])

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center perspective-1000 bg-black"
    >
      {/* Background Layer (Video) - Moves with mouse */}
      <motion.div 
        style={{ x: bgX, y: bgY, scale: 1.1 }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
          poster="/logo.png"
        >
          <source src="/videos/Hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </motion.div>

      {/* Floating Elements (Dust/Particles) - Optional for depth */}
      <div className="absolute inset-0 z-10 opacity-30 pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

      {/* Content Layer - Moves opposite to background for depth */}
      <motion.div 
        style={{ x: contentX, y: contentY, opacity, scale }}
        className="relative z-20 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
           {/* Logo Glow */}
           <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute inset-0 bg-[#D4AF37] blur-[100px] opacity-40 rounded-full"
           />
           
           
           <Image
             src="/logo-vectorel.png"
             alt="MAVİŞ LAB"
             width={400} // Increased size
             height={400} // Increased size
             priority
             className="relative drop-shadow-2xl"
           />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mt-8 text-white font-light text-xl md:text-3xl uppercase tracking-[0.5em] text-shadow-lg"
        >
          PREMIUM ERKEK KUAFÖRÜ
        </motion.h1>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 100 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 w-px bg-gradient-to-b from-[#D4AF37] to-transparent"
        />

        {/* Hero CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          onClick={() => document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-12 px-8 py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
        >
          Randevu Oluştur
        </motion.button>
      </motion.div>

      {/* Social Links - Absolute Left */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6 z-40"
      >
        {['Instagram', 'Twitter', 'Youtube'].map((social) => (
          <a key={social} href="#" className="text-gray-400 hover:text-[#D4AF37] text-xs uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 transition-colors">
            {social}
          </a>
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Keşfet</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-radial-gradient from-transparent to-black/80" />
    </section>
  )
}
