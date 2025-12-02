import { ObjectId } from "mongoose";
export interface Product {
  _id: ObjectId;
  cameraModel: string;
  brand: string;
  category?: string;
  createdBy?: ObjectId;
  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;
  batteryCapacityMah?: number;
  photoResolution?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
  price: number;
  condition?: string;
  location?: string;
  soldOut?: boolean;
  images: string[];
  views: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  brand?: string;
  cameraModel?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  mountType?: string;
  sensorType?: string;
  resolutionMp?: number;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
  search?: string;
}

export interface ProductInput {
  cameraModel: string;
  brand: string;
  category?: string;
  createdBy?: ObjectId;
  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;
  batteryCapacityMah?: number;
  photoResolution?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
  price: number;
  condition?: string;
  location?: string;
  images?: string[];
  description?: string;
  soldOut?: boolean;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  cameraModel?: string;
  brand?: string;
  category?: string;
  resolutionMp?: number;
  sensorType?: string;
  mountType?: string;
  batteryCapacityMah?: number;
  photoResolution?: string;
  videoResolution?: string;
  isoRange?: string;
  stabilization?: string;
  price?: number;
  condition?: string;
  location?: string;
  images?: string[];
  description?: string;
  views?: number;
}
