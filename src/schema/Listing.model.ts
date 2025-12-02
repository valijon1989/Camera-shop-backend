import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    category: {
      type: String,
      enum: ["dslr", "mirrorless", "lens", "cinema", "drone", "accessory"],
      default: "mirrorless",
    },
    condition: {
      type: String,
      enum: ["NEW", "USED"],
      default: "USED",
    },
    resolutionMp: { type: Number },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    location: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: "text", brand: "text", model: "text", description: "text" });

export default mongoose.model("Listing", listingSchema, "gear_listings");
