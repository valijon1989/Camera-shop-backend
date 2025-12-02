//@ts-ignore
import { Request, RequestHandler, Router } from "express";
import { isValidObjectId } from "mongoose";
import Product from "../schema/Product.model";

const router = Router();

const listProducts: RequestHandler = async (_req: Request, res, next): Promise<void> => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById: RequestHandler = async (req: Request, res, next): Promise<void> => {
  try {
    const id = req.params.id;
    // Prevent CastErrors (and nodemon restarts) when non-objectId paths like "categories" are requested
    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid product id" });
      return;
    }
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

router.get("/", listProducts);
router.get("/:id", getProductById);

export default router;
