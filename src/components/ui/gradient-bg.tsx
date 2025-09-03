import { cn } from "@/lib/utils"

interface GradientBgProps {
  className?: string
  children?: React.ReactNode
}

export function GradientBg({ className, children }: GradientBgProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/30 to-cyan-600/30 rounded-full blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
