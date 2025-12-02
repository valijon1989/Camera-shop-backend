import dotenv from "dotenv";
import mongoose from "mongoose";
import CameraModel from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";

dotenv.config();

const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;

const img = (file: string) => `uploads/${file}`;

type SeedCamera = {
  title: string;
  brand: string;
  model: string;
  sensor: string;
  megapixels: number;
  category: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
};

const cameras: SeedCamera[] = [
  {
    title: "Sony Alpha 1",
    brand: "Sony",
    model: "Alpha 1",
    sensor: "Full-frame",
    megapixels: 50,
    category: "mirrorless",
    price: 6499,
    stock: 5,
    description: "8K30, 4K120, 50MP stacked sensor, flagship hybrid.",
    images: [
      img("sony-a1-1.jpg"),
      img("sony-a1-2.jpg"),
      img("sony-a1-3.jpg"),
    ],
  },
  {
    title: "Sony A7R V",
    brand: "Sony",
    model: "A7R V",
    sensor: "Full-frame",
    megapixels: 61,
    category: "mirrorless",
    price: 3899,
    stock: 8,
    description: "61MP, AI AF, 8K, 8-stop IBIS, hi-res king.",
    images: [
      img("sony-a7r5-1.jpg"),
      img("sony-a7r5-2.jpg"),
      img("sony-a7r5-3.jpg"),
    ],
  },
  {
    title: "Sony FX3",
    brand: "Sony",
    model: "FX3",
    sensor: "Full-frame",
    megapixels: 12,
    category: "cinema",
    price: 3899,
    stock: 6,
    description: "Compact cinema camera, 4K120, S-Cinetone, dual CFexpress A.",
    images: [
      img("sony-fx3-1.jpg"),
      img("sony-fx3-2.jpg"),
      img("sony-fx3-3.jpg"),
    ],
  },
  {
    title: "Sony A9 III",
    brand: "Sony",
    model: "A9 III",
    sensor: "Full-frame",
    megapixels: 24,
    category: "mirrorless",
    price: 5999,
    stock: 5,
    description: "Global shutter, 120 fps blackout-free, 4K120 10-bit.",
    images: [
      img("sony-a7-iv-1.jpg"),
      img("sony-a7-iv-2.jpg"),
      img("sony-a7-iv-3.jpg"),
    ],
  },
  {
    title: "Canon EOS R3",
    brand: "Canon",
    model: "EOS R3",
    sensor: "Full-frame",
    megapixels: 24,
    category: "mirrorless",
    price: 5999,
    stock: 5,
    description: "Stacked sensor, 30 fps, 6K RAW, eye-control AF flagship.",
    images: [
      img("canon-r6-ii-1.jpg"),
      img("canon-r6-ii-2.jpg"),
      img("canon-r6-ii-3.jpg"),
    ],
  },
  {
    title: "Canon EOS R5 C",
    brand: "Canon",
    model: "EOS R5 C",
    sensor: "Full-frame",
    megapixels: 45,
    category: "cinema",
    price: 4499,
    stock: 6,
    description: "Hybrid cinema EOS: 8K60 RAW, active cooling, RF mount.",
    images: [
      img("canon-r6-ii-2.jpg"),
      img("canon-r6-ii-3.jpg"),
      img("canon-r6-ii-4.jpg"),
    ],
  },
  {
    title: "Canon EOS R5",
    brand: "Canon",
    model: "EOS R5",
    sensor: "Full-frame",
    megapixels: 45,
    category: "mirrorless",
    price: 3399,
    stock: 8,
    description: "45MP, 8K RAW, 4K120, Dual Pixel AF II workhorse.",
    images: [
      img("canon-r6-ii-1.jpg"),
      img("canon-r6-ii-3.jpg"),
      img("canon-r6-ii-4.jpg"),
    ],
  },
  {
    title: "Nikon Z9",
    brand: "Nikon",
    model: "Z9",
    sensor: "Full-frame",
    megapixels: 45,
    category: "mirrorless",
    price: 5499,
    stock: 5,
    description: "45MP stacked, 8K60 RAW, no mechanical shutter, pro build.",
    images: [
      img("nikon-z8-1.jpg"),
      img("nikon-z8-2.jpg"),
      img("nikon-z8-3.jpg"),
    ],
  },
  {
    title: "Nikon Z8",
    brand: "Nikon",
    model: "Z8",
    sensor: "Full-frame",
    megapixels: 45,
    category: "mirrorless",
    price: 3999,
    stock: 7,
    description: "Mini Z9: 8K30, 4K120, stacked sensor, compact body.",
    images: [
      img("nikon-z8-1.jpg"),
      img("nikon-z8-2.jpg"),
      img("nikon-z8-4.jpg"),
    ],
  },
  {
    title: "Nikon Z7 II",
    brand: "Nikon",
    model: "Z7 II",
    sensor: "Full-frame",
    megapixels: 45,
    category: "mirrorless",
    price: 2999,
    stock: 9,
    description: "High-res 45MP, dual processors, improved AF, dual card slots.",
    images: [
      img("nikon-z8-2.jpg"),
      img("nikon-z8-3.jpg"),
      img("nikon-z8-4.jpg"),
    ],
  },
];

async function seedCameras() {
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL in .env");
  await mongoose.connect(mongoUrl, { dbName: "camera_shop" });

  for (const cam of cameras) {
    const cameraModel = cam.model;
    await CameraModel.updateOne(
      { cameraModel, brand: cam.brand },
      {
        $set: {
          cameraModel,
          brand: cam.brand,
          category: cam.category,
          resolutionMp: cam.megapixels,
          sensorType: cam.sensor,
          price: cam.price,
          images: cam.images,
          productStatus: ProductStatus.NEW,
        },
      },
      { upsert: true }
    );
  }

  await mongoose.disconnect();
  console.log("Camera seed completed");
}

seedCameras().catch((err) => {
  console.error("Failed to seed cameras", err);
  process.exit(1);
});
