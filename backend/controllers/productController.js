import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import productModel from '../models/productModel.js';

const cleanupFiles = async (files = []) => {
    await Promise.all(files.filter(Boolean).map(file => fs.unlink(file.path).catch(() => {})));
};

const addProduct = async (req, res) => {
    const uploaded = [];
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;
        const files = Object.values(req.files || {}).flat();
        if (!files.length) return res.status(400).json({ success: false, message: "At least one product image is required" });

        const parsedSizes = JSON.parse(sizes || '[]');
        if (!name?.trim() || !description?.trim() || Number(price) < 0 || !category || !subCategory) {
            await cleanupFiles(files);
            return res.status(400).json({ success: false, message: "Please provide valid product information" });
        }
        if (!parsedSizes.length) {
            await cleanupFiles(files);
            return res.status(400).json({ success: false, message: "Select at least one size" });
        }

        const imageURL = await Promise.all(files.map(async (image) => {
            const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
            uploaded.push(result);
            return result.secure_url;
        }));

        await cleanupFiles(files);

        const product = await productModel.create({
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            stock: Math.max(0, Number(stock || 0)),
            sizes: parsedSizes,
            images: imageURL,
            date: Date.now()
        });

        res.status(201).json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        await cleanupFiles(Object.values(req.files || {}).flat());
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeImgProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const singleProductInfo = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeImgProduct, singleProductInfo };
