"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, Save, Trash2, Crosshair, Eye, EyeOff, AlertCircle, Download, Upload, Clock, MapPin } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'
import { GoogleMapsLoader } from '@/components/google-maps-loader'

/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface Boundary {
  id: string
  name: string
  polygon: google.maps.Polygon
  color?: string
  createdAt: Date
}

interface LocationPoint {
  lat: number
  lng: number
  timestamp: Date
  insideBoundary: boolean
  boundaryName?: string
}

interface GeolocationPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    altitude: number | null
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
    toJSON: () => any
  }
  timestamp: number
}

interface ExtendedGeolocationCoordinates extends GeolocationCoordinates {
  toJSON(): any;
}

interface CustomPolygonOptions {
  paths?: google.maps.LatLng[] | google.maps.LatLng[][] | { lat: number; lng: number }[];
  strokeColor?: string;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;
  editable?: boolean;
  draggable?: boolean;
  map?: google.maps.Map;
}

// Add these constants near the top of the file, after the interfaces
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 30000, // Increased timeout to 30 seconds
  maximumAge: 0
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Add these functions before the GeoFencingPage component
async function saveGeofencesToDB(boundaries: Boundary[]) {
  try {
    console.log('Saving boundaries:', boundaries);
    const boundaryData = boundaries.map(boundary => ({
      id: boundary.id,
      name: boundary.name,
      points: boundary.polygon.getPath().getArray().map((point: google.maps.LatLng) => ({
        lat: point.lat(),
        lng: point.lng()
      })),
      createdAt: boundary.createdAt
    }));

    console.log('Sending data to API:', boundaryData);
    const response = await fetch('/api/geofences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boundaryData[0]) // Send single boundary for now
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Received non-JSON response from server");
    }

    const result = await response.json();
    console.log('Save response:', result);
    return result;
  } catch (error) {
    console.error('Error saving geofences:', error);
    throw error;
  }
}

async function loadGeofencesFromDB(map: google.maps.Map): Promise<Boundary[]> {
  try {
    console.log('Loading geofences...');
    const response = await fetch('/api/geofences');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Received non-JSON response from server");
    }

    const geofences = await response.json();
    console.log('Loaded geofences:', geofences);

    return geofences.map((geofence: any) => {
      const polygon = new google.maps.Polygon({
        paths: geofence.points.map((point: { lat: number; lng: number }) => 
          new google.maps.LatLng(point.lat, point.lng)
        ),
        strokeColor: "#FF0000",
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        map
      } as CustomPolygonOptions);

      return {
        id: geofence._id || geofence.id,
        name: geofence.name,
        polygon,
        createdAt: new Date(geofence.createdAt)
      };
    });
  } catch (error) {
    console.error('Error loading geofences:', error);
    return []; // Return empty array on error
  }
}

