export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ChatSession {
  id: string
  title: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  userId?: string | null
  messages?: Message[]
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
  chatSessionId: string
}

export interface ChatState {
  sessions: ChatSession[]
  currentSessionId: string | null
  messages: Message[]
  isLoading: boolean
  isTyping: boolean
}
