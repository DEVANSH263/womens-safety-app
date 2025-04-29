"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { GoogleMapsLoader } from '@/components/google-maps-loader'

interface MapWrapperProps {
  stations: Array<{
    id: number
    name: string
    address: string
    phone: string
    distance: string
    location?: {
      lat: number
      lng: number
    }
  }>
  currentLocation?: {
    lat: number
    lng: number
  }
  onStationClick?: (stationId: number) => void
  nearestStationId?: number
}

export default function MapWrapper({ stations, currentLocation, onStationClick, nearestStationId }: MapWrapperProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const markersRef = useRef<Array<google.maps.Marker>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Initialize map when Google Maps is loaded
  const handleMapsLoaded = useCallback(() => {
    setMapsLoaded(true)
  }, [])

  // Memoize the marker creation function
  const createMarkers = useCallback((
    mapInstance: google.maps.Map,
    stations: MapWrapperProps['stations'],
    currentLocation: MapWrapperProps['currentLocation'],
    nearestStationId: MapWrapperProps['nearestStationId'],
    onStationClick?: (stationId: number) => void
  ) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add current location marker if available
    if (currentLocation) {
      const locationMarker = new google.maps.Marker({
        position: currentLocation,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        },
        title: "Your Location",
        zIndex: 1000 // Ensure current location marker stays on top
      })

      // Add a pulsing effect to the current location marker
      const pulseCircle = new google.maps.Circle({
        strokeColor: '#4285F4',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        map: mapInstance,
        center: currentLocation,
        radius: 100, // 100 meters radius
        zIndex: 999
      })

      markersRef.current.push(locationMarker)
      
      // Center map with some animation
      mapInstance.panTo(currentLocation)
    }

    // Add police station markers
    stations.forEach(station => {
      if (station.location) {
        const isNearest = station.id === nearestStationId;
        console.log('Adding station marker:', { station, isNearest });
        
        const marker = new google.maps.Marker({
          position: station.location,
          map: mapInstance,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isNearest ? 12 : 10,
            fillColor: isNearest ? "#2563EB" : "#1E40AF",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: `${station.name}${isNearest ? ' (Nearest)' : ''}`,
          zIndex: isNearest ? 2 : 1
        })

        // Add click listener
        google.maps.event.addListener(marker, 'click', () => {
          if (onStationClick) {
            onStationClick(station.id);
          }
          // Pan to the clicked station
          mapInstance.panTo(station.location!);
        });

        markersRef.current.push(marker)
      }
    })
  }, [])

  // Handle map initialization and updates
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !window.google?.maps) {
      console.log('Map not ready:', { mapsLoaded, mapRefExists: !!mapRef.current, googleMapsExists: !!window.google?.maps });
      return;
    }

    console.log('Initializing map with current location:', currentLocation);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Default to India's center if no current location
    const center = currentLocation || { lat: 20.5937, lng: 78.9629 };
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: currentLocation ? 15 : 5, // Increased zoom level for current location
      mapTypeId: 'roadmap',
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true,
      mapTypeControl: false
    });

    // Add current location marker if available
    if (currentLocation) {
      console.log('Adding current location marker at:', currentLocation);
      const locationMarker = new google.maps.Marker({
        position: currentLocation,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        },
        title: "Your Location",
        zIndex: 1000 // Ensure current location marker stays on top
      });

      // Add a pulsing effect to the current location marker
      const pulseCircle = new google.maps.Circle({
        strokeColor: '#4285F4',
        strokeOpacity: 0.2,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        map: mapInstance,
        center: currentLocation,
        radius: 100, // 100 meters radius
        zIndex: 999
      });

      markersRef.current.push(locationMarker);
      
      // Center map with some animation
      mapInstance.panTo(currentLocation);
    }

    // Add police station markers
    stations.forEach(station => {
      if (station.location) {
        const isNearest = station.id === nearestStationId;
        console.log('Adding station marker:', { station, isNearest });
        
        const marker = new google.maps.Marker({
          position: station.location,
          map: mapInstance,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isNearest ? 12 : 10,
            fillColor: isNearest ? "#2563EB" : "#1E40AF",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: `${station.name}${isNearest ? ' (Nearest)' : ''}`,
          zIndex: isNearest ? 2 : 1
        });

        // Add click listener
        google.maps.event.addListener(marker, 'click', () => {
          if (onStationClick) {
            onStationClick(station.id);
          }
          // Pan to the clicked station
          mapInstance.panTo(station.location!);
        });

        markersRef.current.push(marker);
      }
    });

    setMap(mapInstance);
    setIsLoading(false);

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapsLoaded, stations, currentLocation, onStationClick, nearestStationId]);

  return (
    <>
      <GoogleMapsLoader 
        libraries={['places', 'geometry']} 
        onLoad={handleMapsLoaded}
      />
      <div 
        ref={mapRef} 
        className={`w-full h-[400px] rounded-lg ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}
      />
    </>
  )
} 