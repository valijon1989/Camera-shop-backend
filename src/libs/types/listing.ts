import { ObjectId } from "mongoose";
import { Member } from "./member";

export interface Listing {
  _id: ObjectId;
  owner: ObjectId | Member;
  title: string;
  brand: string;
  model: string;
  category: "dslr" | "mirrorless" | "lens" | "cinema" | "drone" | "accessory";
  condition: "NEW" | "USED";
  price: number;
  currency: string;
  location: string;
  images: string[];
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingInput {
  title: string;
  brand: string;
  model: string;
  category: Listing["category"];
  condition: Listing["condition"];
  price: number;
  currency?: string;
  location: string;
  images?: string[];
  description?: string;
}

export interface ListingInquiry {
  page?: number;
  limit?: number;
  brand?: string;
  category?: Listing["category"];
  condition?: Listing["condition"];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
  keyword?: string;
}
