'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Brain, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  MapPin,
  Phone,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
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
    <footer className="bg-gray-900 text-white pt-16 pb-8" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Newsletter Section */}
        <motion.div
          className="border-b border-gray-800 pb-12 mb-12"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest career insights, AI updates, and success stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {/* Company Info */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center mb-6">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mr-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold">CareerAI</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering professionals worldwide with AI-driven career guidance and personalized insights for success.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "#" }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-semibold mb-6">Product</h4>
            <ul className="space-y-3">
              {[
                "AI Career Counselor",
                "Resume Builder",
                "Interview Prep",
                "Salary Insights",
                "Skill Assessment",
                "Job Matching"
              ].map((link, index) => (
                <motion.li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors hover:underline"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Press",
                "Blog",
                "Partners",
                "Contact"
              ].map((link, index) => (
                <motion.li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors hover:underline"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span>support@careerai.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-blue-400" />
                <span>
                  123 Innovation Drive<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <div className="text-gray-400 mb-4 md:mb-0">
            © 2024 CareerAI. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
              "Security"
            ].map((link, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
