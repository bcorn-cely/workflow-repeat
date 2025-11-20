import { Button } from "@/components/ui/button"
import { ArrowRight, CreditCard, Shield, Sparkles, Users, Wallet, TrendingUp, Lock, Bell } from "lucide-react"
import { GreenlightChatbotWrapper } from "@/components/greenlight/chatbot-wrapper"

export default function GreenlightPage() {
  return (
    <div className="greenlight-theme min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Greenlight</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </a>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Modern banking platform</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
              Financial tools
              <br />
              <span className="text-primary">built for teams</span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Empower your organization with smart spending controls, real-time insights, and seamless payment workflows
              that scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent">
                Schedule demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center lg:text-left">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">2M+</div>
              <div className="text-sm text-muted-foreground">Active businesses</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">$18B</div>
              <div className="text-sm text-muted-foreground">Transactions processed</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Platform uptime</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Customer support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Everything your finance team needs</h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            From expense management to payroll automation, we've got you covered
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart spend control</h3>
            <p className="text-muted-foreground leading-relaxed">
              Set custom spending limits, approve expenses in real-time, and get instant notifications for every
              transaction across your entire organization.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-6 group-hover:bg-chart-2/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-chart-2" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualize spending patterns, track budget allocations, and generate comprehensive reports with powerful
              dashboards built for finance leaders.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center mb-6 group-hover:bg-chart-3/20 transition-colors">
              <Users className="w-6 h-6 text-chart-3" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Team collaboration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Seamless workflows for managers and employees with role-based permissions, automated approvals, and
              integrated expense submissions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center mb-6 group-hover:bg-chart-4/20 transition-colors">
              <Shield className="w-6 h-6 text-chart-4" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Bank-level security</h3>
            <p className="text-muted-foreground leading-relaxed">
              256-bit encryption, multi-factor authentication, and SOC 2 Type II compliance to keep your financial data
              secure at all times.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-chart-5/10 flex items-center justify-center mb-6 group-hover:bg-chart-5/20 transition-colors">
              <CreditCard className="w-6 h-6 text-chart-5" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Virtual & physical cards</h3>
            <p className="text-muted-foreground leading-relaxed">
              Issue unlimited virtual cards for online purchases and physical cards for in-person spending, all managed
              from a single platform.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Instant notifications</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stay informed with real-time alerts for transactions, budget thresholds, approval requests, and unusual
              spending activity.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Enterprise-grade security</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Built on trust and transparency</h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand that security isn't optional when it comes to financial data. That's why we've built
                Greenlight with multiple layers of protection and compliance frameworks that exceed industry standards.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">SOC 2 Type II Certified</div>
                    <div className="text-sm text-muted-foreground">
                      Independently audited for security, availability, and confidentiality
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">PCI DSS Compliant</div>
                    <div className="text-sm text-muted-foreground">
                      Meeting the highest standards for payment card security
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">FDIC Insured</div>
                    <div className="text-sm text-muted-foreground">
                      Your funds are protected up to $250,000 per account
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-4/20 p-12 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-background border border-border flex items-center justify-center">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold">100%</div>
                    <div className="text-lg text-muted-foreground">Protected & Encrypted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-chart-2/5 to-transparent border border-primary/20 p-12 lg:p-20">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
              Ready to transform your financial operations?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10">
              Join thousands of businesses already managing their finances smarter with Greenlight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-transparent">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Greenlight</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern financial tools for modern businesses.</p>
            </div>

            <div>
              <div className="font-semibold mb-4">Product</div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Integrations
                </a>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Company</div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-4">Resources</div>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">© 2025 Greenlight. All rights reserved.</div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
      <GreenlightChatbotWrapper />
    </div>
  )
}
