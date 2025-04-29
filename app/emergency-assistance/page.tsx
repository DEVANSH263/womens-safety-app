"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, AlertCircle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function EmergencyAssistancePage() {
  const router = useRouter()
  const [primaryPhone, setPrimaryPhone] = useState("+919634671666")
  const [additionalNumbers, setAdditionalNumbers] = useState<string[]>([])
  const [newNumber, setNewNumber] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const handleAddNumber = () => {
    if (!newNumber) return

    // Format the number with country code if needed
    const formattedNumber = newNumber.startsWith('+91') ? newNumber : `+91${newNumber.replace(/^0+/, '')}`
    
    if (additionalNumbers.includes(formattedNumber)) {
      toast({
        title: "Number Already Added",
        description: "This number is already in the list",
        variant: "destructive"
      })
      return
    }

    setAdditionalNumbers([...additionalNumbers, formattedNumber])
    setNewNumber("")
  }

  const handleRemoveNumber = (number: string) => {
    setAdditionalNumbers(additionalNumbers.filter(n => n !== number))
  }

  const handleSOS = async () => {
    if (!primaryPhone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to receive alerts",
        variant: "destructive"
      })
      return
    }

    // Format primary phone number
    const formattedPrimary = primaryPhone.startsWith('+91') ? primaryPhone : `+91${primaryPhone.replace(/^0+/, '')}`
    setIsGettingLocation(true)

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

      // Store SOS info in localStorage
      localStorage.setItem('lastSOS', JSON.stringify({
        phoneNumber: formattedPrimary,
        additionalNumbers,
        location: locationUrl,
        timestamp: new Date().toISOString()
      }))

      // Send SOS alert to all numbers
      const response = await fetch('/api/alerts/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: [latitude, longitude],
          timestamp: new Date().toISOString(),
          type: 'sos',
          guestInfo: {
            phoneNumber: formattedPrimary,
            additionalNumbers,
            name: 'Guest User'
          }
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('SOS API Error:', data)
        throw new Error(data.error || 'Failed to send SOS alert')
      }

      // Show success message with details
      toast({
        title: "SOS Alert Activated",
        description: data.smsStatus === 'sent' 
          ? `Emergency alert sent to ${data.successfulNumbers?.length || 0} number(s)`
          : "SOS alarm activated but SMS sending failed. Please use emergency numbers below.",
        variant: data.smsStatus === 'sent' ? "default" : "destructive"
      })

      // If any numbers failed, show them
      if (data.failedNumbers?.length > 0) {
        toast({
          title: "Some Alerts Failed",
          description: `Failed to send alerts to: ${data.failedNumbers.join(', ')}`,
          variant: "destructive"
        })
      }

      // Redirect to SOS alarm page
      router.push('/sos-alarm')
    } catch (error) {
      console.error('Error in handleSOS:', error)
      
      // Show detailed error message
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to send SOS alert. Please try calling emergency numbers directly.",
        variant: "destructive"
      })
      
      // Store SOS info without location
      localStorage.setItem('lastSOS', JSON.stringify({
        phoneNumber: formattedPrimary,
        additionalNumbers,
        timestamp: new Date().toISOString()
      }))

      // Still redirect to alarm page for audio alert
      router.push('/sos-alarm')
    } finally {
      setIsGettingLocation(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Add phone numbers to receive emergency alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Number (Primary)</label>
            <Input
              type="tel"
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              className="mb-4 text-lg font-medium"
              readOnly
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Additional Emergency Contacts</label>
            <div className="flex gap-2 mb-2">
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
              />
              <Button 
                onClick={handleAddNumber}
                disabled={!newNumber}
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {additionalNumbers.length > 0 && (
              <div className="space-y-2 mt-4">
                {additionalNumbers.map((number) => (
                  <div key={number} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm font-medium">{number}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveNumber(number)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-600">SOS Emergency</CardTitle>
          <CardDescription>
            Click the button below to activate emergency alarm and send alerts to {1 + additionalNumbers.length} number{additionalNumbers.length ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            variant="destructive"
            className="w-full h-20 text-lg animate-pulse"
            onClick={handleSOS}
            disabled={isGettingLocation}
          >
            <AlertCircle className="mr-2 h-6 w-6" />
            {isGettingLocation ? "Sending Alert..." : "Activate SOS"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Numbers</CardTitle>
          <CardDescription>Direct dial emergency services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Police Emergency</p>
                  <p className="text-sm text-gray-500">Dial 100</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "tel:100"}>
                Call
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Women Helpline</p>
                  <p className="text-sm text-gray-500">Dial 1091</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "tel:1091"}>
                Call
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Ambulance</p>
                  <p className="text-sm text-gray-500">Dial 102</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "tel:102"}>
                Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 