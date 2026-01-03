'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Image list based on available files in public/photos
const photos = [
  { src: '/photos/model.png', alt: 'Model 1' },
  { src: '/photos/model2.jpg', alt: 'Model 2' },
  { src: '/photos/model3.webp', alt: 'Model 3' },
  { src: '/photos/model4.webp', alt: 'Model 4' },
  { src: '/photos/model5.webp', alt: 'Model 5' },
  { src: '/photos/model6.webp', alt: 'Model 6' },
  { src: '/photos/model7.jpg', alt: 'Model 7' },
  { src: '/photos/model8.jpg', alt: 'Model 8' },
  { src: '/photos/model9.webp', alt: 'Model 9' },
  { src: '/photos/model10.webp', alt: 'Model 10' },
  { src: '/photos/model11.jpg', alt: 'Model 11' },
  { src: '/photos/model12.jpg', alt: 'Model 12' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function Lookbook() {
  return (
    <section id="lookbook" className="py-24 bg-[#050505] px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 text-center">
          <span className="text-[#D4AF37] text-sm tracking-widest uppercase">Portfolio</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-light text-white uppercase tracking-wider">
            Koleksiyon
          </h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[#111]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-transparent group-hover:ring-[#D4AF37]/50 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
