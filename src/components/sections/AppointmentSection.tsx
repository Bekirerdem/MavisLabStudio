'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppointmentSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  })

  // Track errors for shake effect
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    date: false,
    time: false
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error on type
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors = {
      name: !formData.name,
      phone: !formData.phone,
      date: !formData.date,
      time: !formData.time
    }

    setErrors(newErrors)

    // Check if any error exists
    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    // Success
    setSubmitted(true)
    // Here you would connect to backend/calendar logic
    setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', phone: '', date: '', time: '' })
    }, 3000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const fieldVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const shakeVariant = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  }

  return (
    <section id="appointment-form" className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase">Rezervasyon</span>
          <h2 className="mt-4 text-4xl font-light text-white uppercase tracking-widest">
            Randevu Oluştur
          </h2>
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Name Field */}
          <motion.div variants={fieldVariants} className="relative">
             <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">İsim Soyisim</label>
             <motion.input
               variants={shakeVariant}
               animate={errors.name ? "shake" : undefined}
               type="text"
               name="name"
               value={formData.name}
               onChange={handleChange}
               placeholder="Adınız"
               className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-[#D4AF37]/50'} py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors text-xl font-light`}
             />
          </motion.div>

          {/* Phone Field */}
          <motion.div variants={fieldVariants} className="relative">
             <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">Telefon</label>
             <motion.input
               variants={shakeVariant}
               animate={errors.phone ? "shake" : undefined}
               type="tel"
               name="phone"
               value={formData.phone}
               onChange={handleChange}
               placeholder="05XX XXX XX XX"
               className={`w-full bg-transparent border-b ${errors.phone ? 'border-red-500' : 'border-[#D4AF37]/50'} py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors text-xl font-light`}
             />
          </motion.div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={fieldVariants} className="relative">
               <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">Tarih</label>
               <motion.input
                 variants={shakeVariant}
                 animate={errors.date ? "shake" : undefined}
                 type="date"
                 name="date"
                 value={formData.date}
                 onChange={handleChange}
                 className={`w-full bg-transparent border-b ${errors.date ? 'border-red-500' : 'border-[#D4AF37]/50'} py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors text-xl font-light [color-scheme:dark]`}
               />
            </motion.div>

            <motion.div variants={fieldVariants} className="relative">
               <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">Saat</label>
               <motion.select
                 variants={shakeVariant}
                 animate={errors.time ? "shake" : undefined}
                 name="time"
                 value={formData.time}
                 onChange={handleChange}
                 className={`w-full bg-transparent border-b ${errors.time ? 'border-red-500' : 'border-[#D4AF37]/50'} py-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-xl font-light appearance-none rounded-none cursor-pointer`}
               >
                 <option value="" className="bg-[#111] text-gray-500">Seçiniz</option>
                 <option value="10:00" className="bg-[#111]">10:00</option>
                 <option value="11:00" className="bg-[#111]">11:00</option>
                 <option value="12:00" className="bg-[#111]">12:00</option>
                 <option value="13:00" className="bg-[#111]">13:00</option>
                 <option value="14:00" className="bg-[#111]">14:00</option>
                 <option value="15:00" className="bg-[#111]">15:00</option>
                 <option value="16:00" className="bg-[#111]">16:00</option>
                 <option value="17:00" className="bg-[#111]">17:00</option>
                 <option value="18:00" className="bg-[#111]">18:00</option>
                 <option value="19:00" className="bg-[#111]">19:00</option>
                 <option value="20:00" className="bg-[#111]">20:00</option>
                 <option value="21:00" className="bg-[#111]">21:00</option>
                 <option value="22:00" className="bg-[#111]">22:00</option>
               </motion.select>
            </motion.div>
          </div>

          <motion.div variants={fieldVariants} className="relative">
             <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2 ml-1">Notunuz (Opsiyonel)</label>
             <textarea
               name="message"
               placeholder="Özel bir isteğiniz var mı?"
               rows={2}
               className="w-full bg-transparent border-b border-[#D4AF37]/50 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors text-xl font-light resize-none"
             />
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            variants={fieldVariants}
            className="pt-8 text-center"
          >
            <motion.button
              type="submit"
              disabled={submitted}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#D4AF37] text-black px-12 py-4 rounded-sm font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#b5952f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Talep Alındı ✓' : 'Randevuyu Onayla'}
            </motion.button>
            
            {submitted && (
               <motion.p 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-4 text-[#D4AF37] text-sm"
               >
                 Talebiniz alınmıştır, teyit için aranacaksınız.
               </motion.p>
            )}
          </motion.div>

        </motion.form>
      </div>
    </section>
  )
}
