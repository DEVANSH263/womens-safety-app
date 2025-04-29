import mongoose from 'mongoose';
import { ILocation } from './shared.types';

export interface IAlert extends mongoose.Document {
  user?: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
  };
  timestamp: Date;
  type: 'SOS' | 'GEOFENCE' | 'ASSISTANCE';
  status: 'active' | 'resolved' | 'false_alarm';
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  notes?: string;
  isGuest?: boolean;
  guestInfo?: {
    name?: string;
    phoneNumber: string;
  };
}

const alertSchema = new mongoose.Schema<IAlert>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['SOS', 'GEOFENCE', 'ASSISTANCE'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm'],
    default: 'active'
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  isGuest: {
    type: Boolean,
    default: false
  },
  guestInfo: {
    name: String,
    phoneNumber: {
      type: String,
      required: function() {
        return this.isGuest === true;
      }
    }
  }
});

// Create a 2dsphere index for geospatial queries
alertSchema.index({ location: '2dsphere' });

// Prevent model recompilation
const Alert = mongoose.models.Alert || mongoose.model<IAlert>('Alert', alertSchema);

export default Alert; 