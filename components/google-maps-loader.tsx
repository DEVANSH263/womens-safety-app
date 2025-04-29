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
  const onLoadRef = useRef(onLoad)

  useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])

  useEffect(() => {
    if (isApiLoaded) {
      return
    }

    // If Google Maps is already loaded, call onLoad immediately
    if (window.google?.maps) {
      console.log('Google Maps already loaded')
      isLoaded = true
      setIsApiLoaded(true)
      onLoadRef.current?.()
      return
    }

    const loadGoogleMaps = async () => {
      // If already loading, wait for it to complete
      if (isLoading) {
        console.log('Google Maps is currently loading...')
        const checkLoaded = setInterval(() => {
          if (window.google?.maps) {
            console.log('Google Maps finished loading')
            clearInterval(checkLoaded)
            if (!isApiLoaded) {
              setIsApiLoaded(true)
              onLoadRef.current?.()
            }
          }
        }, 100)
        return
      }

      // Start loading
      isLoading = true
      console.log('Starting Google Maps load...')

      try {
        // Set up callback before creating script
        window.initMap = () => {
          console.log('Google Maps initialization callback triggered')
          isLoaded = true
          isLoading = false
          if (!isApiLoaded) {
            setIsApiLoaded(true)
            // Add a small delay to ensure Google Maps is fully initialized
            setTimeout(() => {
              console.log('Calling onLoad callback')
              onLoadRef.current?.()
            }, 500)
          }
        }

        // Only add the script once
        if (!hasAddedScript.current) {
          const script = document.createElement('script')
          const libraryParams = libraries.length ? `&libraries=${libraries.join(',')}` : ''
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}${libraryParams}&callback=initMap&v=weekly`
          script.async = true
          script.defer = true
          script.crossOrigin = "anonymous"
          
          script.onerror = (error) => {
            console.error('Failed to load Google Maps:', error)
            isLoading = false
          }
          
          document.head.appendChild(script)
          hasAddedScript.current = true
          console.log('Added Google Maps script to head')
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
  }, [libraries]) // Remove onLoad from dependencies, using ref instead

  return null
} 