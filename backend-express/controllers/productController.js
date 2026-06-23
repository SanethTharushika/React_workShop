import Product from "../models/product.js";

export async function createProduct(req, res) {
    
    if(req.user == null) {
        res.status(401).json({ message: "Unauthorized access..." });
        return;
    }

    if(!req.user.isAdmin) {
        res.status(403).json({ message: "Access denied. Only administrators can create products." });
        return;
    }

    try {
        const existingProduct = await Product.findOne({ productId: req.body.productId });
        if (existingProduct != null) {
            res.status(400).json({ message: "Product with this ID already exists." });
            return;
        }
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product created successfully.", product });
    } catch (error) {
        res.status(500).json({ message: "Error creating product.", error });
    }

}

export async function getAllProducts(req, res) {
    try {
        if(req.user != null && req.user.isAdmin) {

            const products = await Product.find();
            res.json(products);
        }else {
            const products = await Product.find({ isAvailable: true });
            res.json(products);
        }

   
    } catch (error) {
        res.status(500).json({ message: "Error fetching products.", error });
    }   
}

export async function deleteProduct(req, res) {

    if(req.user != null && req.user.isAdmin) {

        try {
            const product = await Product.findOne({ productId: req.params.productId });
            if (product == null) {
                res.status(404).json({ message: "Product not found." });
                return;
            }
            await Product.deleteOne({ productId: req.params.productId });
            res.json({ message: "Product deleted successfully." });
        
        }catch (error) {
            res.status(500).json({ message: "Error deleting product.", error });
        }

    }else {
        res.status(403).json({ message: "Access denied. Only administrators can delete products." });
    }
}

export async function updateProduct(req, res) {

    if(req.user != null && req.user.isAdmin) {

        try {

            if(req.body.productId != null) {
                res.status(400).json({ message: "Product ID cannot be updated." });
                return;
            }

            await Product.updateOne({ productId: req.params.productId }, req.body);

            res.json ({ message: "Product updated successfully." });


        }catch (error) {
            res.status(500).json({ message: "Error updating product.", error });
        }

    }else {
        res.status(403).json({ message: "Access denied. Only administrators can update products." });
    }
}

export async function getProductById(req, res) {

    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (product == null) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        if(product.isAvailable) {
            res.json(product);

        } else {
            res.status(404).json({ message: "Product not found." });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Error fetching product.", error });
    }
}
