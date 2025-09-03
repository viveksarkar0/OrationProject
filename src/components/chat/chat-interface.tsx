'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Send, Bot, Sparkles, Briefcase, GraduationCap, TrendingUp, Users, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { QuickActions } from './quick-actions'
import { useChatStore } from '@/lib/store'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'

export function ChatInterface() {
  const { data: session } = useSession()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
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
    if (!input.trim() || isLoading || !currentSessionId) return
    
    const messageContent = input.trim()
    setInput('')
    
    // Add user message to UI immediately with proper ID
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      content: messageContent,
      role: 'user' as const,
      createdAt: new Date(),
      chatSessionId: currentSessionId
    }
    
    // Update messages immediately to show user message
    setMessages([...messages, tempUserMessage])
    setIsLoading(true)
    
    // Scroll to bottom immediately after adding user message
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          })
        }
      }
    }, 50)
    
    try {
      await sendMessageMutation.mutateAsync({
        sessionId: currentSessionId,
        content: messageContent
      })
      
      // The response will be handled by the query invalidation
      // which will refresh the messages from the server
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove the temp message on error and restore input
      setMessages(messages.filter(msg => msg.id !== tempUserMessage.id))
      setInput(messageContent)
      setIsLoading(false)
    }
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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50/60 via-blue-50/30 to-purple-50/30 dark:from-slate-950/60 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s', animationDuration: '5s'}}></div>
      </div>
      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-8 relative z-10">
        <div className="space-y-10 max-w-6xl mx-auto pb-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 animate-pulse">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce shadow-lg">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full scale-50 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              </div>
              <motion.h3 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                AI Career Counselor
              </motion.h3>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full border border-blue-200/50 dark:border-blue-800/50 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Online & Ready to Help</span>
              </motion.div>
              <motion.p 
                className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome to your professional career counseling platform. I&apos;m an AI Career Counselor specialized in strategic career development, 
                resume optimization, interview preparation, and salary negotiation. Let&apos;s advance your professional journey together.
              </motion.p>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {[
                  { 
                    icon: Briefcase, 
                    title: "Career Strategy", 
                    color: "blue",
                    prompt: "I need help developing a comprehensive career strategy. Please assess my current situation and help me create a strategic plan for my professional growth. I'd like guidance on: career goals, industry analysis, skill development roadmap, networking strategy, and timeline for achieving my objectives."
                  },
                  { 
                    icon: GraduationCap, 
                    title: "Resume Review", 
                    color: "green",
                    prompt: "I would like a professional resume review and optimization. Please help me improve my resume by analyzing: content structure, keyword optimization, achievement quantification, formatting and design, ATS compatibility, and industry-specific customization. I want to ensure my resume effectively showcases my value proposition."
                  },
                  { 
                    icon: Users, 
                    title: "Interview Prep", 
                    color: "purple",
                    prompt: "I need comprehensive interview preparation assistance. Please help me prepare for upcoming interviews by covering: common interview questions and answers, behavioral interview techniques (STAR method), company research strategies, salary negotiation tactics, follow-up best practices, and confidence-building techniques."
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Salary Guidance", 
                    color: "orange",
                    prompt: "I need professional guidance on salary negotiation and compensation strategy. Please help me with: market salary research, negotiation techniques, total compensation analysis, timing strategies, counteroffer evaluation, and building a compelling case for my desired compensation package."
                  }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div 
                      key={index}
                      className={`group relative p-8 bg-white/90 dark:bg-slate-800/90 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl hover:shadow-${item.color}-500/15 transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:border-${item.color}-300/60 dark:hover:border-${item.color}-700/60 backdrop-blur-sm overflow-hidden`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setInput(item.prompt)
                        // Auto-focus the textarea
                        setTimeout(() => {
                          const textarea = document.querySelector('textarea')
                          if (textarea) {
                            textarea.focus()
                            textarea.setSelectionRange(textarea.value.length, textarea.value.length)
                          }
                        }, 100)
                      }}
                    >
                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/5 to-${item.color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                      
                      <motion.div 
                        className={`relative p-4 rounded-2xl bg-${item.color}-100 dark:bg-${item.color}-900/40 mb-4 w-fit mx-auto group-hover:bg-${item.color}-200 dark:group-hover:bg-${item.color}-900/60 transition-all duration-300 shadow-lg group-hover:shadow-${item.color}-500/20`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`h-7 w-7 text-${item.color}-600 dark:text-${item.color}-400`} />
                      </motion.div>
                      <div className={`text-base font-bold text-center group-hover:text-${item.color}-600 dark:group-hover:text-${item.color}-400 transition-colors mb-3 text-slate-800 dark:text-slate-200`}>
                        {item.title}
                      </div>
                      <div className={`text-sm text-center text-slate-500 dark:text-slate-400 group-hover:text-${item.color}-500 dark:group-hover:text-${item.color}-400 transition-colors font-medium`}>
                        Click for expert guidance
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
              
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <QuickActions 
                  onActionClick={(prompt) => {
                    setInput(prompt)
                    setTimeout(() => {
                      const textarea = document.querySelector('textarea')
                      if (textarea) {
                        textarea.focus()
                        textarea.setSelectionRange(textarea.value.length, textarea.value.length)
                      }
                    }, 100)
                  }}
                />
              </motion.div>
            </div>
          ) : (
            (sessionMessages || []).map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-6 max-w-6xl animate-in slide-in-from-bottom-2 duration-500",
                  message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <Avatar className="w-12 h-12 shrink-0 shadow-xl border-3 border-white dark:border-slate-700 ring-2 ring-slate-200/50 dark:ring-slate-600/50">
                  {message.role === 'user' ? (
                    <>
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white font-bold text-lg">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white relative">
                      <Bot className="w-6 h-6" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className={cn(
                  "flex-1 space-y-4 min-w-0",
                  message.role === 'user' ? 'text-right' : ''
                )}>
                  {message.role === 'assistant' && (
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                        </div>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">AI Career Counselor</span>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Professional Guidance</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expert Analysis</span>
                      </div>
                    </motion.div>
                  )}
                  <div
                    className={cn(
                      "group/message relative rounded-3xl px-8 py-6 shadow-lg transition-all duration-500 border backdrop-blur-xl overflow-hidden",
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white ml-auto max-w-[80%] border-blue-300/30 shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] hover:-translate-y-1'
                        : 'bg-white/95 dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 max-w-[90%] hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:scale-[1.01] hover:-translate-y-1'
                    )}
                  >
                    <div className={cn(
                      "leading-relaxed",
                      message.role === 'user' 
                        ? 'text-sm whitespace-pre-wrap' 
                        : 'text-sm prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:font-semibold prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:text-slate-700 dark:prose-ul:text-slate-300'
                    )}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {message.role === 'assistant' ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              {message.content.split('\n').map((line, index) => {
                                if (line.startsWith('## ')) {
                                  return <h3 key={index} className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 mt-4 first:mt-0 border-b border-slate-200 dark:border-slate-700 pb-2">{line.replace('## ', '')}</h3>
                                } else if (line.startsWith('**') && line.endsWith('**')) {
                                  return <p key={index} className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-base">{line.replace(/\*\*/g, '')}</p>
                                } else if (line.startsWith('- ')) {
                                  return <div key={index} className="flex items-start gap-2 mb-2 ml-2"><span className="text-blue-500 mt-1.5 text-xs">•</span><p className="text-slate-700 dark:text-slate-300 leading-relaxed">{line.replace('- ', '')}</p></div>
                                } else if (line.trim()) {
                                  return <p key={index} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>
                                }
                                return null
                              }).filter(Boolean)}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                          )}
                        </div>
                        
                        {/* Copy button */}
                        <div className="opacity-0 group-hover/message:opacity-100 transition-all duration-200 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 rounded-full transition-all duration-200",
                              message.role === 'user'
                                ? "hover:bg-white/20 text-white/70 hover:text-white"
                                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                            onClick={() => copyToClipboard(message.content, message.id)}
                            title="Copy message"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
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
      <div className="relative border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl border-slate-200/60 dark:border-slate-700/60">
        {/* Animated border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <Textarea
                placeholder="💼 Ask about career strategy, resume optimization, interview preparation, salary negotiation, or professional growth..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[70px] max-h-40 resize-none pr-20 rounded-2xl border-2 border-slate-300/60 dark:border-slate-600/60 focus:border-blue-500 dark:focus:border-blue-400 bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl transition-all duration-300 text-sm leading-relaxed placeholder:text-slate-500/80 dark:placeholder:text-slate-400/80 focus:ring-4 focus:ring-blue-500/20 backdrop-blur-sm"
                disabled={isLoading}
                maxLength={2000}
              />
              <div className="absolute right-4 bottom-4 flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    input.length > 1800 ? "bg-red-400 animate-pulse" : 
                    input.length > 1500 ? "bg-yellow-400" : "bg-emerald-400"
                  )}></div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {input.length}/2000
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="group h-[70px] px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative flex items-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="font-bold text-base">Processing...</span>
                  </>
                ) : (
                  <>
                    <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                      <Send className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-base">Send Message</span>
                  </>
                )}
              </div>
            </Button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">AI Career Counselor</span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Secure & Confidential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
