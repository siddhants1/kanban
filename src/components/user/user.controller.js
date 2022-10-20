const { generatePasswordHash, errorFunction, generateJwt } = require("../../common/common.utils");
const { addInvalidTokenService } = require("../miscellaneous/miscellaneous.service");
const { createUserService } = require("./user.service");
const { userValidation, userLoginValidation, loginUtils } = require("./user.utils");

const userSignUpController = async (req, res) => {
    const body = {
        firstName: req.body?.firstName,
        lastName: req.body?.lastName,
        email: req.body?.email,
        password: req.body?.password,
    };

    const { error } = userValidation.validate(body);
    if (error) {
        return res.status(400).json(errorFunction(true, error?.message));
    }
    
    body.password = await generatePasswordHash(body.password);
    const createResult = await createUserService(body);
    const tokenResult = await generateJwt(createResult?.user);

    if (createResult.success === false) {
        return res.status(400).json(errorFunction(true, createResult?.error));
    }

    if (tokenResult.success === false) {
        return res.status(400).json(errorFunction(true, 'Internal server error'));
    }

    const response = { token: tokenResult?.token, user: createResult?.user };
    return res.status(200).json(errorFunction(false, 'Success', response));
}

const userLoginController = async (req, res) => {
    const body = {
        email: req.body?.email,
        password: req.body?.password,
    };

    const { error } = userLoginValidation.validate(body);
    if (error) {
        return res.status(400).json(errorFunction(true, error?.message));   
    }

    const loginResult = await loginUtils(body);
    if (loginResult.success === false) {
        return res.status(400).json(errorFunction(true, loginResult?.message));
    }
    const response = {
        user: loginResult?.user,
        token: loginResult?.token,
    };

    return res.status(200).json(errorFunction(false, 'Success', response));
}

const userLogoutController = async (req, res) => {
    const authHeader = req.headers?.['authorization'];
    const token = authHeader && authHeader?.split(' ')?.[1];

    const invalidatingResult = await addInvalidTokenService(token);
    if (invalidatingResult.success === false) {
        return res.status(400).json(errorFunction(true, invalidatingResult?.message));
    }
    return res.status(200).json(errorFunction(false, 'Logged out successfully', {}));
}

module.exports = {
    userSignUpController,
    userLoginController,
    userLogoutController,
};
