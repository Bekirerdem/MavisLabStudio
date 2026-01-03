'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true)
      setTimeout(onComplete, 800) // Wait for exit animation
    }, 2500) // 2.5s duration
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={exit ? { opacity: 0, y: -100, pointerEvents: 'none' } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#D4AF37] blur-[100px] rounded-full"
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <Image
            src="/logo.png"
            alt="MAVİŞ LAB"
            width={120}
            height={120}
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Reveal */}
        <div className="mt-8 overflow-hidden relative z-10 text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="text-3xl font-light text-white tracking-[0.5em] uppercase"
          >
            MAVİŞ LAB
          </motion.h1>
          <motion.p
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.8, duration: 0.8 }}
             className="text-[#D4AF37] text-xs tracking-[0.8em] mt-2 uppercase"
          >
            Studio
          </motion.p>
        </div>

        {/* Loading Bar */}
        <motion.div 
          className="mt-12 h-px bg-[#333] w-48 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="absolute inset-0 bg-[#D4AF37]"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
