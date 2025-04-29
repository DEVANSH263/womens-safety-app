import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyAlert extends Document {
  userId: mongoose.Types.ObjectId;
  location: {
    coordinates: [number, number];  // [longitude, latitude]
    address?: string;
  };
  timestamp: Date;
  status: 'ACTIVE' | 'RESOLVED' | 'FALSE_ALARM';
  type: 'SOS' | 'GEOFENCE' | 'INACTIVITY' | 'MANUAL';
  description?: string;
  notifiedContacts: Array<{
    contactId: mongoose.Types.ObjectId;
    notifiedAt: Date;
    responseStatus: 'PENDING' | 'ACKNOWLEDGED' | 'RESPONDING' | 'NOT_AVAILABLE';
    responseTime?: Date;
  }>;
  policeNotified: boolean;
  policeResponse?: {
    stationId: string;
    officerId?: string;
    status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'COMPLETED';
    dispatchTime: Date;
    arrivalTime?: Date;
  };
  mediaUrls?: string[];  // URLs to any photos/videos captured
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  resolutionNotes?: string;
}

const EmergencyAlertSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  location: {
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: String
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED', 'FALSE_ALARM'],
    default: 'ACTIVE',
    required: true
  },
  type: {
    type: String,
    enum: ['SOS', 'GEOFENCE', 'INACTIVITY', 'MANUAL'],
    required: true
  },
  description: String,
  notifiedContacts: [{
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notifiedAt: {
      type: Date,
      required: true
    },
    responseStatus: {
      type: String,
      enum: ['PENDING', 'ACKNOWLEDGED', 'RESPONDING', 'NOT_AVAILABLE'],
      default: 'PENDING'
    },
    responseTime: Date
  }],
  policeNotified: {
    type: Boolean,
    default: false
  },
  policeResponse: {
    stationId: String,
    officerId: String,
    status: {
      type: String,
      enum: ['DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'COMPLETED']
    },
    dispatchTime: Date,
    arrivalTime: Date
  },
  mediaUrls: [String],
  resolvedAt: Date,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: String
}, {
  timestamps: true
});

// Indexes for quick queries
EmergencyAlertSchema.index({ userId: 1, status: 1, timestamp: -1 });
EmergencyAlertSchema.index({ 'location.coordinates': '2dsphere' });
EmergencyAlertSchema.index({ status: 1, type: 1 });

export default mongoose.model<IEmergencyAlert>('EmergencyAlert', EmergencyAlertSchema); 