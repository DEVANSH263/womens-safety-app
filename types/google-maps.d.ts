declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions)
    controls: any[][]
    setCenter(latLng: LatLng): void
    setZoom(zoom: number): void
    setMapTypeId(mapTypeId: string): void
    panTo(latLng: LatLng | { lat: number; lng: number }): void
  }

  class LatLng {
    constructor(lat: number, lng: number)
    lat(): number
    lng(): number
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng)
    getNorthEast(): LatLng
    getSouthWest(): LatLng
  }

  class Marker {
    constructor(opts: MarkerOptions)
    setPosition(latLng: LatLng | { lat: number; lng: number }): void
    setMap(map: Map | null): void
  }

  interface MarkerOptions {
    position: LatLng | { lat: number; lng: number }
    map: Map | null
    icon?: {
      path: SymbolPath | string
      scale?: number
      fillColor?: string
      fillOpacity?: number
      strokeColor?: string
      strokeWeight?: number
    }
    title?: string
  }

  enum SymbolPath {
    CIRCLE = 0,
    FORWARD_CLOSED_ARROW = 1,
    FORWARD_OPEN_ARROW = 2,
    BACKWARD_CLOSED_ARROW = 3,
    BACKWARD_OPEN_ARROW = 4
  }

  namespace geometry {
    namespace poly {
      function containsLocation(point: LatLng, polygon: Polygon): boolean
    }
  }

  interface MapOptions {
    center?: { lat: number; lng: number } | LatLng
    zoom?: number
    mapTypeId?: string
    fullscreenControl?: boolean
    streetViewControl?: boolean
  }

  namespace drawing {
    class DrawingManager {
      constructor(options?: DrawingManagerOptions)
      setMap(map: Map | null): void
    }

    interface DrawingManagerOptions {
      drawingMode?: any
      drawingControl?: boolean
      drawingControlOptions?: DrawingControlOptions
      polygonOptions?: PolygonOptions
      rectangleOptions?: RectangleOptions
    }

    interface DrawingControlOptions {
      position?: any
      drawingModes?: any[]
    }

    interface PolygonOptions {
      paths?: any[]
      fillColor?: string
      fillOpacity?: number
      strokeWeight?: number
      strokeColor?: string
      editable?: boolean
      draggable?: boolean
    }

    interface RectangleOptions {
      fillColor?: string
      fillOpacity?: number
      strokeWeight?: number
      strokeColor?: string
      editable?: boolean
      draggable?: boolean
    }

    enum OverlayType {
      POLYGON = 'polygon',
      RECTANGLE = 'rectangle'
    }
  }

  class Rectangle {
    constructor(options?: drawing.RectangleOptions)
    setMap(map: Map | null): void
    getBounds(): LatLngBounds
  }

  class Polygon {
    constructor(options?: drawing.PolygonOptions)
    setMap(map: Map | null): void
    getPath(): any
  }

  class event {
    static addListener(instance: any, eventName: string, handler: Function): void
  }

  class ControlPosition {
    static TOP_CENTER: number
    static BOTTOM_CENTER: number
  }
} 