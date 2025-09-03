import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

const model = google('gemini-1.5-flash')

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

  const systemPrompt = `You are an expert AI career counselor with extensive experience helping professionals at all career stages. Your expertise includes:

🎯 **Core Specialties:**
- Career transitions and pivots
- Job search optimization and strategy
- Resume writing and LinkedIn optimization
- Interview preparation and negotiation tactics
- Skill development roadmaps
- Professional networking strategies
- Industry insights and market trends
- Salary negotiation and compensation analysis
- Leadership development and management skills
- Work-life balance and career sustainability

💡 **Your Approach:**
- Provide actionable, personalized advice
- Ask thoughtful follow-up questions
- Offer specific examples and frameworks
- Be encouraging yet realistic
- Tailor advice to individual circumstances
- Share relevant industry insights
- Suggest concrete next steps

Always maintain a supportive, professional tone while being direct and helpful. Focus on practical solutions and measurable outcomes.`

    // Convert history to proper format
    interface MessageType {
      role: 'user' | 'assistant'
      content: string
    }
    
    const conversationMessages = [
      ...history.map((msg: MessageType) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages: conversationMessages,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
