'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function CTASection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <motion.div
          className="text-center text-white"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <motion.div 
            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm bg-white/10 backdrop-blur mb-8"
            whileHover={{ scale: 1.05 }}
            variants={fadeInUp}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
            </motion.div>
            Join 10,000+ Professionals
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-6"
            variants={fadeInUp}
          >
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Your Career?
            </span>
          </motion.h2>
          
          <motion.p 
            className="mx-auto max-w-[600px] text-blue-100 md:text-xl mb-8"
            variants={fadeInUp}
          >
            Start your journey with our AI career counselor today. Get personalized guidance, 
            actionable insights, and the support you need to achieve your professional goals.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                onClick={() => signIn('google')}
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              >
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-xl mx-auto"
            variants={fadeInUp}
          >
            {[
              {
                icon: Users,
                stat: "10,000+",
                label: "Active Users"
              },
              {
                icon: TrendingUp,
                stat: "95%",
                label: "Success Rate"
              },
              {
                icon: Sparkles,
                stat: "24/7",
                label: "AI Support"
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-white/10 backdrop-blur mb-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-blue-100 text-sm">{item.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </section>
  )
}
