import dotenv from "dotenv";
import mongoose from "mongoose";
import ProductModel from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";

dotenv.config();

async function migrateProductStatus() {
  const mongoUrl = process.env.MONGO_CAMERA_SHOP_URL;
  if (!mongoUrl) throw new Error("Missing MONGO_CAMERA_SHOP_URL");

  await mongoose.connect(mongoUrl);

  const res1 = await ProductModel.updateMany(
    { productStatus: "PAUSE" },
    { $set: { productStatus: ProductStatus.NEW } }
  );
  const res2 = await ProductModel.updateMany(
    { productStatus: "PROCESS" },
    { $set: { productStatus: ProductStatus.USED } }
  );

  console.log("Migrated PAUSE->NEW:", res1.modifiedCount);
  console.log("Migrated PROCESS->USED:", res2.modifiedCount);
  await mongoose.disconnect();
}

migrateProductStatus().catch((err) => {
  console.error("Failed to migrate product statuses", err);
  process.exit(1);
});
