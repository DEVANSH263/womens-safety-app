"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MapPin, Shield, Settings, Users, Menu, AlertTriangle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Dashboard() {
  const [sosActive, setSosActive] = useState(false)

  const triggerSOS = () => {
    setSosActive(!sosActive)
    // In a real app, this would trigger notifications to contacts and authorities
    if (!sosActive) {
      alert("SOS Alert activated! Notifying your emergency contacts and nearby authorities.")
    } else {
      alert("SOS Alert deactivated.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-red-600">
                  <Shield className="h-5 w-5" />
                  <span>SafetyGuard</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                >
                  <MapPin className="h-5 w-5" />
                  Map
                </Link>
                <Link
                  href="/dashboard/contacts"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Users className="h-5 w-5" />
                  Contacts
                </Link>
                <Link
                  href="/dashboard/sos"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Bell className="h-5 w-5" />
                  SOS Alarm
                </Link>
                <Link
                  href="/dashboard/geofencing"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <svg
                    className="h-5 w-5"
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
                  Geo-fencing
                </Link>
                <Link
                  href="/dashboard/police"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Phone className="h-5 w-5" />
                  Police
                </Link>
                <Link
                  href="/dashboard/assistance"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <svg
                    className="h-5 w-5"
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
                  Assistance
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Shield className="h-5 w-5 text-red-600" />
            <span>SafetyGuard</span>
          </Link>
        </div>
        <nav className="hidden gap-5 md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-50"
          >
            <MapPin className="h-4 w-4" />
            Map
          </Link>
          <Link
            href="/dashboard/contacts"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Users className="h-4 w-4" />
            Contacts
          </Link>
          <Link
            href="/dashboard/sos"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Bell className="h-4 w-4" />
            SOS
          </Link>
          <Link
            href="/dashboard/geofencing"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <svg
              className="h-4 w-4"
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
            Geo-fence
          </Link>
          <Link
            href="/dashboard/police"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Phone className="h-4 w-4" />
            Police
          </Link>
          <Link
            href="/dashboard/assistance"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <svg
              className="h-4 w-4"
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
            Assist
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            className={`rounded-full font-bold ${sosActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-600 hover:bg-red-700"}`}
            size="lg"
            onClick={triggerSOS}
          >
            {sosActive ? "CANCEL SOS" : "SOS ALERT"}
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-2 xl:grid-cols-3">
          <div className="col-span-1 xl:col-span-2">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Real-Time Location</CardTitle>
                <CardDescription>Your current location and surroundings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Map view loading...</p>
                  </div>
                  <img
                    alt="Map view"
                    className="w-full object-cover"
                    height="500"
                    src="/placeholder.svg?height=500&width=800"
                    width="800"
                  />
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-950 p-2 rounded-lg shadow-lg">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Share Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 col-span-1">
            <Card className="col-span-1">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>People who will be notified during an emergency</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mother • +1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Michael Chen</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Brother • +1 (555) 987-6543</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jessica Patel</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Friend • +1 (555) 456-7890</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Manage Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Safe Zones</CardTitle>
                <CardDescription>Geo-fencing areas that are marked as safe</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Home</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">123 Main Street</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Work</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">456 Office Plaza</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Campus</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">University Area</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">
                    Add Safe Zone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your safety events and alerts history</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Left Safe Zone: Home</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today, 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Entered Safe Zone: Work</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today, 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">SOS Alert Triggered (Test)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 8:15 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Added New Contact: Jessica Patel</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 2:45 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
