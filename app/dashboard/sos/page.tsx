"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, MapPin, Shield, Settings, Users, Menu, Volume2, VolumeX, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SOSPage() {
  const [sosActive, setSosActive] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const triggerSOS = () => {
    if (!sosActive) {
      // Start countdown
      setCountdown(5)
    } else {
      // Cancel SOS
      setSosActive(false)
      setCountdown(0)
    }
  }

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
        if (countdown === 1) {
          setSosActive(true)
          // In a real app, this would trigger notifications to contacts and authorities
          alert("SOS Alert activated! Notifying your emergency contacts and nearby authorities.")
        }
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [countdown])

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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
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
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
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
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-50"
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
            {sosActive ? "CANCEL SOS" : countdown > 0 ? `SOS IN ${countdown}...` : "SOS ALERT"}
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Emergency SOS & Personal Alarm</h1>
          <p className="text-gray-500">Configure your emergency alert settings and personal alarm</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Emergency SOS Button</CardTitle>
              <CardDescription>Press the SOS button to alert your emergency contacts and authorities</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-8 text-center">
                <p className="text-gray-500 mb-4">
                  When activated, your current location and personal information will be shared with your emergency
                  contacts and local authorities.
                </p>
                <Button
                  className={`w-40 h-40 rounded-full text-xl font-bold ${sosActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={triggerSOS}
                >
                  {sosActive ? "CANCEL SOS" : countdown > 0 ? `SOS IN ${countdown}...` : "SOS ALERT"}
                </Button>
              </div>
              <div className="grid w-full max-w-md gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="countdown-toggle">Countdown Timer</Label>
                    <p className="text-sm text-gray-500">5-second countdown before sending alert</p>
                  </div>
                  <Switch id="countdown-toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-toggle">Share Location</Label>
                    <p className="text-sm text-gray-500">Include your current location with the alert</p>
                  </div>
                  <Switch id="location-toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="photo-toggle">Send Photos</Label>
                    <p className="text-sm text-gray-500">Automatically capture and send photos with alert</p>
                  </div>
                  <Switch id="photo-toggle" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Alarm</CardTitle>
              <CardDescription>Loud alarm to deter attackers and draw attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <Button
                  className={`w-32 h-32 rounded-full ${isMuted ? "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-12 w-12" /> : <Volume2 className="h-12 w-12" />}
                </Button>
                <p className="text-center text-gray-500">{isMuted ? "Alarm is muted" : "Alarm is ready"}</p>
                <div className="w-full space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <span>{volume}%</span>
                  </div>
                  <Slider
                    id="volume"
                    defaultValue={[80]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    disabled={isMuted}
                  />
                </div>
                <div className="w-full">
                  <Button className="w-full" disabled={isMuted}>
                    Test Alarm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Message</CardTitle>
              <CardDescription>Customize the message sent to your emergency contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                  <p className="text-sm">
                    "EMERGENCY ALERT: I need help! This is an emergency. My current location is being shared with you.
                    Please contact me or emergency services immediately."
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="custom-message">Custom Message</Label>
                    <p className="text-sm text-gray-500">Use a personalized emergency message</p>
                  </div>
                  <Switch id="custom-message" />
                </div>
                <Button className="w-full" variant="outline">
                  <Send className="mr-2 h-4 w-4" /> Edit Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
