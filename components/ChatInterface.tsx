'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

interface ChatInterfaceProps {
  userId: string
  chatId?: string
  initialMessages?: Message[]
  chatTitle?: string
}

export default function ChatInterface({
  userId,
  chatId,
  initialMessages = [],
  chatTitle = 'Percakapan Baru',
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(chatId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    setLoading(true)

    // Optimistic update: tambah pesan user ke state
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      let targetChatId = currentChatId

      // Jika belum ada chatId, buat chat baru
      if (!targetChatId) {
        const title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
        const { data: chat, error: chatError } = await supabase
          .from('chats')
          .insert({ user_id: userId, title })
          .select()
          .single()

        if (chatError) throw chatError
        targetChatId = chat.id
        setCurrentChatId(targetChatId)
        router.push(`/chat/${targetChatId}`)
      }

      // Simpan pesan user ke database
      const { error: msgError } = await supabase.from('messages').insert({
        chat_id: targetChatId,
        role: 'user',
        content,
      })
      if (msgError) throw msgError

      // Panggil API AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          chatId: targetChatId,
        }),
      })

      if (!response.ok) throw new Error('Gagal mendapatkan respons AI')

      // Streaming respons AI
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiMessage = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              aiMessage += parsed.content || ''
              // Update state dengan pesan yang sedang di-stream
              setMessages((prev) => {
                const last = prev[prev.length - 1]
                if (last?.role === 'assistant' && last.id === 'streaming') {
                  // Update pesan yang sudah ada
                  return prev.map((msg) =>
                    msg.id === 'streaming' ? { ...msg, content: aiMessage } : msg
                  )
                } else {
                  // Tambah pesan baru
                  return [
                    ...prev,
                    {
                      id: 'streaming',
                      role: 'assistant',
                      content: aiMessage,
                      created_at: new Date().toISOString(),
                    },
                  ]
                }
              })
            } catch (e) {
              console.error('Error parsing chunk', e)
            }
          }
        }
      }

      // Setelah selesai streaming, simpan ke database
      const { error: saveError } = await supabase.from('messages').insert({
        chat_id: targetChatId,
        role: 'assistant',
        content: aiMessage,
      })
      if (saveError) throw saveError

      // Ganti id sementara dengan id asli (tapi kita tidak punya id asli, jadi bisa reload saja)
      // Untuk sederhananya, kita reload data dari database
      const { data: freshMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', targetChatId)
        .order('created_at', { ascending: true })
      setMessages(freshMessages || [])
    } catch (error) {
      console.error('Error sending message:', error)
      // Hapus pesan user jika gagal? Atau tampilkan error
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSendMessage} disabled={loading} />
    </>
  )
}
