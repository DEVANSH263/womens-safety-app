"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MapPin, Shield, Settings, Users, Menu, Plus, Trash2, Edit, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GeofencingPage() {
  const [safeZones, setSafeZones] = useState([
    { id: 1, name: "Home", address: "123 Main Street", radius: 200, active: true },
    { id: 2, name: "Work", address: "456 Office Plaza", radius: 150, active: true },
    { id: 3, name: "Campus", address: "University Area", radius: 300, active: true },
  ])

  const [selectedZone, setSelectedZone] = useState(null)
  const [radius, setRadius] = useState(200)

  const addSafeZone = (newZone) => {
    setSafeZones([...safeZones, { id: safeZones.length + 1, ...newZone, active: true }])
  }

  const deleteSafeZone = (id) => {
    setSafeZones(safeZones.filter((zone) => zone.id !== id))
  }

  const toggleZone = (id) => {
    setSafeZones(safeZones.map((zone) => (zone.id === id ? { ...zone, active: !zone.active } : zone)))
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Bell className="h-5 w-5" />
                  SOS Alarm
                </Link>
                <Link
                  href="/dashboard/geofencing"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
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
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Bell className="h-4 w-4" />
            SOS
          </Link>
          <Link
            href="/dashboard/geofencing"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-50"
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
            className="rounded-full font-bold bg-red-600 hover:bg-red-700"
            size="lg"
            onClick={() => alert("SOS Alert activated! Notifying your emergency contacts and nearby authorities.")}
          >
            SOS ALERT
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Geo-fencing</h1>
            <p className="text-gray-500">Set up safe zones and get notified when entering or leaving them</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" /> Add Safe Zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Safe Zone</DialogTitle>
                <DialogDescription>Create a new safe zone to monitor your location.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  addSafeZone({
                    name: formData.get("name"),
                    address: formData.get("address"),
                    radius: radius,
                  })
                  document.querySelector("dialog")?.close()
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Zone Name</Label>
                    <Input id="name" name="name" placeholder="Home, Work, etc." required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="Enter address" required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label htmlFor="radius">Radius (meters)</Label>
                      <span>{radius}m</span>
                    </div>
                    <Slider
                      id="radius"
                      defaultValue={[200]}
                      min={50}
                      max={500}
                      step={10}
                      onValueChange={(value) => setRadius(value[0])}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Zone</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <CardDescription>View and manage your safe zones</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Map view loading...</p>
                </div>
                <img
                  alt="Map view with geo-fencing zones"
                  className="w-full object-cover"
                  height="500"
                  src="/placeholder.svg?height=500&width=800"
                  width="800"
                />
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-950 p-2 rounded-lg shadow-lg">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Show zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      <SelectItem value="active">Active Zones</SelectItem>
                      <SelectItem value="inactive">Inactive Zones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Safe Zones</CardTitle>
              <CardDescription>Locations where you feel safe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {safeZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${zone.active ? "bg-green-100 dark:bg-green-900" : "bg-gray-200 dark:bg-gray-800"} flex items-center justify-center`}
                      >
                        <MapPin
                          className={`h-6 w-6 ${zone.active ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {zone.address} • {zone.radius}m radius
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={zone.active} onCheckedChange={() => toggleZone(zone.id)} />
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => deleteSafeZone(zone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when you receive geo-fence alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="exit-alerts">Exit Alerts</Label>
                    <p className="text-sm text-gray-500">Notify when leaving safe zones</p>
                  </div>
                  <Switch id="exit-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="entry-alerts">Entry Alerts</Label>
                    <p className="text-sm text-gray-500">Notify when entering safe zones</p>
                  </div>
                  <Switch id="entry-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contact-notify">Notify Contacts</Label>
                    <p className="text-sm text-gray-500">Alert emergency contacts when leaving safe zones</p>
                  </div>
                  <Switch id="contact-notify" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="schedule-active">Schedule Active Times</Label>
                    <p className="text-sm text-gray-500">Only monitor during specific hours</p>
                  </div>
                  <Switch id="schedule-active" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Geo-fence Events</CardTitle>
              <CardDescription>History of zone entries and exits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
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
                      <path d="M8.5 9.5 L15.5 16.5" />
                      <path d="M15.5 9.5 L8.5 16.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Left Safe Zone: Home</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today, 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
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
                      <path d="M12 13 L12 7" />
                      <path d="M9 10 L12 7 L15 10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Entered Safe Zone: Work</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today, 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
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
                      <path d="M8.5 9.5 L15.5 16.5" />
                      <path d="M15.5 9.5 L8.5 16.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Left Safe Zone: Work</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 6:15 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
