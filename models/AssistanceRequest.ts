import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAssistanceRequest extends Document {
  user: Types.ObjectId;
  type: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AssistanceRequestSchema: Schema = new Schema<IAssistanceRequest>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
}, { timestamps: true });

export default mongoose.models.AssistanceRequest || mongoose.model<IAssistanceRequest>('AssistanceRequest', AssistanceRequestSchema); 