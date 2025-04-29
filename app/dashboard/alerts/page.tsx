"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MapPin, Shield, Settings, Users, Menu, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AlertsPage() {
  const [alertHistory] = useState([
    { id: 1, type: "sos", status: "Test", date: "May 15, 2025", time: "8:15 PM", location: "Home" },
    { id: 2, type: "zone_exit", status: "Resolved", date: "May 14, 2025", time: "7:30 PM", location: "Work" },
    { id: 3, type: "zone_entry", status: "Resolved", date: "May 14, 2025", time: "8:45 AM", location: "Work" },
    { id: 4, type: "sos", status: "Test", date: "May 12, 2025", time: "6:20 PM", location: "Downtown" },
    { id: 5, type: "inactivity", status: "Resolved", date: "May 10, 2025", time: "10:15 PM", location: "Unknown" },
  ])

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
                  href="/dashboard/alerts"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                >
                  <Bell className="h-5 w-5" />
                  Alerts
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
            href="/dashboard/alerts"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-50"
          >
            <Bell className="h-4 w-4" />
            Alerts
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Alert Settings & History</h1>
        </div>

        <Tabs defaultValue="settings" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="settings">Alert Settings</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>Customize when and how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <Label htmlFor="geo-fence-alerts">Geo-Fence Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when entering or leaving safe zones</p>
                  </div>
                  <Switch id="geo-fence-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <Label htmlFor="inactivity-alerts">Inactivity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert contacts if no movement is detected for a period of time
                    </p>
                  </div>
                  <Switch id="inactivity-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <Label htmlFor="schedule-alerts">Scheduled Check-ins</Label>
                    <p className="text-sm text-muted-foreground">Set regular check-in times for your safety</p>
                  </div>
                  <Switch id="schedule-alerts" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <Label htmlFor="sound-alarm">Sound Alarm</Label>
                    <p className="text-sm text-muted-foreground">Play a loud alarm sound when SOS is triggered</p>
                  </div>
                  <Switch id="sound-alarm" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <Label htmlFor="authority-notification">Authority Notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically notify local authorities during an emergency
                    </p>
                  </div>
                  <Switch id="authority-notification" defaultChecked />
                </div>
                <Button className="mt-4">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Record of your recent safety alerts and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {alertHistory.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            alert.type === "sos"
                              ? "bg-red-100 dark:bg-red-900"
                              : alert.type === "zone_exit"
                                ? "bg-orange-100 dark:bg-orange-900"
                                : "bg-green-100 dark:bg-green-900"
                          }`}
                        >
                          {alert.type === "sos" ? (
                            <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
                          ) : alert.type === "zone_exit" ? (
                            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          ) : alert.type === "inactivity" ? (
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {alert.type === "sos"
                              ? "SOS Alert"
                              : alert.type === "zone_exit"
                                ? "Left Safe Zone"
                                : alert.type === "zone_entry"
                                  ? "Entered Safe Zone"
                                  : "Inactivity Alert"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {alert.date} at {alert.time} • {alert.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            alert.status === "Test"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                              : alert.status === "Resolved"
                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Test SOS Features</CardTitle>
            <CardDescription>Practice using the emergency features without sending real alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can test the SOS features to make sure they work correctly. Your emergency contacts will be notified
                that this is just a test.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert("Test mode: SOS Button functionality is working correctly")}
                >
                  Test SOS Button
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert("Test mode: Location sharing is working correctly")}
                >
                  Test Location Sharing
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => alert("Test mode: Alert siren is working correctly")}
                >
                  Test Alert Siren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
