import { Router } from "express";
import Validate from "../middleware/validate.js";
import AuthMiddleware from "../middleware/authmiddleware.js";
import imagemulter from "../middleware/multer.middleware.js";
import { addProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllar/product.controllar.js";
import { productSchema } from "../schema/product.zod.js";

const Productroute=Router()

// Configure multer for image uploads
const upload = imagemulter(5, ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);
const uploadProductImages = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "image", maxCount: 1 }
]);

Productroute.post("/addproduct", uploadProductImages, AuthMiddleware, Validate(productSchema), addProduct)
Productroute.get("/products", getProducts)
Productroute.get("/product/:id", getProduct)
Productroute.put("/product/:id", uploadProductImages, AuthMiddleware, updateProduct)
Productroute.delete("/product/:id", AuthMiddleware, deleteProduct)

export default Productroute
