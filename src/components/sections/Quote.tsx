'use client'

import { motion } from 'framer-motion'

const quote = "Saç sadece kesilmez, bir kimlik yaratılır."
const words = quote.split(" ")

export default function Quote() {
  return (
    <section id="manifesto" className="min-h-[60vh] flex items-center justify-center bg-[#050505] px-4 py-20 relative">
      <div className="max-w-4xl mx-auto text-center z-10">
        <div className="overflow-hidden">
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                variants={{
                  hidden: { y: 100, opacity: 0, rotate: 5 },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    rotate: 0,
                    transition: { 
                      type: "spring", 
                      damping: 12, 
                      stiffness: 100 
                    } 
                  }
                }}
              >
                {i === 4 ? <span className="text-[#D4AF37]">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h2>
        </div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ delay: 1, duration: 0.5 }}
           viewport={{ once: true }}
           className="mt-12 flex justify-center"
        >
          <span className="h-px w-24 bg-[#D4AF37]" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-6 text-gray-500 uppercase tracking-[0.3em] text-sm"
        >
          Mehmet Ali Kurtdiş
        </motion.p>
      </div>
    </section>
  )
}
