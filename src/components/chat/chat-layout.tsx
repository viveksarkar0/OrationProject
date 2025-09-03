'use client'

import { useState, useEffect } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatInterface } from './chat-interface'
import { Header } from '@/components/layout/header'
import { cn } from '@/lib/utils'

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to closed on mobile
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSessionSelect = (sessionId: string | null) => {
    setCurrentSessionId(sessionId)
    // Auto-close sidebar on mobile when session is selected
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <ChatSidebar 
          isOpen={sidebarOpen} 
          onToggle={handleSidebarToggle}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          isMobile={isMobile}
        />
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          // On desktop, adjust margin based on sidebar state
          // On mobile, always full width
          !isMobile && sidebarOpen ? "ml-96" : "ml-0"
        )}>
          <ChatInterface currentSessionId={currentSessionId} />
        </main>
      </div>
    </div>
  )
}
