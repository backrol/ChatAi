import type { Message } from '@/types'
import { cn } from '@/lib/utils'
import { User, Bot } from 'lucide-react'

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {msg.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          <div
            className={cn(
              'max-w-[70%] rounded-2xl px-4 py-2',
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-br-none'
                : 'bg-gray-700 text-gray-100 rounded-bl-none'
            )}
          >
            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
          </div>
          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
