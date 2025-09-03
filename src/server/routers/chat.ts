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

  // Send a message and get AI response
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
        console.log('Retrieved messages:', messages.length)

        // Generate AI response using Vercel AI SDK
        const systemPrompt = `You are a professional AI Career Counselor with expertise in career development, strategic planning, and professional growth. You provide structured, actionable guidance to help professionals advance their careers.

PROFESSIONAL RESPONSE GUIDELINES:
- Use clear, professional language with proper structure
- Format responses with headings (##), subheadings (**bold**), and bullet points for clarity
- Provide specific, actionable recommendations
- Include relevant industry insights and best practices
- Ask targeted follow-up questions to gather more context
- Maintain a supportive yet professional tone
- NEVER use asterisks (*) for formatting - use proper markdown headings and bullet points

STRUCTURE YOUR RESPONSES:
## Career Analysis

**Situation Assessment**
- Current status evaluation
- Key challenges identified
- Opportunities for growth

**Strategic Recommendations**
- Specific action items
- Timeline for implementation
- Resource suggestions

**Next Steps**
- Immediate actions to take
- Long-term planning considerations
- Follow-up recommendations

**Questions for You**
- What specific aspect would you like to explore further?
- Are there particular challenges you're facing?
- What timeline are you working with?

Always provide value-driven, professional guidance that helps users make informed career decisions. Use proper headings and formatting for clarity.`

        // Prepare conversation context with proper typing
        const conversationMessages = messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))
        console.log('Prepared conversation messages for AI')

        const { text: aiResponse } = await generateText({
          model,
          system: systemPrompt,
          messages: conversationMessages,
          temperature: 0.7,
        })
        console.log('AI response generated:', aiResponse.substring(0, 100) + '...')

        // Save AI response
        const assistantMessage = await ctx.db.message.create({
          data: {
            content: aiResponse,
            role: 'assistant',
            chatSessionId: input.sessionId,
          },
        })
        console.log('Assistant message saved:', assistantMessage)

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
