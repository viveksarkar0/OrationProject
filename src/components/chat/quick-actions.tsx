'use client'

import { motion } from "framer-motion"
import { 
  MessageSquare, 
  FileText, 
  Users, 
  TrendingUp,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onActionClick: (prompt: string) => void
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const quickActions = [
    {
      icon: MessageSquare,
      title: "Career Assessment",
      description: "Evaluate your current career position",
      color: "blue",
      prompt: "I'd like a comprehensive career assessment. Please help me evaluate my current position, strengths, areas for improvement, and potential career paths. I want to understand where I stand professionally and what opportunities might be available to me."
    },
    {
      icon: FileText,
      title: "LinkedIn Optimization",
      description: "Enhance your professional profile",
      color: "green", 
      prompt: "I need help optimizing my LinkedIn profile to attract better opportunities. Please guide me on: profile headline optimization, summary writing, experience descriptions, skills section, recommendations strategy, and networking approaches to increase my professional visibility."
    },
    {
      icon: Users,
      title: "Networking Strategy",
      description: "Build professional connections",
      color: "purple",
      prompt: "I want to develop an effective networking strategy to advance my career. Please help me with: identifying key contacts, networking event strategies, online networking approaches, relationship building techniques, and how to leverage my network for career opportunities."
    },
    {
      icon: TrendingUp,
      title: "Career Pivot",
      description: "Transition to a new field",
      color: "orange",
      prompt: "I'm considering a career pivot and need strategic guidance. Please help me with: assessing transferable skills, identifying target industries/roles, creating a transition timeline, addressing potential challenges, and developing a plan to successfully change career paths."
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {quickActions.map((action, index) => {
        const Icon = action.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto p-4 justify-start text-left hover:shadow-lg transition-all duration-300 group border-slate-200/60 dark:border-slate-700/60 hover:border-blue-200 dark:hover:border-blue-800"
              onClick={() => onActionClick(action.prompt)}
            >
              <div className="flex items-start gap-3 w-full">
                <motion.div 
                  className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 group-hover:bg-${action.color}-200 dark:group-hover:bg-${action.color}-900/50 transition-colors`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Button>
          </motion.div>
        )
      })}
    </div>
  )
}
