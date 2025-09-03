'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  MessageSquare, 
  Search, 
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen
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
        "fixed inset-y-0 left-0 z-50 w-80 bg-background/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-transform duration-300 shadow-2xl flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-gradient-to-b from-white/90 via-slate-50/50 to-blue-50/30 dark:from-slate-900/90 dark:via-slate-800/50 dark:to-blue-950/30">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/50 dark:to-purple-950/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Sessions</span>
                <div className="text-xs text-muted-foreground">Professional Guidance</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button 
              onClick={handleNewChat}
              className="w-full justify-start bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12"
              disabled={createSessionMutation.isPending}
            >
              <div className="mr-3 p-1.5 rounded-full bg-white/20">
                <Plus className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">
                  {createSessionMutation.isPending ? 'Creating...' : 'New Career Session'}
                </div>
                <div className="text-xs opacity-90">Start professional guidance</div>
              </div>
            </Button>
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search career sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 rounded-xl"
              />
            </div>
          </div>

          <Separator />

          {/* Chat Sessions */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="space-y-3 p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-pulse text-sm text-muted-foreground font-medium">
                    Loading career sessions...
                  </div>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {searchQuery ? 'No sessions found' : 'No career sessions yet'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-75">
                    Create your first session to begin
                  </p>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-start justify-between rounded-xl p-4 hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:shadow-md",
                      currentSessionId === session.id && "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/50 shadow-sm"
                    )}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                          {session.title.replace('Career Chat', 'Session')}
                        </p>
                        <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {session.messages?.length || 0}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        {new Date(session.updatedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {session.messages?.[0] && (
                        <p className="text-xs text-muted-foreground truncate leading-relaxed">
                          {session.messages[0].content.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
