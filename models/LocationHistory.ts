import mongoose from 'mongoose';
import { ILocation } from './shared.types';

export interface ILocationHistory extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  location: ILocation;
  accuracy: number;
  speed?: number;
  heading?: number;
  batteryLevel?: number;
  source: 'gps' | 'network' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const LocationHistorySchema = new mongoose.Schema<ILocationHistory>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    coordinates: {
      type: [Number],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    address: String
  },
  accuracy: { type: Number, required: true }, // Accuracy in meters
  speed: Number, // Speed in meters per second
  heading: Number, // Heading in degrees (0-360)
  batteryLevel: { 
    type: Number,
    min: 0,
    max: 100
  },
  source: {
    type: String,
    enum: ['gps', 'network', 'manual'],
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for efficient queries
LocationHistorySchema.index({ user: 1, 'location.timestamp': -1 });
LocationHistorySchema.index({ 'location.coordinates': '2dsphere' });

// Add TTL index to automatically delete old records after 30 days
LocationHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const LocationHistory = mongoose.models.LocationHistory || mongoose.model<ILocationHistory>('LocationHistory', LocationHistorySchema);
export default LocationHistory; 