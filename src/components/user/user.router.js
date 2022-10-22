const { authenticationMiddleware } = require('../../common/common.middleware');
const { userSignUpController, userLoginController, userLogoutController } = require('./user.controller');

const userRouter = require('express').Router();

userRouter.post('/sign-up', userSignUpController);

userRouter.post('/sign-in', userLoginController);

userRouter.post('/sign-out', authenticationMiddleware, userLogoutController);

module.exports = {
    userRouter,
};
