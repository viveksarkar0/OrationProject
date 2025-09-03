'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, Star, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export function PricingSection() {
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

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for exploring career options",
      icon: Star,
      features: [
        "5 AI counseling sessions per month",
        "Basic career assessment",
        "Resume review",
        "Job market insights",
        "Email support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for active job seekers",
      icon: Zap,
      features: [
        "Unlimited AI counseling sessions",
        "Advanced career planning",
        "Interview preparation",
        "Salary negotiation guidance",
        "LinkedIn profile optimization",
        "Priority support",
        "Industry-specific insights"
      ],
      buttonText: "Start Professional",
      popular: true,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      name: "Executive",
      price: "$99",
      period: "per month",
      description: "For senior professionals and leaders",
      icon: Crown,
      features: [
        "Everything in Professional",
        "Executive coaching sessions",
        "Leadership development plans",
        "C-suite transition guidance",
        "Board readiness assessment",
        "Personal branding strategy",
        "1-on-1 expert consultations",
        "Custom career roadmaps"
      ],
      buttonText: "Go Executive",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
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
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="mr-2 h-4 w-4" />
            Pricing Plans
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            variants={fadeInUp}
          >
            Choose Your
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Career Path
            </span>
          </motion.h2>
          
          <motion.p 
            className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
            variants={fadeInUp}
          >
            Start free and upgrade as your career grows. All plans include our core AI counseling features.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={index}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 shadow-2xl scale-105' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl'
                }`}
                variants={fadeInUp}
                whileHover={{ y: plan.popular ? 0 : -5 }}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <motion.div 
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Free" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: featureIndex * 0.1 + 0.3 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                    } transition-all duration-300`}
                    onClick={() => signIn('google')}
                  >
                    {plan.buttonText}
                  </Button>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-20 text-center"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Our Starter plan is free forever. You can also try Professional free for 7 days."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid plans."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="text-left p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-semibold mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
