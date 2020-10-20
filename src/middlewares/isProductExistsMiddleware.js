const ProductModel = require('../models/productSchema');

module.exports = async (req, res, next) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);

    if(!product) {
        return next(res.status(404).json({ message: 'Record not found' }));
    }
    req.product = product;

return next();
};
