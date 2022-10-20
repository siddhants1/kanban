const { authenticationMiddleware } = require('../../common/common.middleware');
const { userSignUpController, userLoginController, userLogoutController } = require('./user.controller');

const userRouter = require('express').Router();

userRouter.post('/sign-up', userSignUpController);

userRouter.post('/login', userLoginController);

userRouter.post('/logout', authenticationMiddleware, userLogoutController);

module.exports = {
    userRouter,
};
