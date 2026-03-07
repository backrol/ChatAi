'use client'

import AuthForm from '@/components/AuthForm'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Selamat Datang
        </h2>
        <p className="text-white/70 text-center mb-8">
          Masuk atau daftar untuk memulai chat dengan AI
        </p>
        <AuthForm />
      </div>
    </div>
  )
}
