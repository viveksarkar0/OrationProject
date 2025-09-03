'use client'

import { useState } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatInterface } from './chat-interface'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-80" : "ml-0"
        )}>
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}
