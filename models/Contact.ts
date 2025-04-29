import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContact extends Document {
  user: Types.ObjectId;
  name: string;
  phoneNumber: string;
  relationship: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema<IContact>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  relationship: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema); 