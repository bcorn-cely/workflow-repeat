/**
 * IMAX Hero Section Component
 * 
 * Main hero section for the IMAX content review landing page.
 * Features IMAX branding and example conversation preview.
 */

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Film, Sparkles, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-medium text-foreground">Powered by Advanced AI Technology</span>
        </div>

        <h1 className="mb-6 font-serif text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Transforming Content Distribution: preview deployment visible text
        </h1>

        <p className="mb-10 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/80 md:text-xl">
          Streamline content review, automate marketing generation, and optimize theater distribution. Built specifically
          for IMAX teams to deliver exceptional cinematic experiences worldwide.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="gap-2 shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700">
            Start Conversation
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent"
          >
            View Documentation
          </Button>
        </div>

        <Card className="mt-12 overflow-hidden border-border/50 bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border/50 bg-card px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 shadow-lg shadow-purple-500/20">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-card-foreground">AI Assistant</div>
              <div className="flex items-center gap-1.5 text-xs text-card-foreground/60">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                Ready to help
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-gradient-to-b from-card to-muted/30 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/50">
                <User className="h-4 w-4 text-foreground/70" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-secondary/80 px-4 py-3 shadow-sm">
                  <p className="text-sm text-foreground">Review the new documentary "Planet Earth: IMAX Experience" for distribution</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 shadow-sm shadow-purple-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-purple-500/10 px-4 py-3 shadow-sm">
                  <p className="text-sm text-card-foreground">
                    I'll review <strong>"Planet Earth: IMAX Experience"</strong> and prepare it for distribution.
                  </p>
                  <div className="mt-3 grid gap-2 rounded-lg border border-border/50 bg-background/40 p-3 backdrop-blur-sm">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Content Type:</span>
                      <span className="font-medium text-foreground">Documentary</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Duration:</span>
                      <span className="font-medium text-foreground">120 minutes</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/60">Target Markets:</span>
                      <span className="font-medium text-foreground">US, CA, UK, AU</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 bg-muted/50 px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-card-foreground/60">
              <div className="h-2 w-2 rounded-full bg-purple-600 shadow-sm shadow-purple-500/40"></div>
              Example conversation - Start your own to review content
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

function User({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

