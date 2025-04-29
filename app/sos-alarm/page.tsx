"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Phone, Volume2, VolumeX, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SOSAlarmPage() {
  const [isAlarmActive, setIsAlarmActive] = useState(false)
  const [lastSOSInfo, setLastSOSInfo] = useState<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Audio Context and load last SOS info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      // Load last SOS info from localStorage
      const storedSOS = localStorage.getItem('lastSOS')
      if (storedSOS) {
        setLastSOSInfo(JSON.parse(storedSOS))
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  // Start alarm sound with pattern
  const startAlarm = () => {
    if (audioContextRef.current && !oscillatorRef.current) {
      const osc = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      
      osc.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      
      // Configure alarm sound
      osc.type = 'square'
      
      // Create SOS pattern (... --- ...)
      const startTime = audioContextRef.current.currentTime
      let time = startTime
      
      // Short beeps (...)
      for (let i = 0; i < 3; i++) {
        osc.frequency.setValueAtTime(880, time) // Higher pitch for urgency
        gainNode.gain.setValueAtTime(1, time)
        gainNode.gain.setValueAtTime(0, time + 0.2)
        time += 0.4
      }
      
      // Longer beeps (---)
      for (let i = 0; i < 3; i++) {
        osc.frequency.setValueAtTime(660, time)
        gainNode.gain.setValueAtTime(1, time)
        gainNode.gain.setValueAtTime(0, time + 0.6)
        time += 0.8
      }
      
      // Short beeps (...)
      for (let i = 0; i < 3; i++) {
        osc.frequency.setValueAtTime(880, time)
        gainNode.gain.setValueAtTime(1, time)
        gainNode.gain.setValueAtTime(0, time + 0.2)
        time += 0.4
      }

      // Start oscillator and schedule pattern repeat
      osc.start()
      const patternDuration = time - startTime

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Set up new interval with null check
      intervalRef.current = setInterval(() => {
        // Check if audioContextRef is still valid
        if (!audioContextRef.current) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return
        }

        const newStartTime = audioContextRef.current.currentTime
        let newTime = newStartTime

        // Repeat the same pattern
        for (let i = 0; i < 3; i++) {
          osc.frequency.setValueAtTime(880, newTime)
          gainNode.gain.setValueAtTime(1, newTime)
          gainNode.gain.setValueAtTime(0, newTime + 0.2)
          newTime += 0.4
        }
        for (let i = 0; i < 3; i++) {
          osc.frequency.setValueAtTime(660, newTime)
          gainNode.gain.setValueAtTime(1, newTime)
          gainNode.gain.setValueAtTime(0, newTime + 0.6)
          newTime += 0.8
        }
        for (let i = 0; i < 3; i++) {
          osc.frequency.setValueAtTime(880, newTime)
          gainNode.gain.setValueAtTime(1, newTime)
          gainNode.gain.setValueAtTime(0, newTime + 0.2)
          newTime += 0.4
        }
      }, patternDuration * 1000)

      oscillatorRef.current = osc
      setIsAlarmActive(true)
    }
  }

  // Stop alarm sound
  const stopAlarm = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsAlarmActive(false)
  }

  // Start alarm automatically when page loads
  useEffect(() => {
    startAlarm()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Emergency SOS Active
          </CardTitle>
          <CardDescription>
            Alarm is active. Emergency numbers are available below.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            size="lg"
            variant={isAlarmActive ? "destructive" : "default"}
            className={`w-full h-20 text-lg ${isAlarmActive ? 'animate-pulse' : ''}`}
            onClick={isAlarmActive ? stopAlarm : startAlarm}
          >
            {isAlarmActive ? (
              <>
                <VolumeX className="mr-2 h-6 w-6" />
                Stop Alarm
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-6 w-6" />
                Start Alarm
              </>
            )}
          </Button>

          {lastSOSInfo && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-red-100">
              <h3 className="font-medium text-red-600 mb-2">Alert Information</h3>
              {lastSOSInfo.phoneNumber && (
                <p className="text-sm mb-2">
                  <span className="text-gray-500">Alert sent to:</span> {lastSOSInfo.phoneNumber}
                </p>
              )}
              {lastSOSInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <a
                    href={lastSOSInfo.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Location on Map
                  </a>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>These numbers are always available</CardDescription>
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

      <div className="mt-6 text-center">
        <Link href="/emergency-assistance">
          <Button variant="outline" className="text-red-600">
            Back to Emergency Assistance
          </Button>
        </Link>
      </div>
    </div>
  )
}
