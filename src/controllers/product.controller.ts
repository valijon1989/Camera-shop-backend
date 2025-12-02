import express, { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";

const productService = new ProductService();

const productController: T = {};

/* SPA */

productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    // const query = req.query;
    // console.log("req.query:", query); //get method url orqali DB ga obj malumot yuborish
    // const params = req.params;
    // console.log("req.params:", params);
    const {
      page,
      limit,
      order,
      brand,
      model,
      category,
      minPrice,
      maxPrice,
      search,
      condition,
      location,
      mountType,
      sensorType,
      resolutionMp,
      videoResolution,
      isoRange,
      stabilization,
    } = req.query;
    // console.log(`page: ${page} order: ${order}`);

    const orderValue = order ? String(order) : "createdAt";
    const pageValue = Number(page ?? 1);
    const limitValue = Number(limit ?? 10);

    const inquiry: ProductInquiry = {
      order: orderValue,
      page: pageValue,
      limit: limitValue,
    };
    if (brand) inquiry.brand = String(brand);
    if (model) inquiry.cameraModel = String(model);
    // Kategoriya parametrini DB dagi formatga moslab (UPPERCASE) normalize qilamiz,
    // shunda frontenddan keladigan "dslr", "lenses", ... kabi lowercase ham ishlaydi.
    if (category) inquiry.category = String(category).toUpperCase() as any;
    if (minPrice !== undefined) inquiry.minPrice = Number(minPrice);
    if (maxPrice !== undefined) inquiry.maxPrice = Number(maxPrice);
    if (condition) inquiry.condition = String(condition);
    if (location) inquiry.location = String(location);
    if (mountType) inquiry.mountType = String(mountType);
    if (sensorType) inquiry.sensorType = String(sensorType);
    if (resolutionMp !== undefined) inquiry.resolutionMp = Number(resolutionMp);
    if (videoResolution) inquiry.videoResolution = String(videoResolution);
    if (isoRange) inquiry.isoRange = String(isoRange);
    if (stabilization) inquiry.stabilization = String(stabilization);
    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createProduct = async (req: Request, res: Response) => {
  try {
    console.log("createProduct");
    const payload: ProductInput = req.body;
    const memberId = (req as any).member?._id;
    if (memberId) payload.createdBy = memberId;

    // Always store only filenames, never base64/body images
    payload.images = [];

    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length) {
      if (files.length < 3 || files.length > 10) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ success: false, message: "Images must be 3 to 10 files." });
      }
      payload.images = files.map((f) => f.filename);
    } else {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ success: false, message: "At least 3 images are required." });
    }

    const result = await productService.createNewProduct(payload);

    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, createProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const { id } = req.params;

    const memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/* SSR */

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();

    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("CreateNewProduct");
    console.log("FILES RECEIVED:", req.body);
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    if (req.member?._id) data.createdBy = req.member._id;
    data.images = req.files?.map((ele) => ele.filename) || [];

    await productService.createNewProduct(data);

    res.send(
      `<script> alert("Succesful creation!"); window.location.replace('/admin/product/all')</script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all')</script>`
    );
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;

    const result = await productService.updateChosenProduct(id, req.body);

    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.patchProduct = async (req: Request, res: Response) => {
  try {
    console.log("patchProduct");
    const { id } = req.params;
    const payload = { ...req.body } as any;

    // If files are uploaded, replace images array with new filenames (max 10)
    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (files && files.length) {
      if (files.length > 10) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ success: false, message: "Images must be 1 to 10 files." });
      }
      payload.images = files.map((f) => f.filename);
    }

    // Never allow client to mutate createdBy directly
    if ("createdBy" in payload) delete payload.createdBy;

    const result = await productService.updateChosenProduct(id, payload);
    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, patchProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.deleteProduct = async (req: Request, res: Response) => {
  try {
    console.log("deleteProduct");
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    console.log("Error, deleteProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
