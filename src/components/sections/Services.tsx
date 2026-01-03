'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'

// Stats Ticker Component
// Ticker integrated below

// Improved Counter for display - use textContent directly for performance
function Ticker({ value, suffix = "+" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (inView && ref.current) {
        const node = ref.current;
        const controls = animate(0, value, {
          duration: 2,
          ease: "easeOut",
          onUpdate(v) {
            node.textContent = Math.round(v).toString() + suffix;
          },
        });
        return () => controls.stop();
      }
    }, [inView, value, suffix]);
  
    return <span ref={ref} className="text-6xl font-light text-[#D4AF37]">0{suffix}</span>;
}

const services = [
  { name: 'Saç Kesimi', price: '400₺', desc: 'Danışmanlık + Kesim + Yıkama' },
  { name: 'Sakal Tasarımı', price: '250₺', desc: 'Sıcak Havlu + Ustura + Bakım' },
  { name: 'Royal Bakım', price: '800₺', desc: 'Saç + Sakal + Maske + Masaj' },
  { name: 'Renk & Boya', price: '600₺', desc: 'Doğal Görünümlü Kamuflaj' },
]

export default function Services() {
  return (
    <section id="services" className="py-32 px-4 bg-[#080808] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#D4AF37] text-sm tracking-widest uppercase">UZMANLIK</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-light text-white">Hizmet Menüsü</h2>
        </motion.div>

        {/* Cards Dealing Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ x: -100 * (i + 1), y: 50, opacity: 0, rotateY: -30 }}
              whileInView={{ x: 0, y: 0, opacity: 1, rotateY: 0 }}
              transition={{ 
                type: "spring",
                damping: 15,
                stiffness: 80,
                delay: i * 0.1 
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="relative p-8 bg-[#111] border border-white/5 rounded-sm hover:border-[#D4AF37]/50 transition-colors duration-300 group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl text-[#D4AF37]">
                0{i + 1}
              </div>
              <h3 className="text-xl font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                {service.name}
              </h3>
              <div className="mt-2 text-[#D4AF37] text-2xl font-light">{service.price}</div>
              <p className="mt-4 text-gray-500 text-sm">{service.desc}</p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* Stats Section with Ticker */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16">
           <div className="text-center">
             <Ticker value={10} suffix="+" />
             <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs">Yıllık Tecrübe</p>
           </div>
           <div className="text-center">
             <Ticker value={5000} suffix="+" />
             <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs">Mutlu Müşteri</p>
           </div>
           <div className="text-center">
             <Ticker value={12} suffix="" />
             <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs">Ödül</p>
           </div>
           <div className="text-center">
             <Ticker value={100} suffix="%" />
             <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs">Memnuniyet</p>
           </div>
        </div>

      </div>
    </section>
  )
}
