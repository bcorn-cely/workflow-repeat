/**
 * IMAX Landing Page
 * 
 * Main landing page for the IMAX content review application.
 * Features hero section, cache demo, stats, features, use cases, and CTA sections.
 */

import { Header } from "@/components/imax/header"
import { HeroSection } from "@/components/imax/hero-section"
import { FeaturesGrid } from "@/components/imax/features-grid"
import { StatsSection } from "@/components/imax/stats-section"
import { UseCasesSection } from "@/components/imax/use-cases-section"
import { CTASection } from "@/components/imax/cta-section"
import { ChatbotWrapper } from "@/components/imax/chatbot-wrapper"
import { CacheDemo } from "@/components/imax/cache-demo"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      {/* Cache Revalidation Demo - At the top, prominently displayed */}
      <section className="container px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <CacheDemo />
        </div>
      </section>
      <StatsSection />
      <FeaturesGrid />
      <UseCasesSection />
      <CTASection />
      {/* ChatbotWrapper handles its own Suspense boundary internally */}
      <ChatbotWrapper />
    </main>
  )
}
