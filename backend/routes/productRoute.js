import express from "express";
import { listProduct, addProduct, removeImgProduct, singleProductInfo } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";



const productRouter = express.Router();

// Route to add a new product
productRouter.post(
  "/add",adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);


// Route to list all products
productRouter.get("/list-products", listProduct);

// Route to remove a product
productRouter.post("/remove", adminAuth, removeImgProduct);

// Route to get single product information
productRouter.post("/product-info", singleProductInfo);


export default productRouter;

