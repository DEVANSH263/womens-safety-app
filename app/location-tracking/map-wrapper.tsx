"use client"

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Import marker icons
const userMarkerIcon = L.icon({
  iconUrl: '/images/user-marker.svg',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36]
})

const policeMarkerIcon = L.icon({
  iconUrl: '/images/police-marker.svg',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36]
})

interface MapWrapperProps {
  position: [number, number]
  className?: string
}

export default function MapWrapper({ position, className }: MapWrapperProps) {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView(position, 13)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Add marker with custom icon
    L.marker(position, { icon: userMarkerIcon })
      .addTo(map)
      .bindPopup('Your current location')
      .openPopup()

    // Cleanup
    return () => {
      map.remove()
    }
  }, [position])

  return (
    <div id="map" className={`h-[350px] w-full rounded-lg ${className || ''}`} />
  )
} 