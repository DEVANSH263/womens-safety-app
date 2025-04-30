"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MapPin, Shield, Settings, Users, Menu, Phone, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PolicePage() {
  const [policeStations, setPoliceStations] = useState([
    {
      id: 1,
      name: "Central Police Station",
      address: "123 Main Street",
      phone: "+1 (555) 123-4567",
      distance: "1.2 km",
    },
    {
      id: 2,
      name: "Westside Police Department",
      address: "456 West Avenue",
      phone: "+1 (555) 987-6543",
      distance: "3.5 km",
    },
    {
      id: 3,
      name: "Northside Precinct",
      address: "789 North Boulevard",
      phone: "+1 (555) 456-7890",
      distance: "4.8 km",
    },
    {
      id: 4,
      name: "University Campus Police",
      address: "101 University Drive",
      phone: "+1 (555) 234-5678",
      distance: "2.3 km",
    },
  ])

  const [contacts] = useState([
    { id: 1, name: "Emergency Services", phone: "100", description: "Police, Fire, Medical" },
    { id: 2, name: "Women's Helpline", phone: "+1 (800) 799-7233", description: "24/7 Support" },
    { id: 3, name: "Campus Security", phone: "+1 (555) 111-2222", description: "University Security" },
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
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
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-50"
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Police & Emergency Services</h1>
          <p className="text-gray-500">Find and contact nearby police stations and emergency services</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Nearby Police Stations</CardTitle>
              <CardDescription>View police stations in your area</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Map view loading...</p>
                </div>
                <img
                  alt="Map view with police stations"
                  className="w-full object-cover"
                  height="500"
                  src="/placeholder.svg?height=500&width=800"
                  width="800"
                />
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-950 p-2 rounded-lg shadow-lg">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search area" className="pl-8 w-64" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="stations" className="md:col-span-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="stations">Police Stations</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            </TabsList>
            <TabsContent value="stations">
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Police Stations</CardTitle>
                  <CardDescription>Contact information for local police</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {policeStations.map((station) => (
                      <div
                        key={station.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-blue-600 dark:text-blue-400"
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
                              <path d="m5.2 19.1-1.4 1.3c-.6.7-1.6.7-2.2.1C.5 19.5 0 18.2 0 17V5c0-1.3.5-2.6 1.6-3.5.6-.6 1.6-.6 2.2.1l1.4 1.3c.6.6.6 1.6 0 2.2L3.7 6.3c-.2.2-.3.5-.3.8v7.8c0 .3.1.6.3.8l1.5 1.2c.6.6.6 1.6 0 2.2zM8 13a1 1 0 0 1 0-2h3v-1h-2a1 1 0 0 1 0-2h2V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{station.address}</p>
                            <Badge variant="outline" className="mt-1">
                              {station.distance}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Police Stations
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Services</CardTitle>
                  <CardDescription>Important emergency contact numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{contact.description}</p>
                            <p className="text-sm font-bold mt-1">{contact.phone}</p>
                          </div>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700">Call Now</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Police Integration</CardTitle>
              <CardDescription>Connect with local police departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-600"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Information</h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>
                          SafetyGuard is integrated with local police departments to provide faster emergency response.
                          Your emergency alerts can be sent directly to the nearest police station.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Register with Local Police</Button>
                <p className="text-sm text-gray-500 text-center">
                  Registration allows police to access your emergency information and respond more quickly
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Time</CardTitle>
              <CardDescription>Average response times in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Police Response</p>
                    <p className="text-xs text-gray-500">Average time for police to arrive</p>
                  </div>
                  <Badge>8-12 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Ambulance Response</p>
                    <p className="text-xs text-gray-500">Average time for medical services</p>
                  </div>
                  <Badge>10-15 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Fire Department</p>
                    <p className="text-xs text-gray-500">Average time for fire services</p>
                  </div>
                  <Badge>7-10 min</Badge>
                </div>
                <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">
                    Response times may vary based on location, traffic conditions, and emergency service availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
