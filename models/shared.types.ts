export interface ILocation {
  coordinates: [number, number]; // [longitude, latitude]
  timestamp: Date;
  address?: string;
}

export interface IVerificationStatus {
  email: boolean;
  phone: boolean;
}

export interface IUserSettings {
  locationTracking: boolean;
  backgroundTracking: boolean;
  highAccuracyMode: boolean;
  saveLocationHistory: boolean;
  shareLocationWith: string[]; // Array of user IDs
}

export interface IEmergencyContact {
  name: string;
  relation: string;
  phone: string;
  notificationPreference: 'sms' | 'call' | 'both';
} 