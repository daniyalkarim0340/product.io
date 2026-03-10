import Asynchandler from "../handle/asynhandler.js";
import CustomError from "../handle/customerror.js";
import { Product } from "../model/productmodel.js";
import ApiFeatures from "../utils/Api.features.js";
import { uploadToCloudinary } from "../utils/uploadtocloundiary.js";

//  Add Product 
const addProduct = Asynchandler(async (req, res, next) => {
  const { name, description, price, stock, category } = req.body;
  const images = [];
  const createdBy = req.user?._id;

  if (!createdBy) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Handle uploaded images
  const imageFiles = Array.isArray(req.files)
    ? req.files
    : [...(req.files?.images || []), ...(req.files?.image || [])];

  if (imageFiles.length > 0) {
    for (const file of imageFiles) {
      const result = await uploadToCloudinary({
        resource_type: "image",
        buffer: file.buffer,
        folder: "products"
      });
      images.push({ secureUrl: result.secure_url, publicId: result.public_id });
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images,
    createdBy,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

//  Get All Products 
const getProducts = Asynchandler(async (req, res, next) => {
  // Include all fields needed for frontend
  const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'images'];

  const features = new ApiFeatures(
    Product.find().populate("createdBy", "name email"),
    req.query,
    allowedFields
  )
    .filter()
    .paginate(100);

  // Remove .select() so all fields come through
  const products = await features.query;

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

//  Get Single Product 
const getProduct = Asynchandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("createdBy", "name email");
  if (!product) return next(new CustomError(404, "Product not found"));
  res.status(200).json({ success: true, data: product });
});

//  Update Product 
const updateProduct = Asynchandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new CustomError(404, "Product not found"));

  // Update fields directly
  Object.assign(product, req.body);

  // Handle images
  const imageFiles = Array.isArray(req.files)
    ? req.files
    : [...(req.files?.images || []), ...(req.files?.image || [])];

  if (imageFiles.length > 0) {
    const images = [];
    for (const file of imageFiles) {
      const result = await uploadToCloudinary({
        resource_type: "image",
        buffer: file.buffer,
        folder: "products"
      });
      images.push({ secureUrl: result.secure_url, publicId: result.public_id });
    }
    product.images = images;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

//  Delete Product 
const deleteProduct = Asynchandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new CustomError(404, "Product not found"));

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

export { addProduct, getProducts, getProduct, updateProduct, deleteProduct };