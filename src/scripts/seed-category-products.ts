import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";

dotenv.config();

type SeedItem = {
  cameraModel: string;
  brand: string;
  category: string;
  price: number;
  images: string[];
  condition?: string;
  location?: string;
  resolutionMp?: number;
  sensorType?: string;
};

const dslr: SeedItem[] = [
  {
    cameraModel: "Canon EOS 90D",
    brand: "Canon",
    category: "DSLR",
    price: 1299,
    images: ["uploads/canon-r6-ii-1.jpg", "uploads/canon-r6-ii-2.jpg", "uploads/canon-r6-ii-3.jpg"],
    resolutionMp: 32,
    sensorType: "APS-C",
  },
  {
    cameraModel: "Nikon D850",
    brand: "Nikon",
    category: "DSLR",
    price: 2499,
    images: ["uploads/nikon-z8-1.jpg", "uploads/nikon-z8-2.jpg", "uploads/nikon-z8-3.jpg"],
    resolutionMp: 45,
    sensorType: "Full-frame",
  },
  {
    cameraModel: "Sony A99 II",
    brand: "Sony",
    category: "DSLR",
    price: 2399,
    images: ["uploads/sony-a7-iv-1.jpg", "uploads/sony-a7-iv-2.jpg", "uploads/sony-a7-iv-3.jpg"],
    resolutionMp: 42,
    sensorType: "Full-frame",
  },
  {
    cameraModel: "Fujifilm X-T5",
    brand: "Fujifilm",
    category: "DSLR",
    price: 1699,
    images: ["uploads/fuji-x-t5-1.jpg", "uploads/fuji-x-t5-2.jpg", "uploads/fuji-x-t5-3.jpg"],
    resolutionMp: 40,
    sensorType: "APS-C",
  },
];

const lenses: SeedItem[] = [
  {
    cameraModel: "Sony FE 24-70mm f/2.8 GM II",
    brand: "Sony",
    category: "LENSES",
    price: 2299,
    images: ["uploads/lens-24-70-gm2.jpg"],
  },
  {
    cameraModel: "Canon RF 50mm f/1.2L",
    brand: "Canon",
    category: "LENSES",
    price: 2399,
    images: ["uploads/lens-rf-50-12.jpg"],
  },
  {
    cameraModel: "Fujifilm XF 16-55mm f/2.8",
    brand: "Fujifilm",
    category: "LENSES",
    price: 1199,
    images: ["uploads/lens-xf-16-55.jpg"],
  },
  {
    cameraModel: "Panasonic Lumix S 24-105mm f/4",
    brand: "Panasonic",
    category: "LENSES",
    price: 1299,
    images: ["uploads/lens-generic-1.jpg"],
  },
];

const drones: SeedItem[] = [
  {
    cameraModel: "DJI Air 3",
    brand: "DJI",
    category: "DRONES",
    price: 1099,
    images: ["uploads/drone-air3.jpg"],
  },
  {
    cameraModel: "DJI Mini 4 Pro",
    brand: "DJI",
    category: "DRONES",
    price: 799,
    images: ["uploads/drone-mini4pro.jpg"],
  },
  {
    cameraModel: "Autel EVO Lite+",
    brand: "Autel",
    category: "DRONES",
    price: 1299,
    images: ["uploads/drone-evo-lite.jpg"],
  },
  {
    cameraModel: "DJI Mavic 3",
    brand: "DJI",
    category: "DRONES",
    price: 1499,
    images: ["uploads/drone-mavic-3.jpg"],
  },
];

const accessories: SeedItem[] = [
  {
    cameraModel: "DJI RS3 Gimbal",
    brand: "DJI",
    category: "ACCESSORIES",
    price: 549,
    images: ["uploads/accessory-dji-rs3.jpg"],
  },
  {
    cameraModel: "Peak Design Travel Backpack",
    brand: "Peak Design",
    category: "ACCESSORIES",
    price: 299,
    images: ["uploads/accessory-peak-backpack.jpg"],
  },
  {
    cameraModel: "Rode NTG Shotgun Mic",
    brand: "Rode",
    category: "ACCESSORIES",
    price: 249,
    images: ["uploads/accessory-rode-ntg.jpg"],
  },
  {
    cameraModel: "ColorChecker Passport",
    brand: "X-Rite",
    category: "ACCESSORIES",
    price: 149,
    images: ["uploads/other-colorchecker.jpg"],
  },
  {
    cameraModel: "SmallRig Magic Arm",
    brand: "SmallRig",
    category: "ACCESSORIES",
    price: 79,
    images: ["uploads/other-magic-arm.jpg"],
  },
  {
    cameraModel: "Samsung T7 Shield SSD",
    brand: "Samsung",
    category: "ACCESSORIES",
    price: 159,
    images: ["uploads/other-t7-shield.jpg"],
  },
];

const all: SeedItem[] = [...dslr, ...lenses, ...drones, ...accessories];

async function run() {
  const url =
    process.env.MONGO_CAMERA_SHOP_URL ||
    process.env.MONGO_URL ||
    "mongodb://127.0.0.1:27017/camera_shop";

  await mongoose.connect(url);

  for (const item of all) {
    await Product.updateOne(
      { cameraModel: item.cameraModel, brand: item.brand },
      {
        $set: {
          ...item,
          productStatus: ProductStatus.NEW,
          soldOut: false,
        },
      },
      { upsert: true }
    );
  }

  console.log(`Seeded ${all.length} products across DSLR, LENSES, DRONES, ACCESSORIES.`);
  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
