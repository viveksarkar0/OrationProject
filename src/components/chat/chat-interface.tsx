'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Send, Bot, Sparkles } from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'

export function ChatInterface() {
  const { data: session } = useSession()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { 
    currentSessionId, 
    messages, 
    setMessages
  } = useChatStore()

  const { data: sessionMessages } = trpc.chat.getMessages.useQuery(
    { sessionId: currentSessionId! },
    { enabled: !!currentSessionId }
  )

  const utils = trpc.useUtils()
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      // Refresh messages after successful send
      utils.chat.getMessages.invalidate({ sessionId: currentSessionId! })
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  useEffect(() => {
    if (sessionMessages) {
      setMessages(sessionMessages.map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'assistant',
        createdAt: new Date(msg.createdAt)
      })))
    }
  }, [sessionMessages, setMessages])

  // Enhanced scroll behavior with requestAnimationFrame for smoother scrolling
  useEffect(() => {
    if (!scrollAreaRef.current) return
    
    const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
    if (!scrollContainer) return
    
    // Use refs to track the animation frame and timeout IDs
    const scrollState = {
      animationFrameId: 0,
      timeoutId: undefined as NodeJS.Timeout | undefined,
    }
    
    const scrollToBottom = () => {
      if (!scrollContainer) return
      
      // Cancel any pending animation frame
      if (scrollState.animationFrameId) {
        cancelAnimationFrame(scrollState.animationFrameId)
      }
      
      // Use requestAnimationFrame for smoother animation
      scrollState.animationFrameId = requestAnimationFrame(() => {
        try {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          })
        } catch {
          // Fallback for browsers that don't support smooth scrolling
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
      })
    }
    
    // Initial scroll
    scrollToBottom()
    
    // Clear any existing timeout and set a new one
    if (scrollState.timeoutId) {
      clearTimeout(scrollState.timeoutId)
    }
    
    // Set new timeout for delayed scroll
    scrollState.timeoutId = setTimeout(scrollToBottom, 150)
    
    // Cleanup function
    return () => {
      if (scrollState.animationFrameId) {
        cancelAnimationFrame(scrollState.animationFrameId)
      }
      if (scrollState.timeoutId) {
        clearTimeout(scrollState.timeoutId)
      }
    }
  }, [messages, isLoading])


  const handleSendMessage = async () => {
    if (!currentSessionId || !input.trim()) return
    
    setIsLoading(true)
    try {
      await sendMessageMutation.mutateAsync({
        sessionId: currentSessionId,
        content: input.trim()
      })
      setInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentSessionId) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Welcome to Career Counselor AI</h3>
              <p className="text-muted-foreground">
                Create a new conversation to start chatting with your AI career counselor.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-purple-50/20 dark:from-slate-950/50 dark:via-blue-950/20 dark:to-purple-950/20">
      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6">
        <div className="space-y-8 max-w-5xl mx-auto pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your AI Career Counselor</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                I&apos;m here to guide your professional journey. Whether you&apos;re exploring career transitions, optimizing your job search, 
                preparing for interviews, or seeking strategic career advice, I&apos;m ready to provide personalized insights.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">Career Strategy</div>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="text-sm font-medium">Resume Review</div>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium">Interview Prep</div>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm font-medium">Salary Guidance</div>
                </div>
              </div>
            </div>
          ) : (
            (sessionMessages || []).map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 max-w-5xl animate-in slide-in-from-bottom-2 duration-300",
                  message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <Avatar className="w-10 h-10 shrink-0 shadow-lg border-2 border-white dark:border-slate-700">
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className={cn(
                  "flex-1 space-y-3 min-w-0",
                  message.role === 'user' ? 'text-right' : ''
                )}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Career Counselor AI</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "group rounded-2xl px-6 py-5 shadow-lg transition-all duration-200 hover:shadow-xl border",
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white ml-auto max-w-[80%] border-blue-300/20'
                        : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 max-w-[90%]'
                    )}
                  >
                    <div className={cn(
                      "whitespace-pre-wrap leading-relaxed",
                      message.role === 'user' ? 'text-sm' : 'text-sm prose prose-sm dark:prose-invert max-w-none'
                    )}>
                      {message.content}
                    </div>
                  </div>
                  <div className={cn(
                    "text-xs text-muted-foreground flex items-center gap-2",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    {message.role === 'assistant' && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Professional Advice</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4 justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-700 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-700 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Career Counselor AI</span>
                </div>
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-5 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Analyzing your career question...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="sticky bottom-0 border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 p-6 shadow-2xl border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <Textarea
                placeholder="💼 Ask me about career transitions, resume optimization, interview strategies, salary negotiation, skill development, or any professional growth questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[90px] max-h-44 resize-none pr-20 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60 focus:border-blue-500 dark:focus:border-blue-400 bg-white/90 dark:bg-slate-800/90 shadow-lg transition-all duration-200 text-sm leading-relaxed backdrop-blur-sm placeholder:text-muted-foreground/70"
                disabled={isLoading}
                maxLength={2000}
              />
              <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {input.length}/2000
                </span>
                <div className="w-1 h-4 bg-slate-300 dark:bg-slate-600 rounded-full" />
                <span className="text-xs text-muted-foreground font-mono">⌘↵</span>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-[90px] px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-2">
                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">{isLoading ? 'Sending...' : 'Send'}</span>
              </div>
            </Button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-emerald-500" />
              <span className="font-medium">Professional AI Career Counselor</span>
              <span>•</span>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="font-medium">Secure & Confidential</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
