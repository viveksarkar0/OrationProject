'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialsSection() {
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
        staggerChildren: 0.2
      }
    }
  }

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      image: "/api/placeholder/150/150",
      content: "The AI counselor helped me transition from marketing to tech. The personalized roadmap and skill recommendations were spot-on. I landed my dream job at Google within 6 months!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      image: "/api/placeholder/150/150",
      content: "Amazing platform! The career insights and interview preparation guidance were invaluable. The AI understood my goals and provided actionable steps that actually worked.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Netflix",
      image: "/api/placeholder/150/150",
      content: "I was stuck in my career for years. This AI counselor gave me the clarity and direction I needed. The personalized advice felt like having a professional mentor available 24/7.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Airbnb",
      image: "/api/placeholder/150/150",
      content: "The salary negotiation tips and market insights helped me increase my compensation by 40%. The AI's understanding of industry trends is remarkable.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director",
      company: "Spotify",
      image: "/api/placeholder/150/150",
      content: "Transitioning to a leadership role seemed impossible until I found this platform. The leadership development guidance and networking strategies were game-changing.",
      rating: 5
    },
    {
      name: "Alex Patel",
      role: "DevOps Engineer",
      company: "Amazon",
      image: "/api/placeholder/150/150",
      content: "The technical skill assessment and learning path recommendations were incredibly accurate. I went from junior to senior engineer in just 18 months following the AI's guidance.",
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          <motion.div 
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="mr-2 h-4 w-4" />
            Success Stories
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            variants={fadeInUp}
          >
            Trusted by
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}10,000+ Professionals
            </span>
          </motion.h2>
          
          <motion.p 
            className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
            variants={fadeInUp}
          >
            See how our AI career counselor has transformed careers across industries and helped professionals achieve their goals.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="absolute top-6 right-6 text-blue-200 dark:text-blue-800"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <Quote className="h-8 w-8" />
              </motion.div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>

              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-700 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {[
            { number: "10K+", label: "Career Plans Created" },
            { number: "95%", label: "Success Rate" },
            { number: "50+", label: "Industries Covered" },
            { number: "24/7", label: "AI Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
