import { FC } from 'react'

export interface LeafletMapProps {
  position: [number, number]
}

declare const LeafletMap: FC<LeafletMapProps>
export default LeafletMap 