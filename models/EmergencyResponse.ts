import { ObjectId } from 'mongodb'

export interface EmergencyResponse {
  _id?: ObjectId
  userId: ObjectId
  type: 'SOS' | 'GEOFENCE' | 'MANUAL'
  location: {
    latitude: number
    longitude: number
  }
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED'
  respondedBy?: {
    name: string
    phoneNumber: string
    relationship: string
  }
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
} 