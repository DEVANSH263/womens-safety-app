import mongoose, { Schema, Document } from 'mongoose';

export interface IPolice extends Document {
  name: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const PoliceSchema: Schema = new Schema<IPolice>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Police || mongoose.model<IPolice>('Police', PoliceSchema); 