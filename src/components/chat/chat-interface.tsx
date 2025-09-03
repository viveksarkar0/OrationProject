'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc'
import { Bot, Send, Copy, Check, Briefcase, Sparkles } from 'lucide-react'
import { QuickActions } from './quick-actions'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
  chatSessionId: string
}

interface ChatInterfaceProps {
  currentSessionId: string | null
}

export function ChatInterface({ currentSessionId }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Get messages for current session using tRPC
  const { data: sessionMessages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { sessionId: currentSessionId! },
    { 
      enabled: !!currentSessionId,
      refetchOnWindowFocus: false,
      staleTime: 0
    }
  )

  // Send message mutation using tRPC
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (response) => {
      // Add both messages to local state immediately
      setMessages(prev => {
        const newMessages = [
          ...prev,
          {
            ...response.userMessage,
            createdAt: new Date(response.userMessage.createdAt),
            role: response.userMessage.role as 'user' | 'assistant'
          },
          {
            ...response.assistantMessage,
            createdAt: new Date(response.assistantMessage.createdAt),
            role: response.assistantMessage.role as 'user' | 'assistant'
          }
        ]
        return newMessages
      })
      setIsLoading(false)
      // Refetch to ensure sync with server
      refetchMessages()
    },
    onError: (error) => {
      console.error('Failed to send message:', error)
      setIsLoading(false)
    }
  })

  // Update local messages when session data changes
  useEffect(() => {
    if (sessionMessages && sessionMessages.length > 0) {
      setMessages(sessionMessages.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
        role: msg.role as 'user' | 'assistant'
      })))
    } else if (currentSessionId) {
      // Clear messages for new sessions
      setMessages([])
    }
  }, [sessionMessages, currentSessionId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          })
        }, 100)
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !currentSessionId || isLoading) return

    const messageContent = input.trim()
    setInput('')
    setIsLoading(true)

    // Use tRPC mutation to send message
    sendMessageMutation.mutate({
      sessionId: currentSessionId,
      content: messageContent,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50/90 via-indigo-50/60 to-violet-50/80 dark:from-slate-950/95 dark:via-indigo-950/70 dark:to-violet-950/85 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 via-indigo-400/5 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-400/10 via-blue-400/5 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/5 via-purple-400/3 to-pink-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-2 sm:px-6 py-2 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-8">
        {!currentSessionId || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] text-center px-3 sm:px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8 w-full"
            >
              <QuickActions 
                onActionClick={(prompt) => {
                  setInput(prompt)
                  setTimeout(() => {
                    handleSendMessage()
                  }, 100)
                }}
              />
            </motion.div>
            
            <motion.div
              className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mb-6 sm:mb-8 shadow-2xl shadow-indigo-500/30"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white relative z-10" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 dark:from-indigo-200 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8 px-2 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, type: "spring" }}
            >
              AI Career Counselor
            </motion.h2>
            
            <motion.div 
              className="flex items-center gap-2 mb-3 sm:mb-4 lg:mb-6 px-3 py-2 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-full border border-emerald-200/60 dark:border-emerald-800/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Online & Ready to Help</span>
            </motion.div>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to your professional career counseling platform. I&apos;m an AI Career Counselor specialized in strategic career development, 
              resume optimization, interview preparation, and salary negotiation. Let&apos;s advance your professional journey together.
            </motion.p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 sm:gap-4 w-full animate-in slide-in-from-bottom-2 duration-500",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Avatar - only show on desktop for assistant, always show for user */}
              {(message.role === 'assistant' || message.role === 'user') && (
                <Avatar className={cn(
                  "shrink-0 shadow-lg border-2 border-white dark:border-slate-700 ring-1 ring-slate-200/50 dark:ring-slate-600/50",
                  "w-8 h-8 sm:w-10 sm:h-10",
                  message.role === 'user' ? 'order-2' : 'order-1',
                  message.role === 'assistant' ? 'hidden sm:flex' : 'flex'
                )}>
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-sm">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white relative">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border border-white animate-pulse"></div>
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div className={cn(
                "flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%]",
                message.role === 'user' ? 'order-1 items-end' : 'order-2 items-start'
              )}>
                {/* Assistant header - mobile optimized */}
                {message.role === 'assistant' && (
                  <motion.div 
                    className="flex items-center gap-2 mb-2 sm:mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">AI Career Counselor</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Professional</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Message bubble */}
                <div
                  className={cn(
                    "group/message relative rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-6 sm:py-4 shadow-xl transition-all duration-500 border backdrop-blur-2xl hover:shadow-2xl transform hover:-translate-y-1",
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-indigo-300/30 shadow-indigo-500/30 hover:shadow-indigo-500/50'
                      : 'bg-white/90 dark:bg-slate-800/90 border-slate-200/40 dark:border-slate-700/40 shadow-slate-500/10 hover:bg-white/95 dark:hover:bg-slate-800/95 hover:border-indigo-200/60 dark:hover:border-indigo-700/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content.split('\n').map((line: string, index: number) => {
                            // Clean professional formatting without asterisks
                            if (line.startsWith('## ')) {
                              return <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 mt-3 sm:mt-4 first:mt-0 border-b border-slate-200 dark:border-slate-700 pb-1 sm:pb-2">{line.replace('## ', '')}</h3>
                            } else if (line.startsWith('### ')) {
                              return <h4 key={index} className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-3 first:mt-0">{line.replace('### ', '')}</h4>
                            } else if (line.startsWith('- ')) {
                              return <div key={index} className="flex items-start gap-2 mb-2 ml-1 sm:ml-2"><span className="text-blue-500 mt-1.5 text-xs flex-shrink-0">•</span><p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{line.replace('- ', '')}</p></div>
                            } else if (line.match(/^\d+\.\s/)) {
                              const number = line.match(/^(\d+)\.\s(.*)$/);
                              if (number) {
                                return <div key={index} className="flex items-start gap-2 mb-2 ml-1 sm:ml-2"><span className="text-blue-500 mt-0.5 text-xs font-medium min-w-[16px]">{number[1]}.</span><p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{number[2]}</p></div>
                              }
                            } else if (line.trim()) {
                              // Remove all asterisk formatting and make text clean
                              const cleanLine = line
                                .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold asterisks
                                .replace(/\*(.*?)\*/g, '$1')     // Remove italic asterisks
                                .trim();
                              
                              if (cleanLine) {
                                return <p key={index} className="mb-2 sm:mb-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{cleanLine}</p>
                              }
                            }
                            return null
                          }).filter(Boolean)}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</div>
                      )}
                    </div>
                    
                    {/* Copy button - desktop only */}
                    <div className="opacity-0 group-hover/message:opacity-100 transition-all duration-200 flex-shrink-0 hidden sm:block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0 rounded-full transition-all duration-200",
                          message.role === 'user'
                            ? "hover:bg-white/20 text-white/70 hover:text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                        onClick={() => copyToClipboard(message.content, message.id)}
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Timestamp - mobile optimized */}
                <div className={cn(
                  "text-xs text-slate-500 dark:text-slate-400 mt-1 px-1",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.role === 'assistant' && (
                    <span className="hidden sm:inline">
                      <span className="mx-1">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Professional Advice</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <motion.div 
            className="flex gap-4 justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white dark:border-slate-700 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
                  <Bot className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-700 animate-pulse" />
            </div>
            <div className="space-y-3">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">AI Career Counselor</span>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Analyzing Request</span>
                </div>
              </motion.div>
              <motion.div 
                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 rounded-3xl px-8 py-6 shadow-lg max-w-[90%]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">Crafting your personalized career guidance...</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Analyzing your situation and preparing strategic recommendations</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="relative border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl shadow-2xl border-white/20 dark:border-slate-700/20">
        {/* Animated border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 opacity-50"></div>
        
        {/* Main input container */}
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 sm:gap-4">
              {/* Textarea container */}
              <div className="flex-1 relative">
                <Textarea
                  placeholder="💼 Ask about career strategy..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[48px] sm:min-h-[60px] max-h-32 sm:max-h-40 resize-none px-4 py-3 pr-12 sm:pr-16 text-sm sm:text-base leading-relaxed rounded-2xl sm:rounded-3xl border-2 border-white/40 dark:border-slate-600/40 focus:border-indigo-400/60 dark:focus:border-indigo-400/60 bg-white/70 dark:bg-slate-800/70 shadow-2xl hover:shadow-3xl transition-all duration-500 placeholder:text-slate-500/70 dark:placeholder:text-slate-400/70 focus:ring-4 focus:ring-indigo-500/20 backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 focus:bg-white/90 dark:focus:bg-slate-800/90"
                  disabled={isLoading}
                  maxLength={2000}
                />
                {/* Character counter */}
                <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    input.length > 1800 ? "bg-red-400 animate-pulse" : 
                    input.length > 1500 ? "bg-yellow-400" : "bg-emerald-400"
                  )}></div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {input.length}/2000
                  </span>
                </div>
              </div>
              
              {/* Send button */}
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="group h-[48px] w-[48px] sm:h-[60px] sm:w-auto sm:px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/40 transition-all duration-500 rounded-2xl sm:rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 hover:-translate-y-2 relative overflow-hidden flex-shrink-0 backdrop-blur-xl"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span className="font-semibold text-sm hidden sm:inline">Send</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
            
            {/* Bottom info bar */}
            <div className="flex items-center justify-center mt-3 sm:mt-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                  <span className="font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">AI Career Counselor</span>
                </div>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
