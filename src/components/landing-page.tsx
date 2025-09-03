'use client'

import { CTASection } from "./landing/cta-section"
import { FeaturesSection } from "./landing/features-section"
import { Footer } from "./landing/footer"
import { HeroSection } from "./landing/hero-section"
import { PricingSection } from "./landing/pricing-section"
import { TestimonialsSection } from "./landing/testimonials-section"


export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
