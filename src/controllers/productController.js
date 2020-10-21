const ProductModel = require('../models/productSchema');

module.exports = {
    getAllProducts: async (req, res) => {
        const products = await ProductModel.find({});
        res.json(products);
    },
    getProduct: async (req, res) => {
        const params = req.params.id;
        const product = await ProductModel.findById(params);
        if(!product) {
            return res.status(404).json('Product not found');
        }

        return res.json(product);
    },
    createProduct: async (req, res) => {
        try {
            const product = req.body;
            const newProduct = new ProductModel({ ...product });
            await newProduct.save(product);
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong. Product has not been created' } + e);
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
            const { body } = req;
            const product = await ProductModel.findByIdAndUpdate(req.params.id,
                body, {
                    new: true,
                    runValidators: true,
                    context: 'query'
                });
            if(!product) {
                return res.status(404).json({ message: `No user with that id of ${req.params.id}` });
            }
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong. Product updating failed' } + e);
        }

return res.status(201).json({ message: 'Product have been updated' });
    }
};
