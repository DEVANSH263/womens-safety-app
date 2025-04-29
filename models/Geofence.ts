import mongoose from 'mongoose';

export interface IGeofence extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: 'circle' | 'polygon';
  radius?: number; // For circle type, in meters
  coordinates: number[][]; // For circle: [[centerLng, centerLat]], For polygon: [[lng1, lat1], [lng2, lat2], ...]
  isActive: boolean;
  schedule?: {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    days: number[]; // 0-6, where 0 is Sunday
  };
  alertSettings: {
    onEnter: boolean;
    onExit: boolean;
    notifyContacts: mongoose.Types.ObjectId[]; // References to emergency contacts
  };
  createdAt: Date;
  updatedAt: Date;
}

const GeofenceSchema = new mongoose.Schema<IGeofence>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { 
    type: String,
    enum: ['circle', 'polygon'],
    required: true
  },
  radius: { 
    type: Number,
    required: function(this: IGeofence) { return this.type === 'circle'; }
  },
  coordinates: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(coords: number[][]) {
        if (this.type === 'circle') {
          return coords.length === 1 && coords[0].length === 2;
        }
        return coords.length >= 3; // Polygon needs at least 3 points
      },
      message: 'Invalid coordinates for the geofence type'
    }
  },
  isActive: { type: Boolean, default: true },
  schedule: {
    startTime: String,
    endTime: String,
    days: [{ type: Number, min: 0, max: 6 }]
  },
  alertSettings: {
    onEnter: { type: Boolean, default: true },
    onExit: { type: Boolean, default: true },
    notifyContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, {
  timestamps: true
});

// Add geospatial index for efficient queries
GeofenceSchema.index({ coordinates: '2dsphere' });

const Geofence = mongoose.models.Geofence || mongoose.model<IGeofence>('Geofence', GeofenceSchema);
export default Geofence; 