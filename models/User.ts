import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { Contact, GeoLocation, contactSchema, geoLocationSchema } from './types';

export interface IEmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
  isVerified: boolean;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  emergencyContacts: IEmergencyContact[];
  lastKnownLocation?: GeoLocation;
  settings: {
    locationTracking: boolean;
    backgroundTracking: boolean;
    highAccuracyMode: boolean;
    saveLocationHistory: boolean;
    shareLocationWith: string[];  // Array of user IDs
  };
  verificationStatus: {
    email: boolean;
    phone: boolean;
  };
  emergencyPin?: string;  // For quick SOS activation
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Create a modified version of geoLocationSchema where coordinates are not required
const optionalGeoLocationSchema = {
  ...geoLocationSchema,
  coordinates: {
    ...geoLocationSchema.coordinates,
    required: false
  }
};

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  emergencyContacts: [emergencyContactSchema],
  lastKnownLocation: optionalGeoLocationSchema,
  settings: {
    locationTracking: { type: Boolean, default: true },
    backgroundTracking: { type: Boolean, default: true },
    highAccuracyMode: { type: Boolean, default: true },
    saveLocationHistory: { type: Boolean, default: false },
    shareLocationWith: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  verificationStatus: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false }
  },
  emergencyPin: String
}, {
  timestamps: true
});

// Index for email and phone searches
UserSchema.index({ email: 1, phone: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Prevent model recompilation
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User; 