"use client"

import { useEffect, useRef, useState } from 'react'

interface GoogleMapsLoaderProps {
  onLoad?: () => void
  libraries?: string[]
}

// Declare types globally
declare global {
  interface Window {
    google: any // Must match other declarations
    initMap: () => void // Must match other declarations
  }
}

let isLoading = false
let isLoaded = false

export function GoogleMapsLoader({ onLoad, libraries = [] }: GoogleMapsLoaderProps) {
  const hasAddedScript = useRef(false)
  const [isApiLoaded, setIsApiLoaded] = useState(false)

  useEffect(() => {
    // If Google Maps is already loaded, call onLoad immediately
    if (window.google?.maps) {
      isLoaded = true
      setIsApiLoaded(true)
      onLoad?.()
      return
    }

    const loadGoogleMaps = async () => {
      // If already loading, wait for it to complete
      if (isLoading) {
        const checkLoaded = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkLoaded)
            setIsApiLoaded(true)
            onLoad?.()
          }
        }, 100)
        return
      }

      // Start loading
      isLoading = true

      try {
        // Set up callback before creating script
        window.initMap = () => {
          isLoaded = true
          isLoading = false
          setIsApiLoaded(true)
          // Add a small delay to ensure Google Maps is fully initialized
          setTimeout(() => {
            onLoad?.()
          }, 100)
        }

        // Only add the script once
        if (!hasAddedScript.current) {
          const script = document.createElement('script')
          const libraryParams = libraries.length ? `&libraries=${libraries.join(',')}` : ''
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}${libraryParams}&callback=initMap`
          script.async = true
          script.defer = true
          script.onerror = (error) => {
            console.error('Failed to load Google Maps:', error)
            isLoading = false
            window.initMap = () => {} // Prevent errors if script retries loading
          }
          document.head.appendChild(script)
          hasAddedScript.current = true
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        isLoading = false
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup if needed
      if (window.initMap) {
        window.initMap = () => {} // Replace with no-op instead of deleting
      }
    }
  }, [onLoad, libraries])

  return null
} 