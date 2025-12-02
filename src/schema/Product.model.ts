import mongoose, { Schema } from "mongoose";

export const CameraBrands = [
  "Sony",
  "Canon",
  "Nikon",
  "Fujifilm",
  "Panasonic",
  "Leica",
  "Pentax",
  "Blackmagic",
  "DJI",
  "GoPro",
] as const;

const productSchema = new Schema(
  {
    cameraModel: { type: String, required: true },
    // Brand enum removed to allow any vendor (e.g., Manfrotto, DJI, etc.)
    brand: { type: String, required: true },
    category: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Member" },

    resolutionMp: { type: Number },
    sensorType: { type: String },
    mountType: { type: String },

    batteryCapacityMah: { type: Number },
    photoResolution: { type: String },
    videoResolution: { type: String },
    isoRange: { type: String },
    stabilization: { type: String },

    price: { type: Number, required: true },
    condition: { type: String },
    location: { type: String },
    soldOut: { type: Boolean, default: false },

    images: { type: [String], default: [] },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ cameraModel: 1, brand: 1 });

export default mongoose.model("Camera", productSchema, "cameras");
