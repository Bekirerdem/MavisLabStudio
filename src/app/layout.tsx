import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MAVİŞ LAB STUDIO | Premium Erkek Kuaförü ve Bakım Deneyimi',
  description: 'Bursa\'nın yeni nesil premium erkek bakım stüdyosu. Saç tasarımı, cilt bakımı ve kişiye özel imaj danışmanlığı. MAVİŞ LAB ile randevunuzu hemen oluşturun.',
  keywords: ['maviş lab', 'maviş lab studio', 'bursa berber', 'premium erkek kuaförü', 'saç tasarımı', 'imaj danışmanlığı', 'yıldırım kuaför'],
  authors: [{ name: 'Mehmet Ali Kurtdiş' }],
  icons: {
    icon: '/logo-vectorel.png', // Fallback
    apple: '/logo-vectorel.png',
  },
  openGraph: {
    title: 'MAVİŞ LAB STUDIO | Saç Sadece Kesilmez, Bir Kimlik Yaratılır',
    description: 'Bursa\'da premium erkek bakım deneyimi. Google Takvim entegrasyonlu randevu ve yapay zeka destekli asistan.',
    siteName: 'MAVİŞ LAB STUDIO',
    type: 'website',
    locale: 'tr_TR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
