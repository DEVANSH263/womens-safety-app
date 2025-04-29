"use client"

import Link from "next/link"
import { Shield, MapPin, Bell, Users, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="ml-2 text-xl font-bold">SafetyGuard</span>
          </Link>
          <nav className="flex gap-8">
            <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/features">
              Features
            </Link>
            <a className="text-sm font-medium hover:text-red-600 transition-colors" href="#how-it-works">
              How It Works
            </a>
            <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/contact">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 border-b bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  Safety at Your Fingertips for Women on the Move
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  SafetyGuard provides instant assistance during emergencies. With real-time location tracking,
                  emergency alerts, and police integration, we create a safer environment for women everywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Get Started
                  </Button>
                  <Link href="/features" className="flex-1 sm:flex-none">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto lg:mr-0 max-w-[500px] w-full">
                <div className="overflow-hidden rounded-xl border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950 aspect-[4/5]">
                  <img
                    alt="Safety App Interface"
                    className="w-full h-full object-cover"
                    src="/ChatGPT%20Image%20Apr%209,%202025,%2011_28_35%20AM.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features-section" className="w-full py-16 md:py-24 lg:py-32 border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 mb-4">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                Safety Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Access all safety features with one click
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              <Link href="/location-tracking">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Location Tracking</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Track your real-time location and share it with trusted contacts
                  </p>
                </div>
              </Link>

              <Link href="/sos-alarm">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Emergency SOS</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Trigger emergency alerts and personal alarms with one tap
                  </p>
                </div>
              </Link>

              <Link href="/safe-contacts">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Safe Contacts</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Manage your emergency contacts who will be notified during emergencies
                  </p>
                </div>
              </Link>

              <Link href="/geo-fencing">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <svg
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Geo-Fencing</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Set up safe zones and receive notifications when entering or leaving them
                  </p>
                </div>
              </Link>

              <Link href="/police-integration">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Police Integration</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Connect with local police stations for faster emergency response
                  </p>
                </div>
              </Link>

              <Link href="/emergency-assistance">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                    <svg
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Emergency Assistance</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Track if assistance has been dispatched and monitor response status
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 border-b bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-white px-3 py-1 text-sm dark:bg-gray-900 mb-4">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                Simple Steps For Your Safety
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                SafetyGuard is designed to be intuitive and easy to use, especially during emergencies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Sign Up & Set Up</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Create your account and add your emergency contacts and customize your safety settings.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Enable Location Services</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Allow location tracking for real-time monitoring and geo-fencing capabilities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Activate When Needed</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  In case of emergency, activate the SOS button to alert your contacts and authorities instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                Join SafetyGuard Today
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Take control of your safety with our comprehensive protection platform.
              </p>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 min-w-[200px]">
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 SafetyGuard. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" href="/terms">
              Terms of Service
            </Link>
            <Link className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" href="/privacy">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
