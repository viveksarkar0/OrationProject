'use client'

import { motion } from "framer-motion"
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Target,
  MessageSquare,
  Award,
  Building,
  Lightbulb,
  Globe
} from "lucide-react"

export function CareerSpecialties() {
  const specialties = [
    {
      icon: Briefcase,
      title: "Career Transitions",
      description: "Navigate industry changes and role pivots",
      color: "blue"
    },
    {
      icon: TrendingUp,
      title: "Executive Coaching",
      description: "Leadership development and C-suite preparation",
      color: "purple"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Management skills and team building strategies",
      color: "green"
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Identify gaps and create learning pathways",
      color: "orange"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Strategic career planning and milestone tracking",
      color: "red"
    },
    {
      icon: MessageSquare,
      title: "Interview Mastery",
      description: "Preparation strategies and confidence building",
      color: "indigo"
    },
    {
      icon: Award,
      title: "Performance Review",
      description: "Maximize evaluations and promotion opportunities",
      color: "pink"
    },
    {
      icon: Building,
      title: "Industry Insights",
      description: "Market trends and sector-specific guidance",
      color: "teal"
    },
    {
      icon: Lightbulb,
      title: "Innovation Leadership",
      description: "Drive change and lead digital transformation",
      color: "yellow"
    },
    {
      icon: Globe,
      title: "Global Careers",
      description: "International opportunities and remote work",
      color: "cyan"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {specialties.map((specialty, index) => {
        const Icon = specialty.icon
        return (
          <motion.div
            key={index}
            className={`group p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 cursor-pointer`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <motion.div 
              className={`p-2 rounded-lg bg-${specialty.color}-100 dark:bg-${specialty.color}-900/30 mb-3 w-fit`}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className={`h-5 w-5 text-${specialty.color}-600 dark:text-${specialty.color}-400`} />
            </motion.div>
            <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {specialty.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {specialty.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
