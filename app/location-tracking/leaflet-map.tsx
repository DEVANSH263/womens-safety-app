'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

export interface CustomMapProps {
  position: [number, number]
}

export default function LeafletMap({ position }: CustomMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
      iconUrl: markerIcon.src ?? markerIcon,
      shadowUrl: markerShadow.src ?? markerShadow,
    })
  }, [])

  return (
    <MapContainer
      {...{
        center: position,
        zoom: 16,
        scrollWheelZoom: true,
        style: { height: "100%", width: "100%", minHeight: 350 },
        className: "rounded-lg"
      } as any}
    >
      <TileLayer
        {...{
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        } as any}
      />
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  )
} 