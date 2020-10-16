const {Router} = require('express');
const usersRouter = Router();

const {userController} = require('../controllers');


usersRouter.get('/', userController. getAllUsers);
usersRouter.post('/add', userController.createUser);

module.exports = usersRouter;
