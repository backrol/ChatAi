import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-white">AI Chat</div>
          <Link
            href="/login"
            className="glass px-6 py-2 rounded-full text-white hover:bg-white/20 transition"
          >
            Masuk
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Percakapan AI
            <span className="block text-primary-200">Masa Depan</span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Chat dengan asisten AI canggih, simpan riwayat, dan akses kapan saja. 
            Dibangun dengan teknologi terbaru.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 glass text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition group"
          >
            Mulai Chat Gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {features.map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Cerdas',
    description: 'Ditenagai model GPT-4, siap menjawab pertanyaan kompleks.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Respon Cepat',
    description: 'Streaming langsung, respons muncul secara real-time.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Aman & Privat',
    description: 'Data tersimpan aman di Supabase, hanya Anda yang bisa akses.'
  }
]
