"use client"

import { useState, useEffect } from "react"
import { MapPin, Share2, Copy, Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "@/components/feature-layout"
import { useToast } from "@/components/ui/use-toast"
import dynamic from 'next/dynamic'

// Dynamically import MapWrapper with no SSR
const MapWrapper = dynamic(
  () => import('./map-wrapper'),
  { 
    ssr: false,
    loading: () => <div className="h-[350px] w-full bg-gray-100 rounded-lg animate-pulse" />
  }
)

interface Contact {
  _id: string
  name: string
  phoneNumber: string
  relationship: string
}

export default function LocationTrackingPage() {
  const [isTracking, setIsTracking] = useState(true)
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]) // Default position
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setIsClient(typeof window !== 'undefined')
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    let retryCount = 0;
    const maxRetries = 3;

    const getLocation = () => {
      // First try with high accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude])
          setLoading(false)
          setError(null)
        },
        (error) => {
          // If high accuracy fails, try with lower accuracy
          if (retryCount < maxRetries) {
            retryCount++;
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setPosition([position.coords.latitude, position.coords.longitude])
                setLoading(false)
                setError(null)
              },
              (finalError) => {
                let errorMessage = 'Error tracking location: ';
                switch(finalError.code) {
                  case finalError.PERMISSION_DENIED:
                    errorMessage += 'Please enable location permissions in Windows Settings and your browser settings.';
                    break;
                  case finalError.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information is unavailable. Please check if Windows Location Service is enabled.';
                    break;
                  case finalError.TIMEOUT:
                    errorMessage += 'Please check:\n1. Windows Location Service is ON\n2. Browser location permissions\n3. Internet connection';
                    break;
                  default:
                    errorMessage += finalError.message;
                }
                setError(errorMessage)
                setLoading(false)
              },
              {
                enableHighAccuracy: false,  // Try with lower accuracy
                timeout: 15000,            // Longer timeout
                maximumAge: 30000          // Accept positions up to 30 seconds old
              }
            )
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }

    // Initial location fetch
    getLocation()

    // Periodic location updates with more relaxed settings
    const intervalId = setInterval(getLocation, 10000)  // Try every 10 seconds

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    // Fetch contacts when component mounts
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts')
        const data = await response.json()
        setContacts(data.contacts)
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        toast({
          title: "Error",
          description: "Failed to load your emergency contacts",
          variant: "destructive"
        })
      }
    }
    fetchContacts()
  }, [])

  const handleShareWithContacts = async () => {
    setIsSending(true)
    const locationUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`
    const message = `Emergency Alert: My current location is: ${locationUrl}`
    
    try {
      // Send SMS to all contacts
      for (const contact of contacts) {
        try {
          const response = await fetch('/api/alerts/sos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: contact.phoneNumber,
              message: message,
              location: {
                type: 'Point',
                coordinates: [position[1], position[0]] // MongoDB expects [longitude, latitude]
              }
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to send to ${contact.name}`)
          }
        } catch (error) {
          console.error(`Failed to send to ${contact.phoneNumber}:`, error)
          toast({
            title: "Warning",
            description: `Failed to send location to ${contact.name}`,
            variant: "destructive"
          })
        }
      }

      toast({
        title: "Location Shared",
        description: `Location sent to ${contacts.length} emergency contacts`,
      })
    } catch (error) {
      console.error('Error sharing location:', error)
      toast({
        title: "Error",
        description: "Failed to share location with contacts",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyLocation = async () => {
    const locationUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`
    try {
      await navigator.clipboard.writeText(locationUrl)
      setIsCopied(true)
      toast({
        title: "Location Copied",
        description: "Location link has been copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Please try sharing using other methods",
        variant: "destructive"
      })
    }
  }

  const handleSendWhatsApp = () => {
    const locationUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`My current location: ${locationUrl}`)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleOpenInMaps = () => {
    const locationUrl = `https://www.google.com/maps?q=${position[0]},${position[1]}`
    window.open(locationUrl, '_blank')
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Location Error</strong>
          <div className="mt-2 whitespace-pre-line">{error}</div>
          <div className="mt-4">
            <Button 
              onClick={() => {
                setLoading(true)
                setError(null)
                if (typeof window !== 'undefined' && navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setPosition([position.coords.latitude, position.coords.longitude])
                      setLoading(false)
                    },
                    (error) => {
                      setError('Failed to refresh location. Please check your settings.')
                      setLoading(false)
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }
                  )
                }
              }}
              variant="outline"
              size="sm"
            >
              Retry with Lower Accuracy
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-[350px] w-full bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <FeatureLayout
      title="Live Location Tracking"
      description="Track your real-time location and share it with trusted contacts"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
            <CardDescription>Your current location is displayed on the map below</CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && <MapWrapper position={position} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Settings</CardTitle>
            <CardDescription>Configure your location tracking preferences</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Switch
                id="tracking"
                checked={isTracking}
                onCheckedChange={setIsTracking}
              />
              <Label htmlFor="tracking">Enable Location Tracking</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleShareWithContacts}
                disabled={isSending || contacts.length === 0}
              >
                <Phone className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Share with Contacts"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleCopyLocation}
              >
                <Copy className="mr-2 h-4 w-4" />
                {isCopied ? "Copied!" : "Copy Link"}
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleSendWhatsApp}
              >
                <Send className="mr-2 h-4 w-4" />
                Send on WhatsApp
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleOpenInMaps}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open in Maps
              </Button>
            </div>
            {contacts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No emergency contacts found. Please add contacts in the Safe Contacts section.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
            <CardDescription>Your coordinates and location details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <MapPin className="h-4 w-4" />
              <div>
                <div className="font-medium">Latitude: {position[0].toFixed(6)}</div>
                <div className="font-medium">Longitude: {position[1].toFixed(6)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureLayout>
  )
}
