const { authenticationMiddleware } = require('../../common/common.middleware');
const { 
    userSignUpController, 
    userLoginController, 
    userLogoutController, 
    deleteUserController, 
    updateUserController 
} = require('./user.controller');

const userRouter = require('express').Router();

userRouter.post('/sign-up', userSignUpController);

userRouter.post('/sign-in', userLoginController);

userRouter.post('/sign-out', authenticationMiddleware, userLogoutController);

userRouter.delete('/delete/:id', authenticationMiddleware, deleteUserController);

userRouter.patch('/update/:id', authenticationMiddleware, updateUserController),

module.exports = {
    userRouter,
};
