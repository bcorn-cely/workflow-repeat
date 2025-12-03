/**
 * IMAX Use Cases Section Component
 * 
 * Displays key use cases for the IMAX content review platform.
 * Features content review, marketing generation, and distribution workflows.
 */

"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function UseCasesSection() {
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
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const useCases = [
    {
      title: "Content Review",
      description: "Automate content analysis and review workflows with AI-powered insights and recommendations",
      benefits: ["Automated quality analysis", "Target audience identification", "Distribution recommendations"],
    },
    {
      title: "Marketing Generation",
      description: "Generate compelling marketing materials including taglines, social posts, and press releases",
      benefits: ["AI-generated taglines", "Multi-platform social posts", "Professional press releases"],
    },
    {
      title: "Theater Distribution",
      description: "Plan and coordinate content distribution across IMAX theaters worldwide",
      benefits: ["Real-time availability checks", "Market coverage analysis", "Distribution optimization"],
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="border-y border-border/30 bg-gradient-to-b from-secondary/30 via-background to-secondary/30 py-16 md:py-24"
    >
      <div className="container px-6">
        <div className="mx-auto max-w-5xl">
          <div
            className={`mb-12 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h2 className="mb-4 font-serif text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Built for Real IMAX Workflows
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-foreground/80">
              See how IMAX Content Intelligence streamlines your content distribution operations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className={`border-border/50 bg-card p-8 transition-all duration-700 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-bold text-card-foreground">{useCase.title}</h3>
                  <p className="text-sm leading-relaxed text-card-foreground/70">{useCase.description}</p>
                </div>

                <ul className="space-y-3">
                  {useCase.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-card-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

