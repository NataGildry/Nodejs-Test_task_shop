const { Router } = require('express');

const productsRouter = Router();

const { productsController } = require('../../controllers');

productsRouter.get('/', productsController.getAllProducts);
productsRouter.post('/add', productsController.createProduct);
productsRouter.get('/:id', productsController.getProduct);
productsRouter.delete('/:id', productsController.deleteProduct);
productsRouter.post('/update/:id', productsController.updateProduct);

module.exports = productsRouter;
