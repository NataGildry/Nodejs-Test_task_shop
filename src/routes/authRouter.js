const {Router} = require('express');

const authRouter = Router();

const {authController} = require('../controllers');

// authRouter.post('/', authController.authUser);

authRouter.post(
    '/login', authController.authUser
);
authRouter.post('/logout', authController.logoutUser);

module.exports = authRouter;
