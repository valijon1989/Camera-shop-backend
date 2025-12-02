import express, { Request, Response, RequestHandler, NextFunction } from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import listingController from "./controllers/listing.controller";
import path from "path";
import { CameraBrands, CameraBrandAssets } from "./data/brands";
import { ExtendedRequest } from "./libs/types/member";
//REACT

/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/user/login", memberController.login);
router.post("/user/signup", memberController.signup);
router.post("/admin/login", memberController.adminLogin);
router.post("/admin/signup", memberController.adminSignup);
// Compatibility routes for SPA expecting /cameras
router.get("/cameras", productController.getProducts);
router.get("/cameras/:id", memberController.retrieveAuth, productController.getProduct);
router.post(
  "/cameras",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  uploader("products").array("images", 10),
  productController.createProduct
);
// Allow creator/admin to update their own camera listing
router.patch(
  "/cameras/:id",
  memberController.verifyAuth,
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const extReq = req as ExtendedRequest;
      const Product = (await import("./schema/Product.model")).default;
      const doc = await Product.findById(req.params.id).select("createdBy").lean();
      if (!doc) return res.status(404).json({ success: false, message: "Not found" });
      if (
        extReq.member?.memberType !== "ADMIN" &&
        String(doc.createdBy) !== String(extReq.member?._id)
      ) {
        return res.status(403).json({ success: false, message: "FORBIDDEN" });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }) as RequestHandler,
  uploader("products").array("images", 10),
  productController.patchProduct
);

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/admin/member/:id/block",
  memberController.verifyAuth,
  memberController.requireAdmin,
  memberController.blockMember
);

router.post(
  "/admin/member/:id/delete",
  memberController.verifyAuth,
  memberController.requireAdmin,
  memberController.deleteMember
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);
router.put(
  "/member/me",
  memberController.verifyAuth,
  memberController.updateMember
);
router.patch(
  "/member/me",
  memberController.verifyAuth,
  memberController.updateMember
);
router.post(
  "/member/upload",
  memberController.verifyAuth,
  uploader("members").single("file"),
  memberController.uploadAvatar
);
router.get("/member/top-users", memberController.getTopUsers);

/** Products (cameras) **/
router.get("/products", productController.getProducts);
router.get(
  "/products/:id",
  memberController.retrieveAuth,
  productController.getProduct
);
router.patch(
  "/products/:id",
  memberController.verifyAuth,
  memberController.requireAdmin,
  productController.patchProduct
);
router.delete(
  "/products/:id",
  memberController.verifyAuth,
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const extReq = req as ExtendedRequest;
      const Product = (await import("./schema/Product.model")).default;
      const doc = await Product.findById(req.params.id).select("createdBy").lean();
      if (!doc) return res.status(404).json({ success: false, message: "Not found" });
      if (
        extReq.member?.memberType !== "ADMIN" &&
        String(doc.createdBy) !== String(extReq.member?._id)
      ) {
        return res.status(403).json({ success: false, message: "FORBIDDEN" });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }) as RequestHandler,
  productController.deleteProduct
);
// Brand list
router.get(
  "/brands",
  ((_req: Request, res: Response) => {
    const rich = _req.query.rich;
    if (rich === "true") return res.json(CameraBrandAssets);
    res.json(CameraBrands);
  }) as express.RequestHandler
);
// Brand-specific listing (slug or name, case-insensitive)
router.get("/products/brand/:brandName", (req, res, next) => {
  const raw = (req.params.brandName || "").trim().toLowerCase();
  const match = CameraBrandAssets.find(
    (b) => b.slug.toLowerCase() === raw || b.name.toLowerCase() === raw
  );
  req.query.brand = match ? match.name : req.params.brandName;
  return productController.getProducts(req, res, next as any);
});
router.post(
  "/products",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  uploader("products").array("images", 10),
  productController.createProduct
);
// Mark sold out (owner or admin)
router.patch(
  "/products/:id/soldout",
  memberController.verifyAuth,
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const extReq = req as ExtendedRequest;
      const Product = (await import("./schema/Product.model")).default;
      const doc = await Product.findById(req.params.id).select("createdBy").lean();
      if (!doc) return res.status(404).json({ success: false, message: "Not found" });
      if (
        extReq.member?.memberType !== "ADMIN" &&
        String(doc.createdBy) !== String(extReq.member?._id)
      ) {
        return res.status(403).json({ success: false, message: "FORBIDDEN" });
      }
      req.body = { ...req.body, soldOut: true };
      return next();
    } catch (err) {
      return next(err);
    }
  }) as RequestHandler,
  productController.patchProduct
);
router.get(
  "/agent/add-product",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  (req, res) => {
    res.render("add-product");
  }
);
router.patch(
  "/api/products/:id",
  memberController.verifyAuth,
  memberController.requireAdmin,
  uploader("products").array("images", 10),
  productController.patchProduct
);
router.delete(
  "/api/products/:id",
  memberController.verifyAuth,
  memberController.requireAdmin,
  productController.deleteProduct
);
router.get(
  "/api/products/:id",
  memberController.retrieveAuth,
  productController.getProduct
);
router.get("/api/products", productController.getProducts);
router.post(
  "/api/products",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  uploader("products").array("images", 10),
  productController.createProduct
);

/** Order **/
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);

router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);


/** Gear listings (agent cameras) **/
router.post(
  "/gear",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  listingController.createListing
);

router.get("/gear", listingController.getListings);

router.get(
  "/gear/mine",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  listingController.getMyListings
);

router.get("/gear/:id", listingController.getListingDetail);

router.post(
  "/gear/delete/:id",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  listingController.deleteListing
);

// Agent UI page for creating listings
router.get(
  "/agent/new-gear",
  memberController.verifyAuth,
  memberController.requireAgentOrAdmin,
  (req, res) => {
    res.render("new-listing");
  }
);

export default router;
