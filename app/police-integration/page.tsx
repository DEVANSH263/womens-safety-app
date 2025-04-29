"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Phone, Navigation, MapPin } from "lucide-react"
import MapWrapper from "./map-wrapper"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleMapsLoader } from "@/components/google-maps-loader"

interface PoliceStation {
  id: number
  name: string
  address: string
  phone: string
  distance: string
  location?: {
    lat: number
    lng: number
  }
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

export default function PoliceIntegrationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | undefined>()
  const [nearestStation, setNearestStation] = useState<PoliceStation | null>(null)
  const { toast } = useToast()
  const [stations, setStations] = useState<PoliceStation[]>([])
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)

  const handleMapsLoaded = useCallback(() => {
    console.log('Maps loaded callback triggered');
    if (window.google?.maps) {
      console.log('Google Maps is available, initializing Places service');
      // Create a temporary map div for Places service
      const mapDiv = document.createElement('div');
      const tempMap = new window.google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 1
      });
      const service = new window.google.maps.places.PlacesService(tempMap);
      setPlacesService(service);
      setMapsLoaded(true);
    } else {
      console.log('Google Maps not available yet');
    }
  }, []);

  // Function to fetch nearby police stations using Google Places API
  const fetchNearbyPoliceStations = useCallback(async (location: { lat: number; lng: number }) => {
    console.log('Attempting to fetch police stations');
    if (!window.google?.maps || !mapsLoaded || !placesService) {
      console.log('Dependencies not ready:', {
        googleMaps: !!window.google?.maps,
        mapsLoaded,
        hasPlacesService: !!placesService
      });
      return;
    }

    console.log('Searching for police stations at location:', location);
    
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 10000, // 10km radius
      type: 'police',
      keyword: 'police station'
    };

    console.log('Places API request:', request);

    try {
      const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        placesService.nearbySearch(request, (results, status) => {
          console.log('Places API response status:', status);
          console.log('Places API results:', results);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Failed to fetch police stations. Status: ${status}`));
          }
        });
      });

      const newStations = results.map((result, index) => ({
        id: index + 1,
        name: result.name || 'Police Station',
        address: result.vicinity || 'Address not available',
        phone: result.formatted_phone_number || '911',
        distance: '0 km',
        location: result.geometry?.location ? {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        } : undefined
      }));

      // Calculate distances and sort by distance
      const stationsWithDistance = newStations.map(station => {
        if (station.location) {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            station.location.lat,
            station.location.lng
          );
          return {
            ...station,
            distance: `${distance.toFixed(1)} km`
          };
        }
        return station;
      }).sort((a, b) => {
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      });

      setStations(stationsWithDistance);
      if (stationsWithDistance.length > 0) {
        setNearestStation(stationsWithDistance[0]);
      }

      toast({
        title: "Success",
        description: `Found ${stationsWithDistance.length} police stations nearby`
      });
    } catch (error) {
      console.error('Error fetching police stations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby police stations",
        variant: "destructive"
      });
    }
  }, [mapsLoaded, placesService, toast]);

  // Effect to handle location updates
  useEffect(() => {
    if (currentLocation && mapsLoaded && placesService) {
      fetchNearbyPoliceStations(currentLocation);
    }
  }, [currentLocation, mapsLoaded, placesService, fetchNearbyPoliceStations]);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true);
      console.log('Getting current location...');
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000, // Increased timeout to 10 seconds
            maximumAge: 0
          }
        )
      });

      console.log('Got position:', position);
      const { latitude, longitude } = position.coords;
      const location = { lat: latitude, lng: longitude };
      console.log('Setting current location:', location);
      setCurrentLocation(location);
      
      // Wait a moment for the map to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch nearby police stations when location is obtained
      await fetchNearbyPoliceStations(location);
      
      toast({
        title: "Location Found",
        description: `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      });
    } catch (error: any) {
      console.error('Location error:', error);
      let errorMessage = "Failed to get your location. ";
      
      if (error.code === 1) {
        errorMessage += "Please allow location access in your browser settings.";
      } else if (error.code === 2) {
        errorMessage += "Position unavailable. Please check your GPS settings.";
      } else if (error.code === 3) {
        errorMessage += "Location request timed out. Please try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, fetchNearbyPoliceStations]);

  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  const handleStationClick = useCallback((stationId: number) => {
    const station = stations.find(s => s.id === stationId)
    if (station) {
      toast({
        title: station.name,
        description: `${station.address}\nPhone: ${station.phone}`
      })
    }
  }, [stations, toast])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentLocation || !searchQuery.trim()) return;

    setLoading(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      if (result[0].geometry.location) {
        const location = {
          lat: result[0].geometry.location.lat(),
          lng: result[0].geometry.location.lng()
        };
        setCurrentLocation(location);
        await fetchNearbyPoliceStations(location);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find the location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleEmergencyCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="ml-2 text-xl font-bold">SafetyGuard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Police Integration</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <GoogleMapsLoader 
              onLoad={handleMapsLoaded}
              libraries={["places"]}
            />
            {nearestStation && (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <MapPin className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-600">
                  Nearest Police Station: {nearestStation.name} ({nearestStation.distance})
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Find Nearby Police Stations</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Search Location
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter address or use current location"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </form>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Emergency Contact
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                In case of emergency, immediately dial your local emergency number:
              </p>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleEmergencyCall("911")}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Emergency Services (911)
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Nearby Police Stations</h2>
              <div className="space-y-4">
                {stations.map(station => (
                  <div 
                    key={station.id} 
                    className={`border p-4 rounded-lg ${
                      nearestStation?.id === station.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {station.name}
                          {nearestStation?.id === station.id && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Nearest</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{station.address}</p>
                        <p className="text-sm text-gray-500">Distance: {station.distance}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmergencyCall(station.phone)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Police Stations Map</h2>
            <MapWrapper 
              stations={stations}
              currentLocation={currentLocation}
              onStationClick={handleStationClick}
              nearestStationId={nearestStation?.id}
            />
          </div>
        </div>
      </main>
    </div>
  )
} 