"use client"

import Link from "next/link"
import { MapPin, Bell, Users, Phone, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-xl font-bold">SafetyGuard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-red-600" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-2">SafetyGuard Features</h1>
            <p className="text-gray-500 md:text-xl max-w-[800px] mx-auto">
              Explore our comprehensive set of safety features designed to keep you protected
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
                  <MapPin className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Location Tracking</CardTitle>
                <CardDescription>Track your real-time location and share it with trusted contacts</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  Our location tracking feature allows you to share your real-time location with trusted contacts during
                  emergencies or when you feel unsafe. You can also set up automatic location sharing when an SOS alert
                  is triggered.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Real-time location tracking
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Share location with trusted contacts
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Location history for 30 days
                  </li>
                </ul>
                <Link href="/location-tracking">
                  <Button className="w-full">Access Location Tracking</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
                  <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Emergency SOS</CardTitle>
                <CardDescription>Trigger emergency alerts and personal alarms with one tap</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  In case of emergency, activate the SOS button to alert your emergency contacts and local authorities
                  instantly. The personal alarm feature can also be used to deter attackers and draw attention.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> One-tap SOS alert
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Loud personal alarm
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Automatic location sharing
                  </li>
                </ul>
                <Link href="/sos-alarm">
                  <Button className="w-full">Access Emergency SOS</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Safe Contacts</CardTitle>
                <CardDescription>
                  Manage your emergency contacts who will be notified during emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  Add and manage your emergency contacts who will be notified immediately when you activate an alert.
                  You can add family members, friends, or anyone you trust to help in case of an emergency.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Add multiple emergency contacts
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Automatic notifications
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Quick access to emergency services
                  </li>
                </ul>
                <Link href="/safe-contacts">
                  <Button className="w-full">Access Safe Contacts</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
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
                <CardTitle>Geo-Fencing</CardTitle>
                <CardDescription>
                  Set up safe zones and receive notifications when entering or leaving them
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  Set up safe zones and get notified when entering or leaving them. You can also set up alerts for your
                  emergency contacts when you leave a designated safe zone.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Create multiple safe zones
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Entry and exit notifications
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Customizable alert settings
                  </li>
                </ul>
                <Link href="/geo-fencing">
                  <Button className="w-full">Access Geo-Fencing</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Police Integration</CardTitle>
                <CardDescription>Connect with local police stations for faster emergency response</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  Connect with local police stations for faster emergency response times. Find and contact nearby police
                  stations and emergency services with just a few taps.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Find nearby police stations
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Quick emergency calling
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Automatic police notification
                  </li>
                </ul>
                <Link href="/police-integration">
                  <Button className="w-full">Access Police Integration</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <div className="rounded-full bg-red-100 p-3 w-fit dark:bg-red-900 mb-2">
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
                <CardTitle>Emergency Assistance</CardTitle>
                <CardDescription>Track if assistance has been dispatched and monitor response status</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-gray-500 mb-4">
                  Track emergency response status and assistance. Monitor if help has been dispatched and get real-time
                  updates on the status of emergency responders.
                </p>
                <ul className="space-y-2 text-sm text-gray-500 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Real-time response tracking
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Emergency responder ETA
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Emergency history log
                  </li>
                </ul>
                <Link href="/emergency-assistance">
                  <Button className="w-full">Access Emergency Assistance</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
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
