import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

const model = google('gemini-1.5-flash')

export const chatRouter = router({
  // Create a new chat session
  createSession: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('Creating chat session with data:', input)
        
        // First, ensure the user exists or create them
        const user = await ctx.db.user.upsert({
          where: { id: input.userId },
          update: {},
          create: {
            id: input.userId,
            name: 'Anonymous User',
            email: null,
          },
        })
        
        console.log('User ensured:', user)
        
        const session = await ctx.db.chatSession.create({
          data: {
            title: input.title,
            description: input.description || null,
            userId: input.userId,
          },
        })
        console.log('Created session:', session)
        return session
      } catch (error) {
        console.error('Detailed error creating chat session:', error)
        throw new Error(`Failed to create chat session: ${error}`)
      }
    }),

  // Get all chat sessions
  getSessions: publicProcedure
    .input(z.object({
      userId: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return ctx.db.chatSession.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })
    }),

  // Get messages for a chat session
  getMessages: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      return ctx.db.message.findMany({
        where: {
          chatSessionId: input.sessionId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    }),

  // Send a message and get AI response - combined approach
  sendMessage: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('Sending message:', input)
        
        // Save user message
        const userMessage = await ctx.db.message.create({
          data: {
            content: input.content,
            role: 'user',
            chatSessionId: input.sessionId,
          },
        })
        console.log('User message saved:', userMessage)

        // Get conversation history
        const messages = await ctx.db.message.findMany({
          where: {
            chatSessionId: input.sessionId,
          },
          orderBy: {
            createdAt: 'asc',
          },
        })

        // Simple system prompt
        const systemPrompt = `You are a professional AI Career Counselor. Provide helpful, concise career guidance. Keep responses under 200 words and be direct.`

        // Prepare conversation context
        const conversationMessages = messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))

        const { text: aiResponse } = await generateText({
          model,
          system: systemPrompt,
          messages: conversationMessages,
          temperature: 0.3,
        })

        // Save AI response
        const assistantMessage = await ctx.db.message.create({
          data: {
            content: aiResponse,
            role: 'assistant',
            chatSessionId: input.sessionId,
          },
        })

        // Update session timestamp
        await ctx.db.chatSession.update({
          where: { id: input.sessionId },
          data: { updatedAt: new Date() },
        })

        return {
          userMessage,
          assistantMessage,
        }
      } catch (error) {
        console.error('Detailed error in sendMessage:', error)
        throw new Error(`Failed to send message: ${error}`)
      }
    }),

  // Delete a chat session
  deleteSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.chatSession.delete({
        where: {
          id: input.sessionId,
        },
      })
    }),
})
