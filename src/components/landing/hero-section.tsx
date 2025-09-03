'use client'

import { Button } from "@/components/ui/button"
import { GradientBg } from "@/components/ui/gradient-bg"
import { Icons } from "@/components/ui/icons"
import { signIn } from "next-auth/react"
import { ArrowRight, Sparkles, Brain, Target, Play, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function HeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <GradientBg className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl" ref={ref}>
        <motion.div 
          className="flex flex-col items-center space-y-8 text-center"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <motion.div className="space-y-6" variants={fadeInUp}>
            <motion.div 
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-background/50 backdrop-blur shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
              </motion.div>
              AI-Powered Career Guidance
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              variants={fadeInUp}
            >
              Your AI Career
              <motion.span 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {" "}Counselor
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
              variants={fadeInUp}
            >
              Get personalized career advice, job search strategies, and professional guidance 
              from our advanced AI counselor. Navigate your career journey with confidence.
            </motion.p>
          </motion.div>
          
          <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => signIn('google')}
              >
                <Icons.google className="mr-2 h-5 w-5" />
                Get Started with Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="shadow-lg hover:shadow-xl transition-all duration-300">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 mt-8"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>10,000+ Career Plans Created</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 AI Support</span>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Get intelligent career recommendations based on your skills and goals",
                color: "blue"
              },
              {
                icon: Target,
                title: "Personalized Guidance",
                description: "Receive tailored advice for your unique career situation and aspirations",
                color: "purple"
              },
              {
                icon: Sparkles,
                title: "24/7 Availability",
                description: "Access career counseling anytime, anywhere with our AI assistant",
                color: "indigo"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="group flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`p-4 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </GradientBg>
  )
}
