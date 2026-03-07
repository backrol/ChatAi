import { openai } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()

    // Verifikasi user (middleware sudah melindungi, tapi kita cek lagi)
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Verifikasi bahwa chatId milik user (opsional)
    if (chatId) {
      const { data: chat } = await supabase
        .from('chats')
        .select('id')
        .eq('id', chatId)
        .eq('user_id', user.id)
        .single()
      if (!chat) {
        return new Response('Forbidden', { status: 403 })
      }
    }

    // Panggil OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      stream: true,
    })

    // Konversi ke stream
    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
