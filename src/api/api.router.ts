import { Router } from "express";
import authApi from "./auth.api";
import productApi from "./product.api";
import userApi from "./user.api";
import helpApi from "./help.api";

const apiRouter = Router();

apiRouter.use("/auth", authApi);
apiRouter.use("/products", productApi);
apiRouter.use("/cameras", productApi); // alias for SPA calls
apiRouter.use("/users", userApi);
apiRouter.use("/help", helpApi);

export default apiRouter;
