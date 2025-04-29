export interface User {
  _id?: string;
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  relation?: string;
  createdAt?: Date;
}

export interface Alert {
  _id?: string;
  userId: string;
  type: "SOS" | "Geofence" | "Manual";
  location: { lat: number; lng: number };
  timestamp: Date;
  status: "active" | "resolved";
  notifiedContacts?: string[];
  notifiedAuthorities?: string[];
}

export interface Location {
  _id?: string;
  userId: string;
  location: { lat: number; lng: number };
  timestamp: Date;
}

export interface Geofence {
  _id?: string;
  userId: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  type: "safe" | "unsafe";
  createdAt?: Date;
}

export interface Police {
  _id?: string;
  name: string;
  phone: string;
  location: { lat: number; lng: number };
  area?: string;
}

export interface AssistanceRequest {
  _id?: string;
  userId: string;
  type: "medical" | "police" | "other";
  details?: string;
  location: { lat: number; lng: number };
  timestamp: Date;
  status: "pending" | "in_progress" | "completed";
} 