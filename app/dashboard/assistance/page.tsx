"use client"

import { Switch } from "@/components/ui/switch"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  MapPin,
  Shield,
  Settings,
  Users,
  Menu,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AssistancePage() {
  const [activeEmergency, setActiveEmergency] = useState({
    id: "EM-2023-05-15-001",
    status: "in_progress",
    type: "sos",
    startTime: "2023-05-15T15:30:00",
    location: "123 Main Street",
    respondingUnits: [
      { id: 1, type: "Police", status: "dispatched", eta: "5 min" },
      { id: 2, type: "Medical", status: "en_route", eta: "8 min" },
    ],
    notifiedContacts: [
      { id: 1, name: "Sarah Johnson", status: "acknowledged" },
      { id: 2, name: "Michael Chen", status: "notified" },
      { id: 3, name: "Jessica Patel", status: "no_response" },
    ],
  })

  const [pastEmergencies, setPastEmergencies] = useState([
    {
      id: "EM-2023-05-10-002",
      status: "resolved",
      type: "sos",
      startTime: "2023-05-10T20:15:00",
      endTime: "2023-05-10T20:45:00",
      location: "Downtown Shopping Center",
    },
    {
      id: "EM-2023-04-28-003",
      status: "resolved",
      type: "geo_fence",
      startTime: "2023-04-28T22:30:00",
      endTime: "2023-04-28T23:10:00",
      location: "University Campus",
    },
    {
      id: "EM-2023-04-15-004",
      status: "false_alarm",
      type: "sos",
      startTime: "2023-04-15T14:20:00",
      endTime: "2023-04-15T14:35:00",
      location: "Home",
    },
  ])

  const getStatusBadge = (status) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-orange-500">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "dispatched":
        return <Badge className="bg-blue-500">Dispatched</Badge>
      case "en_route":
        return <Badge className="bg-blue-700">En Route</Badge>
      case "acknowledged":
        return <Badge className="bg-green-500">Acknowledged</Badge>
      case "notified":
        return <Badge className="bg-blue-500">Notified</Badge>
      case "no_response":
        return <Badge className="bg-gray-500">No Response</Badge>
      case "false_alarm":
        return <Badge className="bg-gray-500">False Alarm</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getEmergencyTypeIcon = (type) => {
    switch (type) {
      case "sos":
        return <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
      case "geo_fence":
        return (
          <svg
            className="h-6 w-6 text-orange-600 dark:text-orange-400"
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
        )
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const cancelEmergency = () => {
    if (
      confirm(
        "Are you sure you want to cancel this emergency? This will notify all responders and contacts that this was a false alarm.",
      )
    ) {
      setActiveEmergency((prev) => ({
        ...prev,
        status: "false_alarm",
      }))
      alert("Emergency has been cancelled and marked as a false alarm.")
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
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Phone className="h-5 w-5" />
                  Police
                </Link>
                <Link
                  href="/dashboard/assistance"
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
            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <Phone className="h-4 w-4" />
            Police
          </Link>
          <Link
            href="/dashboard/assistance"
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
          <h1 className="text-2xl font-bold">Emergency Assistance Response</h1>
          <p className="text-gray-500">Track emergency response status and assistance</p>
        </div>

        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active Emergency</TabsTrigger>
            <TabsTrigger value="history">Emergency History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {activeEmergency.status === "in_progress" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                  <CardHeader className="bg-red-50 dark:bg-red-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-red-600" />
                          Active Emergency Response
                        </CardTitle>
                        <CardDescription>Emergency ID: {activeEmergency.id}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(activeEmergency.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600"
                          onClick={cancelEmergency}
                        >
                          Cancel Emergency
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Emergency Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium">SOS Alert</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Started:</span>
                            <span className="font-medium">{formatDate(activeEmergency.startTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Location:</span>
                            <span className="font-medium">{activeEmergency.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-medium">Assistance En Route</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Response Progress</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Alert Sent</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Authorities Notified</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Responders Dispatched</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Responders En Route</span>
                              <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Assistance Arrived</span>
                              <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                            <Progress value={0} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Responding Units</CardTitle>
                    <CardDescription>Emergency services en route to your location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeEmergency.respondingUnits.map((unit) => (
                        <div
                          key={unit.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full ${unit.type === "Police" ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900"} flex items-center justify-center`}
                            >
                              {unit.type === "Police" ? (
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
                              ) : (
                                <svg
                                  className="h-6 w-6 text-green-600 dark:text-green-400"
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
                                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{unit.type} Unit</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-500">ETA: {unit.eta}</span>
                              </div>
                            </div>
                          </div>
                          <div>{getStatusBadge(unit.status)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notified Contacts</CardTitle>
                    <CardDescription>Emergency contacts who have been alerted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeEmergency.notifiedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {contact.status === "acknowledged" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : contact.status === "notified" ? (
                                  <Clock className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-sm text-gray-500">
                                  {contact.status === "acknowledged"
                                    ? "Has acknowledged"
                                    : contact.status === "notified"
                                      ? "Notification sent"
                                      : "No response yet"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>{getStatusBadge(contact.status)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Emergency</CardTitle>
                  <CardDescription>There are currently no active emergency responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">You're Safe</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md">
                      There are no active emergencies at this time. If you need assistance, press the SOS button to
                      alert your emergency contacts and local authorities.
                    </p>
                    <Button className="mt-6 bg-red-600 hover:bg-red-700">
                      <Bell className="mr-2 h-4 w-4" />
                      Trigger SOS Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Emergency History</CardTitle>
                <CardDescription>Record of past emergency events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pastEmergencies.map((emergency) => (
                    <div key={emergency.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {getEmergencyTypeIcon(emergency.type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {emergency.type === "sos"
                                ? "SOS Emergency"
                                : emergency.type === "geo_fence"
                                  ? "Geo-fence Alert"
                                  : "Emergency Alert"}
                            </p>
                            <p className="text-sm text-gray-500">{emergency.location}</p>
                          </div>
                        </div>
                        <div>{getStatusBadge(emergency.status)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Started</p>
                          <p>{formatDate(emergency.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Ended</p>
                          <p>{formatDate(emergency.endTime)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Emergency History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Protocol</CardTitle>
              <CardDescription>What happens when you trigger an emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Alert Triggered</h4>
                    <p className="text-sm text-gray-500">
                      When you press the SOS button, an emergency alert is immediately created in our system.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Contacts Notified</h4>
                    <p className="text-sm text-gray-500">
                      Your emergency contacts receive SMS, push notifications, and emails with your location and
                      emergency details.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Authorities Alerted</h4>
                    <p className="text-sm text-gray-500">
                      Local police and emergency services are notified of your situation and location.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                    <span className="font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Response Tracking</h4>
                    <p className="text-sm text-gray-500">
                      Track the status of emergency responders and see estimated arrival times.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Settings</CardTitle>
              <CardDescription>Customize how emergency responses are handled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Police Notification</p>
                    <p className="text-sm text-gray-500">Notify police automatically when SOS is triggered</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Sharing</p>
                    <p className="text-sm text-gray-500">Share your real-time location during emergencies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audio Recording</p>
                    <p className="text-sm text-gray-500">Record audio during emergencies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Contact Verification</p>
                    <p className="text-sm text-gray-500">Require contacts to verify receipt of alerts</p>
                  </div>
                  <Switch />
                </div>
                <Button className="w-full mt-2">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
