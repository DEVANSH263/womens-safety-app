"use client"

import type React from "react"

import Link from "next/link"
import { Shield, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeatureLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function FeatureLayout({ children, title, description }: FeatureLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-xl font-bold">SafetyGuard</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </Link>
          <Button
            className="rounded-full font-bold bg-red-600 hover:bg-red-700"
            size="sm"
            onClick={() => alert("SOS Alert activated! Notifying your emergency contacts and nearby authorities.")}
          >
            SOS ALERT
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
        {children}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 SafetyGuard. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
