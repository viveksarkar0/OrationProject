'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  MessageSquare, 
  Search, 
  PanelLeftClose,
  PanelLeftOpen,
  Trash2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/store'
import { trpc } from '@/lib/trpc'
import { useSession } from 'next-auth/react'

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const { currentSessionId, setCurrentSession } = useChatStore()
  
  const userId = (session?.user as { id?: string })?.id
  const { data: chatSessions, isLoading } = trpc.chat.getSessions.useQuery(
    { userId },
    { enabled: !!userId }
  )

  const utils = trpc.useUtils()
  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: () => {
      // Refetch sessions after creating new one
      utils.chat.getSessions.invalidate()
    }
  })

  const deleteSessionMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: () => {
      // Refetch sessions after deleting
      utils.chat.getSessions.invalidate()
      // If deleted session was current, clear current session
      if (currentSessionId) {
        setCurrentSession('')
      }
    }
  })

  const handleNewChat = async () => {
    if (!userId) return
    
    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: `Career Chat ${new Date().toLocaleTimeString()}`,
        userId: userId
      })
      setCurrentSession(newSession.id)
      // Invalidate and refetch sessions
      await utils.chat.getSessions.invalidate()
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
  }

  const filteredSessions = chatSessions?.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-96 bg-gradient-to-b from-white/95 via-slate-50/90 to-blue-50/85 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-blue-950/85 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-700/60 transition-all duration-500 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full min-h-0 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-8 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          {/* Header */}
          <div className="relative flex items-center justify-between p-6 border-b border-gradient-to-r from-slate-200/60 via-blue-200/50 to-purple-200/40 dark:from-slate-700/60 dark:via-blue-800/50 dark:to-purple-800/40 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-950/60 dark:via-indigo-950/50 dark:to-purple-950/60 backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-blue-500/30 transform hover:scale-110 transition-all duration-300">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <span className="font-bold text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Career Sessions</span>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI-Powered Guidance</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-10 w-10 p-0 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <PanelLeftClose className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="relative p-6">
            <Button
              onClick={handleNewChat}
              disabled={createSessionMutation.isPending}
              className="group w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl  rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="relative flex items-center justify-center space-x-4">
                <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/25 ">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">New Career Session</div>
                  <div className="text-sm text-blue-100 ">Start AI-powered guidance</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Search */}
          <div className="relative px-6 pb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors duration-300" />
              <Input
                placeholder="Search career sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="relative mx-6 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent dark:via-slate-700/60"></div>
            <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent dark:via-blue-800/40 blur-sm"></div>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="space-y-4 p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl animate-spin" style={{animationDuration: '3s'}}></div>
                    <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-xl"></div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium animate-pulse">
                    Loading career sessions...
                  </div>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-bounce shadow-lg">
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full scale-50"></div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {searchQuery ? 'No sessions found' : 'Ready to start your career journey?'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-48">
                    {searchQuery ? 'Try a different search term' : 'Create your first AI-powered career session to get personalized guidance'}
                  </p>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group relative flex flex-col rounded-2xl p-4 cursor-pointer transition-all duration-150 border w-full hover:shadow-md",
                      currentSessionId === session.id 
                        ? "bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-950/60 dark:via-indigo-950/50 dark:to-purple-950/60 border-blue-300/60 dark:border-blue-700/60 shadow-lg shadow-blue-500/15 ring-1 ring-blue-200/50 dark:ring-blue-800/50" 
                        : "bg-white/90 dark:bg-slate-800/90 border-slate-200/40 dark:border-slate-700/40 hover:bg-white/95 dark:hover:bg-slate-800/95 hover:border-blue-300/40 dark:hover:border-blue-600/40"
                    )}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    {/* Active indicator */}
                    {currentSessionId === session.id && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                    
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300",
                            currentSessionId === session.id 
                              ? "bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg shadow-emerald-500/30" 
                              : "bg-slate-300 dark:bg-slate-600 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-blue-500"
                          )}></div>
                          <p className={cn(
                            "text-sm font-semibold truncate transition-colors duration-200",
                            currentSessionId === session.id 
                              ? "text-slate-900 dark:text-slate-100" 
                              : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                          )}>
                            {session.title.replace('Career Chat', 'Career Session')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge className={cn(
                            "text-xs transition-all duration-200",
                            currentSessionId === session.id
                              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                          )}>
                            {session.messages?.length || 0} msgs
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-full transition-all duration-200 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSessionMutation.mutate({ sessionId: session.id })
                              }}
                              disabled={deleteSessionMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(session.updatedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          currentSessionId === session.id
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        )}>
                          Active
                        </div>
                      </div>
                      
                      {session.messages?.[0] && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {session.messages[0].content.substring(0, 120)}{session.messages[0].content.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="fixed left-4 top-20 z-40 h-10 w-10 p-0 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl backdrop-blur-sm rounded-xl transition-all duration-200"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}
