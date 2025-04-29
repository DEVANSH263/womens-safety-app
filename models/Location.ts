import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILocation extends Document {
  user: Types.ObjectId;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema: Schema = new Schema<ILocation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema); 