const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
    try {
        const { thumbnailIndex, name,  description , quantity, sku } = req.body;
    
        // Ensure images were uploaded
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No images uploaded" });
        }
    
        // Get uploaded file URLs
        const imageUrls = req.files.map((file) => `${process.env.UPLOAD_FOLDER}/${file.filename}`);
    
        // Ensure thumbnail index is valid
        const thumbnail = imageUrls[thumbnailIndex];
        if (!thumbnail) {
          return res.status(400).json({ message: "Invalid thumbnail index" });
        }
    
        // Save product in the database
        const newProduct =new Product({
          name : name,
          quantity : quantity,
          sku:sku,
          description : description,
          mainImage:thumbnail, // Single thumbnail URL
          images: imageUrls, // All images including the thumbnail
        });
    
        await newProduct.save();
    
        res.status(201).json({ message: "Product created successfully", product: newProduct });
      } catch (error) {
        console.error("Error creating product:", error);
        next(error);
      }
};



exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        const removedUnwantedFields = products.map((product) => {
          const { __v, ...rest } = product._doc;
          return rest;
        });
        res.status(200).json({products: removedUnwantedFields});
      } catch (error) {
        console.error("Error fetching products:", error);
        next(error);
      }
};


exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById (id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
            }
            const { __v, ...rest } = product._doc;
            res.status(200).json({ product: rest });
    }
    catch (error) {
        console.error("Error fetching product by ID:", error);
        next(error);
    }
}


exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { thumbnailIndex, name, price, description, quantity } = req.body;
    
        const product = await Product.findById(id);
    
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        // Ensure images were uploaded
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: "No images uploaded" });
        }
    
        // Get uploaded file URLs
        const imageUrls = req.files.map((file) => `${process.env.UPLOAD_FOLDER}/${file.filename}`);
    
        // Ensure thumbnail index is valid
        const thumbnail = imageUrls[thumbnailIndex];
        if (!thumbnail) {
          return res.status(400).json({ message: "Invalid thumbnail index" });
        }
    
        // Update product in the database
        product.name = name;
        product.price = price;
        product.quantity = quantity;
        product.description = description;
        product.mainImage = thumbnail;
        product.images = imageUrls;
    
        await product.save();
    
        res.status(200).json({ message: "Product updated successfully", product });
      } catch (error) {
        console.error("Error updating product:", error);
        next(error);
      }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
    
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        await product.delete();
    
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        next(error);
      }
};


exports.searchProducts = async (req, res, next) => {
    try {
        const { query } = req.query;
    
        if (!query) {
          return res.status(400).json({ message: "Search query is required" });
        }
    
        const products = await Product.find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        });
    
        const removedUnwantedFields = products.map((product) => {
          const { __v, ...rest } = product._doc;
          return rest;
        });
    
        res.status(200).json({ products: removedUnwantedFields });
      } catch (error) {
        console.error("Error searching products:", error);
        next(error);
      }
};



