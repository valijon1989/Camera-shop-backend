import { Request, Response } from "express";
import ProductService from "../models/Product.service";
import MemberModel from "../schema/Member.model";
import ProductModel from "../schema/Product.model";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { ProductStatus } from "../libs/enums/product.enum";

const productService = new ProductService();

const adminController = {
  dashboard: async (req: Request, res: Response) => {
    try {
      const [totalCameras, newCameras, usedCameras, soldOutCameras] =
        await Promise.all([
          ProductModel.countDocuments(),
          ProductModel.countDocuments({ productStatus: ProductStatus.NEW }),
          ProductModel.countDocuments({ productStatus: ProductStatus.USED }),
          ProductModel.countDocuments({ productStatus: ProductStatus.SOLD_OUT }),
        ]);

      const [totalUsers, totalAgents, blockedMembers] = await Promise.all([
        MemberModel.countDocuments({ memberType: MemberType.USER }),
        MemberModel.countDocuments({ memberType: MemberType.AGENT }),
        MemberModel.countDocuments({ memberStatus: MemberStatus.BLOCK }),
      ]);

      const recentCameras = await ProductModel.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("cameraModel brand price productStatus images createdAt")
        .lean();

      return res.render("home", {
        member: (req as any).member,
        message: typeof req.query.msg === "string" ? req.query.msg : null,
        metrics: {
          totalCameras,
          newCameras,
          usedCameras,
          soldOutCameras,
          totalUsers,
          totalAgents,
          blockedMembers,
        },
        recentCameras,
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);
      return res.status(500).send("Failed to load admin dashboard");
    }
  },
  products: async (_req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      return res.render("products", { products });
    } catch (err) {
      console.error("Admin products error:", err);
      return res.status(500).send("Failed to load products");
    }
  },
  users: async (req: Request, res: Response) => {
    try {
      const users = await MemberModel.find({}, [
        "memberNick",
        "memberPhone",
        "memberType",
        "memberStatus",
        "memberImage",
        "productsSold",
        "productsBought",
        "likesCount",
        "rating",
      ]).lean();
      return res.render("users", { member: (req as any).member, users });
    } catch (err) {
      console.error("Admin users error:", err);
      return res.status(500).send("Failed to load users");
    }
  },
};

export default adminController;
