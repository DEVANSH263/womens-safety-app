'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { CustomMapProps } from './leaflet-map'

const LeafletMap = dynamic<CustomMapProps>(
  () => import('./leaflet-map'),
  { ssr: false }
)

export interface MapProps {
  position: [number, number]
}

export default function Map({ position }: MapProps) {
  return <LeafletMap position={position} />
} 