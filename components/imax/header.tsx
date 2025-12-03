/**
 * IMAX Header Component
 * 
 * Navigation header for the IMAX content review application.
 * Features scroll-based visibility and IMAX branding.
 */

"use client"

import { Button } from "@/components/ui/button"
import { Film, Settings, Bell, User } from "lucide-react"
import { useEffect, useState } from "react"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 800) {
        // Scrolling down - hide header
        setVisible(false)
      } else {
        // Scrolling up - show header
        setVisible(true)
      }

      setScrolled(currentScrollY > 20)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        visible ? "top-4 left-4 right-4" : "-top-24 left-4 right-4"
      }`}
    >
      <div
        className={`bg-card/95 backdrop-blur-md border border-border/50 shadow-xl rounded-3xl transition-all duration-300 ${
          scrolled ? "shadow-2xl shadow-purple-500/10" : "shadow-xl"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20">
                <Film className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold leading-none tracking-tight text-card-foreground">
                IMAX Content Intelligence
                </span>
                <span className="text-[10px] font-medium uppercase leading-none tracking-wider text-muted-foreground">
                  Content Review Platform
                </span>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <a href="#" className="text-sm font-medium text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300">
                Assistant
              </a>
              <a href="#" className="text-sm font-medium text-card-foreground/90 transition-colors hover:text-purple-600 dark:hover:text-purple-400">
                Content Library
              </a>
              <a href="#" className="text-sm font-medium text-card-foreground/90 transition-colors hover:text-purple-600 dark:hover:text-purple-400">
                Analytics
              </a>
              <a href="#" className="text-sm font-medium text-card-foreground/90 transition-colors hover:text-purple-600 dark:hover:text-purple-400">
                Resources
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-card-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-card-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-card-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

