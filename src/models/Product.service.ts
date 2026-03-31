import { shapeIntroMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { T } from "../libs/types/common";
import { MongoId } from "../libs/types/common";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import fs from "fs";
import path from "path";

// Escape regex special characters to safely build exact-match regex
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ProductService {
  private readonly productModel;
  public viewService;
  private readonly uploadsPrefix = "uploads/products/";

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  private toProduct(product: Product): Product {
    return {
      ...product,
      images: this.normalizeImages(product.images),
    };
  }

  private normalizeImages(images?: string[]): string[] {
    if (!Array.isArray(images)) return [];
    const uploadsRoot = path.join(process.cwd(), "uploads");

    const toServedPath = (filename: string) => {
      const fileInProducts = path.join(uploadsRoot, "products", filename);
      if (fs.existsSync(fileInProducts)) return `uploads/products/${filename}`;

      const fileInRoot = path.join(uploadsRoot, filename);
      if (fs.existsSync(fileInRoot)) return `uploads/${filename}`;

      // Fallback: still return products path so frontend builds valid URL
      return `uploads/products/${filename}`;
    };

    return images.map((img) => {
      if (!img) return "uploads/placeholder-product.jpg";
      const cleaned = img.replace(/\\/g, "/");
      if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith("data:")) return cleaned;

      // Absolute path: copy into uploads/products then serve from there
      if (path.isAbsolute(cleaned)) {
        const filename = path.basename(cleaned);
        const destAbs = path.join(uploadsRoot, "products", filename);
        try {
          if (fs.existsSync(cleaned) && !fs.existsSync(destAbs)) {
            fs.copyFileSync(cleaned, destAbs);
          }
        } catch (err) {
          console.warn("normalizeImages copy fallback error:", err);
        }
        return toServedPath(path.basename(cleaned));
      }

      // If path already contains /uploads/, strip to filename
      const uploadsIndex = cleaned.toLowerCase().indexOf("/uploads/");
      if (uploadsIndex >= 0) {
        const filename = path.basename(cleaned);
        return toServedPath(filename);
      }

      // Default: treat as filename
      return toServedPath(path.basename(cleaned));
    });
  }

  /* SPA */

  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    console.log("inquiry", inquiry);

    const match: T = {};
    // Brand: case-insensitive exact match so "sony" / "Sony" / slug-mapped values all ishlaydi
    if (inquiry.brand)
      match.brand = new RegExp(`^${escapeRegex(inquiry.brand)}$`, "i");
    if (inquiry.cameraModel) match.cameraModel = inquiry.cameraModel;
    // Category is matched case-insensitively so "mirrorless" / "MIRRORLESS" both work
    if (inquiry.category)
      match.category = new RegExp(`^${escapeRegex(inquiry.category)}$`, "i");
    if (inquiry.condition) match.condition = inquiry.condition;
    if (inquiry.location) match.location = inquiry.location;
    if (inquiry.mountType) match.mountType = inquiry.mountType;
    if (inquiry.sensorType) match.sensorType = inquiry.sensorType;
    if (inquiry.minPrice !== undefined || inquiry.maxPrice !== undefined) {
      match.price = {};
      if (inquiry.minPrice !== undefined) match.price.$gte = inquiry.minPrice;
      if (inquiry.maxPrice !== undefined) match.price.$lte = inquiry.maxPrice;
    }
    if (inquiry.resolutionMp !== undefined) match.resolutionMp = inquiry.resolutionMp;
    if (inquiry.videoResolution) match.videoResolution = inquiry.videoResolution;
    if (inquiry.isoRange) match.isoRange = inquiry.isoRange;
    if (inquiry.stabilization) match.stabilization = inquiry.stabilization;

    if (inquiry.search) {
      match.$or = [
        { cameraModel: { $regex: new RegExp(inquiry.search, "i") } },
        { brand: { $regex: new RegExp(inquiry.search, "i") } },
      ];
    }

    const sort: T =
      inquiry.order === "price"
        ? { price: 1 }
        : { [inquiry.order || "createdAt"]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result.map((doc: any) => ({
      ...doc,
      images: this.normalizeImages(doc?.images),
    }));
  }

  public async getProduct(
    memberId: MongoId | null,
    id: string
  ): Promise<Product> {
    const productId = shapeIntroMongooseObjectId(id);

    let result = await this.productModel
      .findOne({ _id: productId })
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // Check Existance
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistance(input);

      console.log("existView", !!existView);
      if (!existView) {
        //insert View
        await this.viewService.insertMemberView(input);

        //Increase Counts
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true }
          )
          .lean<Product>()
          .exec();
        if (!result) {
          throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        }
      }
    }

    return this.toProduct(result);
  }

  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().lean<Product[]>().exec();
    return result.map((product) => this.toProduct(product));
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return this.toProduct(result.toObject());
    } catch (err) {
      console.error("Error, model: createNewProduct", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    //string => object
    const productId = shapeIntroMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: productId }, input, { new: true }) // { new: true }-ozgargan qiymatni qaytar
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return this.toProduct(result);
  }

  public async deleteProduct(id: string): Promise<Product> {
    const objId = shapeIntroMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndDelete({ _id: objId })
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return this.toProduct(result);
  }
}
export default ProductService;
