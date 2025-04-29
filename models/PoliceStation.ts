import { ObjectId } from 'mongodb'

export interface PoliceStation {
  _id?: ObjectId
  name: string
  address: string
  phoneNumber: string
  location: {
    latitude: number
    longitude: number
  }
  jurisdiction: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
} 