// Update the saveToLocalStorage function
const saveToLocalStorage = (boundaries: Boundary[]) => {
  try {
    const boundaryData = boundaries.map(boundary => {
      // Get all points from the polygon's path
      const path = boundary.polygon.getPath();
      const points = [];
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        points.push({
          lat: point.lat(),
          lng: point.lng()
        });
      }
      
      return {
        id: boundary.id,
        name: boundary.name,
        points: points,
        createdAt: boundary.createdAt.toISOString()
      };
    });

    console.log('Saving to localStorage:', boundaryData);
    localStorage.setItem('geofences', JSON.stringify(boundaryData));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Update the loadFromLocalStorage function
const loadFromLocalStorage = (map: google.maps.Map): Boundary[] => {
  try {
    const savedData = localStorage.getItem('geofences');
    if (!savedData) {
      console.log('No saved geofences found');
      return [];
    }

    const parsedData = JSON.parse(savedData);
    console.log('Loaded from localStorage:', parsedData);

    return parsedData.map((data: any) => {
      // Create polygon from saved points
      const polygon = new google.maps.Polygon({
        paths: data.points.map((point: { lat: number; lng: number }) => 
          new google.maps.LatLng(point.lat, point.lng)
        ),
        strokeColor: "#FF0000",
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        map
      } as CustomPolygonOptions);

      const boundary = {
        id: data.id,
        name: data.name,
        polygon,
        createdAt: new Date(data.createdAt)
      };

      // Add event listener to save changes when polygon is modified
      ['insert_at', 'remove_at', 'set_at'].forEach(event => {
        google.maps.event.addListener(polygon.getPath(), event, () => {
          console.log('Polygon modified, saving changes...');
          // Get current boundaries from state and save
          const currentBoundaries = document.querySelector('[data-boundaries]')?.getAttribute('data-boundaries');
          if (currentBoundaries) {
            saveToLocalStorage(JSON.parse(currentBoundaries));
          }
        });
      });

      return boundary;
    });
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

export default function GeoFencingPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const locationMarkerRef = useRef<google.maps.Marker | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null)
  const [boundaries, setBoundaries] = useState<Boundary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeBoundary, setActiveBoundary] = useState<Boundary | null>(null)
  const [boundaryName, setBoundaryName] = useState('')
  const [isTrackingLocation, setIsTrackingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null)
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([])
  const [showLocationHistory, setShowLocationHistory] = useState(false)
  const locationHistoryPathRef = useRef<google.maps.Polyline | null>(null)
  const locationHistoryMarkersRef = useRef<google.maps.Marker[]>([])

  const initializeMap = useCallback(() => {
    if (!mapRef.current || map || !window.google?.maps) {
      console.log('Map initialization conditions not met:', {
        mapRefExists: !!mapRef.current,
        mapExists: !!map,
        googleMapsExists: !!window.google?.maps
      });
      return;
    }

    console.log('Initializing map...');
    try {
      // Ensure the Google Maps API is fully loaded
      if (typeof window.google.maps.Map !== 'function') {
        console.error('Google Maps API not fully loaded');
        return;
      }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center on India
        zoom: 5,
        mapTypeId: 'roadmap',
        fullscreenControl: true,
        streetViewControl: false
      });

      console.log('Map instance created:', mapInstance);

      // Initialize drawing manager
      const drawingManagerInstance = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
        polygonOptions: {
          strokeColor: "#FF0000",
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          editable: true,
          draggable: true
        }
      })

      console.log('Drawing manager created:', drawingManagerInstance);

      drawingManagerInstance.setMap(mapInstance)
      setMap(mapInstance)
      setDrawingManager(drawingManagerInstance)
      setIsLoading(false)

      // Load saved boundaries
      console.log('Loading saved boundaries...');
      const loadedBoundaries = loadFromLocalStorage(mapInstance);
      console.log('Loaded boundaries:', loadedBoundaries);
      setBoundaries(loadedBoundaries);

      // Handle polygon complete event
      google.maps.event.addListener(drawingManagerInstance, 'polygoncomplete', (polygon: google.maps.Polygon) => {
        console.log('Polygon completed');
        const newBoundary: Boundary = {
          id: Date.now().toString(),
          name: `Boundary ${boundaries.length + 1}`,
          polygon,
          createdAt: new Date()
        };

        // Add event listeners for the new polygon
        ['insert_at', 'remove_at', 'set_at'].forEach(event => {
          google.maps.event.addListener(polygon.getPath(), event, () => {
            console.log('New polygon modified, saving changes...');
            saveToLocalStorage([...boundaries, newBoundary]);
          });
        });

        const updatedBoundaries = [...boundaries, newBoundary];
        setBoundaries(updatedBoundaries);
        setActiveBoundary(newBoundary);
        setBoundaryName('');
        saveToLocalStorage(updatedBoundaries);
        ;(drawingManagerInstance as any).setDrawingMode(null);
      });

      // Handle rectangle complete event
      google.maps.event.addListener(drawingManagerInstance, 'rectanglecomplete', (rectangle: google.maps.Rectangle) => {
        // Convert rectangle to polygon
        const bounds = rectangle.getBounds()
        const ne = bounds?.getNorthEast()
        const sw = bounds?.getSouthWest()
        
        if (ne && sw) {
          const polygonPath = [
            { lat: ne.lat(), lng: sw.lng() },
            { lat: ne.lat(), lng: ne.lng() },
            { lat: sw.lat(), lng: ne.lng() },
            { lat: sw.lat(), lng: sw.lng() }
          ]

          const polygon = new google.maps.Polygon({
            paths: polygonPath.map(point => new google.maps.LatLng(point.lat, point.lng)),
            strokeColor: "#FF0000",
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            editable: true,
            draggable: true
          } as CustomPolygonOptions)

          rectangle.setMap(null)
          polygon.setMap(mapInstance)

          const newBoundary: Boundary = {
            id: Date.now().toString(),
            name: `Boundary ${boundaries.length + 1}`,
            polygon,
            createdAt: new Date()
          }
          const updatedBoundaries = [...boundaries, newBoundary];
          setBoundaries(updatedBoundaries);
          setActiveBoundary(newBoundary)
          setBoundaryName('')
          saveToLocalStorage(updatedBoundaries);
        }
      })
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
      setLocationError('Failed to initialize map. Please refresh the page.');
    }
  }, [map, boundaries, setBoundaries, setActiveBoundary, setBoundaryName]);

  // Function to update user's location on the map
  const updateLocationOnMap = useCallback((position: GeolocationPosition) => {
    setLocationError(null) // Clear any previous errors
    const { latitude, longitude } = position.coords
    const latLng = { lat: latitude, lng: longitude }
    setCurrentLocation(latLng)

    if (map) {
      if (!locationMarkerRef.current) {
        // Create marker if it doesn't exist
        locationMarkerRef.current = new google.maps.Marker({
          map,
          position: latLng,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: "Your Location"
        })
      } else {
        // Update marker position
        locationMarkerRef.current.setPosition(latLng)
      }

      // Check if location is inside any boundary
      boundaries.forEach(boundary => {
        const isInside = google.maps.geometry.poly.containsLocation(
          new google.maps.LatLng(latitude, longitude),
          boundary.polygon
        )
        if (isInside) {
          console.log(`Currently inside boundary: ${boundary.name}`)
          // You can add notifications or UI updates here
        }
      })
    }
  }, [map, boundaries, locationMarkerRef.current]);

  // Check location permission
  const checkLocationPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      setPermissionStatus(result.state)
      
      // Listen for permission changes
      result.addEventListener('change', () => {
        setPermissionStatus(result.state)
        if (result.state === 'denied') {
          handleLocationError({
            code: 1,
            message: 'Location permission denied',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
          })
        }
      })
    } catch (error) {
      console.warn('Permission API not supported', error)
    }
  }, []);

  // Call this when component mounts
  useEffect(() => {
    checkLocationPermission()
  }, [checkLocationPermission])

  // Add this new function before toggleLocationTracking
  const getLocationWithRetry = async (retryCount = 0): Promise<GeolocationPosition> => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          GEOLOCATION_OPTIONS
        );
      });
      return position;
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Location request failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return getLocationWithRetry(retryCount + 1);
      }
      throw error;
    }
  };

  // Function to handle location errors
  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = ''
    
    // Check permission status first
    if (permissionStatus === 'denied') {
      errorMessage = "Location access is blocked. Please allow location access in your browser settings and refresh the page."
    } else {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access was denied. Please check your browser's location permissions and try again.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Unable to detect your location. Please check if:\n- Your device's GPS is enabled\n- You have an active internet connection\n- You're not in airplane mode";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out. Please check:\n- Your internet connection speed\n- If you're in an area with good GPS signal\n- Try moving to an area with better reception";
          break;
        default:
          errorMessage = "Unable to track location. Please ensure location services are enabled and try again.";
      }
    }

    console.error('Location Error:', {
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString()
    });

    setLocationError(errorMessage);
    setIsTrackingLocation(false);
    setIsLoading(false);
    
    // Clean up tracking
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (locationMarkerRef.current) {
      locationMarkerRef.current.setMap(null);
      locationMarkerRef.current = null;
    }
  }

  // Function to handle location tracking toggle
  const toggleLocationTracking = async () => {
    setLocationError(null);

    if (!isTrackingLocation) {
      if (!('geolocation' in navigator)) {
        setLocationError("Geolocation is not supported by your browser. Please try using a modern browser.");
        return;
      }

      if (permissionStatus === 'denied') {
        setLocationError("Location access is blocked. Please allow location access in your browser settings and refresh the page.");
        return;
      }

      try {
        // Show loading state
        setIsLoading(true);
        
        // Try to get initial position with retry logic
        const position = await getLocationWithRetry();
        updateLocationOnMap(position);

        // If successful, start watching position with updated options
        watchIdRef.current = navigator.geolocation.watchPosition(
          updateLocationOnMap,
          handleLocationError,
          GEOLOCATION_OPTIONS
        );
        setIsTrackingLocation(true);
      } catch (error) {
        handleLocationError(error as GeolocationPositionError);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setMap(null);
        locationMarkerRef.current = null;
      }
      setIsTrackingLocation(false);
      setCurrentLocation(null);
    }
  };

  // Center map on current location
  const centerOnLocation = () => {
    if (map && currentLocation) {
      map.panTo(currentLocation)
      map.setZoom(15)
    }
  }

  // Update handleSaveBoundaryName to save to localStorage
  const handleSaveBoundaryName = () => {
    if (activeBoundary && boundaryName.trim()) {
      const updatedBoundaries = boundaries.map(b => 
        b.id === activeBoundary.id 
          ? { ...b, name: boundaryName.trim() }
          : b
      );
      
      setBoundaries(updatedBoundaries);
      setActiveBoundary(null);
      setBoundaryName('');
      saveToLocalStorage(updatedBoundaries);
    }
  };

  // Update handleDeleteBoundary to save to localStorage
  const handleDeleteBoundary = (boundaryId: string) => {
    const boundary = boundaries.find(b => b.id === boundaryId);
    if (boundary) {
      boundary.polygon.setMap(null);
      const updatedBoundaries = boundaries.filter(b => b.id !== boundaryId);
      setBoundaries(updatedBoundaries);
      if (activeBoundary?.id === boundaryId) {
        setActiveBoundary(null);
        setBoundaryName('');
      }
      saveToLocalStorage(updatedBoundaries);
    }
  };

  // Function to export boundaries
  const exportBoundaries = () => {
    const boundariesData = boundaries.map(boundary => {
      const path = boundary.polygon.getPath().getArray()
      const points = path.map((point: google.maps.LatLng) => ({
        lat: point.lat(),
        lng: point.lng()
      }))
      
      return {
        id: boundary.id,
        name: boundary.name,
        points,
        color: boundary.color,
        createdAt: boundary.createdAt
      }
    })

    const dataStr = JSON.stringify(boundariesData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `geofence-boundaries-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Function to import boundaries
  const importBoundaries = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !map) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        data.forEach((boundaryData: any) => {
          const polygon = new google.maps.Polygon({
            paths: boundaryData.points,
            strokeColor: boundaryData.color || '#FF0000',
            strokeWeight: 2,
            fillColor: boundaryData.color || '#FF0000',
            fillOpacity: 0.35,
            editable: true,
            draggable: true,
            clickable: true,
            map
          } as CustomPolygonOptions)

          const newBoundary: Boundary = {
            id: boundaryData.id || Date.now().toString(),
            name: boundaryData.name,
            polygon,
            color: boundaryData.color,
            createdAt: new Date(boundaryData.createdAt) || new Date()
          }

          setBoundaries(prev => [...prev, newBoundary])
        })
      } catch (error) {
        console.error('Error importing boundaries:', error)
        setLocationError('Failed to import boundaries. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  // Function to update location history
  const updateLocationHistory = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords
    const newPoint: LocationPoint = {
      lat: latitude,
      lng: longitude,
      timestamp: new Date(),
      insideBoundary: false,
    }

    // Check if point is inside any boundary
    boundaries.forEach(boundary => {
      const isInside = google.maps.geometry.poly.containsLocation(
        new google.maps.LatLng(latitude, longitude),
        boundary.polygon
      )
      if (isInside) {
        newPoint.boundaryName = boundary.name
        newPoint.insideBoundary = true
      }
    })

    setLocationHistory(prev => [...prev, newPoint])
    updateLocationHistoryPath()
  }

  // Function to update location history path on map
  const updateLocationHistoryPath = () => {
    if (!map || !showLocationHistory) return

    // Clear existing path and markers
    if (locationHistoryPathRef.current) {
      locationHistoryPathRef.current.setMap(null)
    }
    locationHistoryMarkersRef.current.forEach(marker => marker.setMap(null))
    locationHistoryMarkersRef.current = []

    // Create new path
    const path = locationHistory.map(point => new google.maps.LatLng(point.lat, point.lng))
    locationHistoryPathRef.current = new (google.maps as any).Polyline({
      path,
      geodesic: true,
      strokeColor: '#2196F3',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map
    })

    // Add markers for points
    locationHistory.forEach(point => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: showLocationHistory ? map : null,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 4,
          fillColor: point.boundaryName ? '#4CAF50' : '#2196F3',
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#FFFFFF'
        },
        title: point.boundaryName 
          ? `In ${point.boundaryName} at ${format(point.timestamp, 'HH:mm:ss')}`
          : `Location at ${format(point.timestamp, 'HH:mm:ss')}`
      })
      locationHistoryMarkersRef.current.push(marker)
    })
  }

  // Update location history when tracking is active
  useEffect(() => {
    if (isTrackingLocation) {
      const interval = setInterval(() => {
        if (currentLocation) {
          updateLocationHistory({
            coords: {
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: () => ({
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
                accuracy: 0,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
              })
            },
            timestamp: Date.now()
          })
        }
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isTrackingLocation, currentLocation])

  // Toggle location history visibility
  useEffect(() => {
    updateLocationHistoryPath()
  }, [showLocationHistory])

  // Add this helper function before the return statement
  const getSerializableBoundaries = (boundaries: Boundary[]) => {
    return boundaries.map(boundary => ({
      id: boundary.id,
      name: boundary.name,
      points: Array.from(boundary.polygon.getPath().getArray() as google.maps.LatLng[]).map((point: google.maps.LatLng) => ({
        lat: point.lat(),
        lng: point.lng()
      })),
      createdAt: boundary.createdAt
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <GoogleMapsLoader 
        libraries={['drawing', 'geometry']} 
        onLoad={initializeMap} 
      />
      <Card>
        <CardHeader>
          <CardTitle>Geo-Fencing</CardTitle>
          <CardDescription>
            Draw boundaries on the map to create safe zones. Use the drawing tools to create polygons or rectangles.
            You can drag, resize, and name your boundaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {permissionStatus === 'denied' && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Location access is blocked. To use location tracking:
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location access</li>
                  <li>Refresh this page</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex items-center justify-center h-[500px]">
              <Loader className="h-8 w-8 animate-spin" />
        </div>
          )}
          <div 
            ref={mapRef} 
            style={{ 
              height: '500px', 
              width: '100%',
              display: isLoading ? 'none' : 'block'
            }} 
          />
          
          <div className="mt-4 space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isTrackingLocation}
                      onCheckedChange={toggleLocationTracking}
                      id="location-tracking"
                      disabled={permissionStatus === 'denied'}
                    />
                    <Label htmlFor="location-tracking">
                      {isTrackingLocation ? (
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Tracking Location
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Start Tracking
                        </div>
                      )}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showLocationHistory}
                      onCheckedChange={setShowLocationHistory}
                      id="show-history"
                    />
                    <Label htmlFor="show-history">Show History</Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {currentLocation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={centerOnLocation}
                    >
                      <Crosshair className="w-4 h-4 mr-2" />
                      Center
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={locationHistory.length === 0}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        History
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Location History</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[400px] w-full pr-4">
                        <div className="space-y-2">
                          {locationHistory.map((point, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2 p-2 border rounded"
                            >
                              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {point.boundaryName 
                                    ? `In ${point.boundaryName}`
                                    : 'Outside safe zones'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {format(point.timestamp, 'MMM d, yyyy HH:mm:ss')}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {`${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {locationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{locationError}</AlertDescription>
                </Alert>
              )}
            </div>

            {activeBoundary && (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="boundaryName">Boundary Name</Label>
                <Input
                    id="boundaryName"
                    value={boundaryName}
                    onChange={(e) => setBoundaryName(e.target.value)}
                    placeholder="Enter boundary name"
                />
              </div>
                <Button onClick={handleSaveBoundaryName}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Name
                </Button>
              </div>
            )}

            {boundaries.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Your Boundaries</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportBoundaries}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
              </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importBoundaries}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  {boundaries.map((boundary) => (
                    <div 
                      key={boundary.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <span>{boundary.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {format(boundary.createdAt, 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBoundary(boundary.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                ))}
                </div>

                <Button 
                  variant="destructive"
                  onClick={() => {
                    boundaries.forEach(b => b.polygon.setMap(null))
                    setBoundaries([])
                    setActiveBoundary(null)
                    setBoundaryName('')
                  }}
                >
                  Clear All Boundaries
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 