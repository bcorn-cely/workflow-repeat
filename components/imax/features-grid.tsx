/**
 * IMAX Features Grid Component
 * 
 * Displays key features of the IMAX content review platform.
 * Features content analysis, marketing generation, and distribution capabilities.
 */

"use client"

import { Card } from "@/components/ui/card"
import { Film, Video, BarChart3, Zap, Database, Lock } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const features = [
    {
      icon: Film,
      title: "Content Analysis",
      description: "AI-powered analysis of content quality, target audience, and distribution potential with natural language queries.",
      delay: "delay-0",
    },
    {
      icon: Video,
      title: "Marketing Generation",
      description: "Automated creation of taglines, social media posts, and press releases tailored for IMAX content.",
      delay: "delay-75",
    },
    {
      icon: BarChart3,
      title: "Distribution Analytics",
      description: "Real-time insights into theater availability, market coverage, and distribution performance.",
      delay: "delay-150",
    },
    {
      icon: Zap,
      title: "Instant Workflows",
      description: "Get content reviewed and prepared in minutes, not hours. Our AI orchestrates complex workflows seamlessly.",
      delay: "delay-200",
    },
    {
      icon: Database,
      title: "System Integration",
      description: "Seamlessly connected to all IMAX systems for comprehensive content and theater data access.",
      delay: "delay-300",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with industry regulations to protect sensitive content data.",
      delay: "delay-400",
    },
  ]

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container px-6 relative z-10">
        <div className="mx-auto max-w-5xl">
          <div
            className={`mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="mb-4 font-serif text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Capabilities Designed for IMAX Teams
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              From content analysis to distribution planning, our AI assistant streamlines your workflow with intelligent
              automation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className={`group border-border/50 bg-card p-6 transition-all duration-700 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 ${
                    isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                  } ${feature.delay}`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 shadow-sm shadow-purple-500/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-purple-500/20">
                    <Icon className="h-6 w-6 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground transition-colors group-hover:text-purple-600">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

