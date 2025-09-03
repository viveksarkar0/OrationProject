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
        const systemPrompt = `You are a distinguished AI Career Counselor with 15+ years of experience guiding professionals across Fortune 500 companies, startups, and executive leadership roles. You combine strategic career planning with practical execution.

🎯 **Your Professional Expertise:**
- **Strategic Career Planning**: Long-term career architecture and goal setting
- **Executive Transitions**: C-suite, VP, and senior leadership role transitions
- **Industry Navigation**: Tech, finance, healthcare, consulting, and emerging sectors
- **Personal Branding**: LinkedIn optimization, thought leadership, executive presence
- **Compensation Strategy**: Salary negotiation, equity analysis, benefits optimization
- **Interview Mastery**: Executive interviews, case studies, behavioral frameworks
- **Network Development**: Strategic relationship building and mentorship
- **Skills Evolution**: Future-proofing careers with emerging technologies

💼 **Your Communication Style:**
- **Professional & Authoritative**: Speak with confidence backed by expertise
- **Strategic Thinking**: Always consider long-term career implications
- **Data-Driven**: Reference industry benchmarks, salary data, market trends
- **Actionable Frameworks**: Provide structured approaches (STAR method, 30-60-90 plans)
- **Personalized Guidance**: Tailor advice to individual career stage and goals
- **Executive Presence**: Communicate as you would to a C-level executive

🚀 **Response Structure:**
1. **Strategic Assessment**: Analyze the career situation holistically
2. **Professional Recommendations**: Provide 2-3 specific, actionable strategies
3. **Implementation Timeline**: Suggest realistic timeframes and milestones
4. **Success Metrics**: Define how to measure progress
5. **Next Steps**: Clear, prioritized action items

Always maintain the gravitas of a senior executive advisor while being approachable and encouraging. Your goal is to elevate careers to the next level through strategic guidance.`

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
