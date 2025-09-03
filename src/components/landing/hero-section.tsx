'use client'

import { Button } from "@/components/ui/button"
import { GradientBg } from "@/components/ui/gradient-bg"
import { Icons } from "@/components/ui/icons"
import { signIn } from "next-auth/react"
import { ArrowRight, Sparkles, Brain, Target } from "lucide-react"

export function HeroSection() {
  return (
    <GradientBg className="min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background/50 backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Career Guidance
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Your AI Career
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Counselor
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Get personalized career advice, job search strategies, and professional guidance 
              from our advanced AI counselor. Navigate your career journey with confidence.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => signIn('google')}
            >
              <Icons.google className="mr-2 h-5 w-5" />
              Get Started with Google
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl">
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
              <p className="text-sm text-gray-500 text-center">
                Get intelligent career recommendations based on your skills and goals
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Personalized Guidance</h3>
              <p className="text-sm text-gray-500 text-center">
                Receive tailored advice for your unique career situation and aspirations
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold">24/7 Availability</h3>
              <p className="text-sm text-gray-500 text-center">
                Access career counseling anytime, anywhere with our AI assistant
              </p>
            </div>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}
