import mongoose, { Schema, Document } from "mongoose";

export interface HelpRequestDocument extends Document {
  name: string;
  email: string;
  message: string;
  subject: string;
  phone: string;
  createdAt: Date;
}

const HelpRequestSchema = new Schema<HelpRequestDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const HelpRequestModel = mongoose.model<HelpRequestDocument>(
  "HelpRequest",
  HelpRequestSchema,
  "helpRequests"
);

export default HelpRequestModel;
