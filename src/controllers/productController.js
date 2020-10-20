const ProductModel = require('../models/productSchema');

module.exports = {
    getAllProducts: async (req, res) => {
        const products = await ProductModel.find({});
        res.json(products);
    },
    getProduct: async (req, res) => {
        const params = req.params.id;
        const product = await ProductModel.findById(params);
        res.json(product);
    },
    createProduct: async (req, res, next) => {
        try {
            const product = req.body;
            const newProduct = new ProductModel({ ...product });
            await newProduct.save(product);
        } catch (e) {
           next(e);
        }
        res.status(201).json({ message: 'Product have been created' });
    },
    deleteProduct: async (req, res) => {
        try {
            const params = req.params.id;
            await ProductModel.findByIdAndDelete(params);
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong.' } + e);
        }
        res.status(201).json({ message: 'Product have been deleted' });
    },
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = req.body;
           await ProductModel.findByIdAndUpdate(
                { _id: id },
                {
                    title: product.title,
                    description: product.description,
                    type: product.type,
                    category: product.category,
                    price: product.price,
                    hasDiscount: product.hasDiscount,
                    oldPrice: product.oldPrice,
                    tags: product.tags,
                    photos: product.photos,
                    docs: product.docs,
                    stockCount: product.stockCount,
                    userId: product.userId
                },
                (err, response) => {
                    if(err) {
                        throw new Error('No updating');
                    } else {
                        console.log(response);
                    }
                }
);
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong. Product updating failed' } + e);
        }
        res.status(201).json({ message: 'Product have been updated' });
    }
};
