'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Brain, 
  Target, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  Award,
  MessageSquare
} from "lucide-react"

export function FeaturesSection() {
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

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your skills, experience, and career goals to provide personalized recommendations.",
      color: "blue"
    },
    {
      icon: Target,
      title: "Goal-Oriented Planning",
      description: "Set clear career objectives and receive step-by-step guidance to achieve your professional aspirations.",
      color: "purple"
    },
    {
      icon: MessageSquare,
      title: "Interactive Counseling",
      description: "Engage in natural conversations with our AI counselor that understands context and provides meaningful advice.",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Stay updated with real-time job market trends, salary data, and industry growth opportunities.",
      color: "orange"
    },
    {
      icon: Users,
      title: "Network Building",
      description: "Get guidance on building professional networks and connecting with industry leaders in your field.",
      color: "pink"
    },
    {
      icon: Award,
      title: "Skill Development",
      description: "Identify skill gaps and receive personalized learning paths to enhance your professional capabilities.",
      color: "indigo"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access career guidance whenever you need it, with instant responses and continuous support.",
      color: "teal"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your career data is encrypted and secure. We prioritize your privacy and confidentiality above all.",
      color: "red"
    },
    {
      icon: Sparkles,
      title: "Continuous Learning",
      description: "Our AI continuously learns from interactions to provide increasingly accurate and helpful advice.",
      color: "yellow"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <motion.div 
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Powerful Features
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            variants={fadeInUp}
          >
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Career Success
            </span>
          </motion.h2>
          
          <motion.p 
            className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
            variants={fadeInUp}
          >
            Our comprehensive AI-powered platform provides all the tools and insights you need to navigate your career journey successfully.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
