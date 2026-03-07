'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PlusCircle, MessageSquare, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Chat {
  id: string
  title: string
  created_at: string
}

export default function ChatSidebar({ chats, activeId }: { chats: Chat[]; activeId?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleNewChat = () => {
    router.push('/chat')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Chat Baru</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition',
              activeId === chat.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            )}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate text-sm">{chat.title}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-white w-full px-3 py-2 rounded-lg hover:bg-gray-700/50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}
