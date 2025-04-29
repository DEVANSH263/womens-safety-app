"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
}

export function PhoneVerification({ onVerificationComplete }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/verify-phone/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code")
      }

      setIsCodeSent(true)
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/verify-phone/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify code")
      }

      toast({
        title: "Success",
        description: "Your phone number has been verified successfully.",
      })

      onVerificationComplete?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Verification</CardTitle>
        <CardDescription>
          Verify your phone number to receive emergency alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex space-x-2">
            <Input
              id="phone"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isCodeSent || isLoading}
            />
            <Button
              onClick={handleSendCode}
              disabled={!phoneNumber || isCodeSent || isLoading}
            >
              Send Code
            </Button>
          </div>
        </div>

        {isCodeSent && (
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <div className="flex space-x-2">
              <Input
                id="code"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={handleVerifyCode}
                disabled={!verificationCode || isLoading}
              >
                Verify
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 