const joi = require('joi');
const { isPasswordValid, generateJwt } = require('../../common/common.utils');
const { findUserByEmailService } = require('./user.service');

const userValidation = joi.object({
    firstName: joi.string().min(1).required(),
    lastName: joi.string(),
    email: joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: joi.string().min(8).max(30).required(),
});

const userLoginValidation = joi.object({
    email: joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: joi.string().min(8).max(30).required(),
});

const loginUtils = async (body) => {
    const result = await findUserByEmailService(body?.email);
    if (result.success === false) {
        return {
            success: false,
            message: result?.error,
        };
    }

    const passwordValidationResult = await isPasswordValid(body?.password, result?.user?.password);
    if (passwordValidationResult === false) {
        return {
            success: false,
            message: 'Incorrect password',
        };
    }

    const tokenResult = await generateJwt(result?.user);
    if (tokenResult.success === false) {
        return {
            success: false,
            message: 'Internal server error',
        };
    }
    delete result?.user?.password;
    return {
        success: true,
        user: result?.user,
        token: tokenResult?.token,
    };
}

module.exports = {
    userValidation,
    userLoginValidation,
    loginUtils,
};
