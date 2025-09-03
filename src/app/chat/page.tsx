'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ChatLayout } from '@/components/chat/chat-layout'

export default function ChatPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    redirect('/')
  }

  return <ChatLayout />
}
