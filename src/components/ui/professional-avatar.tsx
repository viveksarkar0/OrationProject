'use client'

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, Award, CheckCircle } from "lucide-react"

interface ProfessionalAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  showCredentials?: boolean
  showStatus?: boolean
  animated?: boolean
}

export function ProfessionalAvatar({ 
  size = "md", 
  showCredentials = false, 
  showStatus = true,
  animated = true 
}: ProfessionalAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8", 
    xl: "h-10 w-10"
  }

  const AvatarComponent = animated ? motion.div : "div"
  const avatarProps = animated ? {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <AvatarComponent {...avatarProps}>
          <Avatar className={`${sizeClasses[size]} border-2 border-emerald-200 dark:border-emerald-800 shadow-lg`}>
            <AvatarImage 
              src="/api/placeholder/150/150" 
              alt="Dr. Sarah Chen - Career Counselor"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 text-white font-semibold">
              <div className="flex items-center justify-center">
                <Briefcase className={iconSizes[size]} />
              </div>
            </AvatarFallback>
          </Avatar>
        </AvatarComponent>
        
        {showStatus && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="h-2 w-2 text-white" />
          </motion.div>
        )}
      </div>

      {showCredentials && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              Dr. Sarah Chen
            </span>
            <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              PhD, LCPC
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-3 w-3" />
            <span>Licensed Career Counselor</span>
            <span>•</span>
            <Award className="h-3 w-3" />
            <span>15+ Years Experience</span>
          </div>
        </div>
      )}
    </div>
  )
}
