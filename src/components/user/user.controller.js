const { generatePasswordHash, errorFunction, generateJwt } = require("../../common/common.utils");
const { addInvalidTokenService, userRoomMappingService } = require("../miscellaneous/miscellaneous.service");
const { createUserService, deleteUserService, updateUserService } = require("./user.service");
const { userValidation, userLoginValidation, loginUtils, userUpdateValidation } = require("./user.utils");

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
    const mappingResult = await userRoomMappingService(createResult?.originalUser);

    if (createResult.success === false) {
        return res.status(400).json(errorFunction(true, createResult?.error));
    }

    if (tokenResult.success === false) {
        return res.status(400).json(errorFunction(true, 'Internal server error'));
    }

    if (mappingResult.success === false) {
        return res.status(400).json(errorFunction(true, mappingResult?.message));
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

const deleteUserController = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).json(errorFunction(true, 'id is required'));
    }

    if (Number(id) !== req?.user?.id) {
        return res.status(400).json(errorFunction(true, 'Not authorized to delete the user'));
    }

    const deletionResult = await deleteUserService(id);
    if (deletionResult.success === false) {
        return res.status(400).json(errorFunction(true, deletionResult?.error));
    }
    return res.status(200).json(errorFunction(false, 'Deleted Successfully', {}));
}

const updateUserController = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).json(errorFunction(true, 'id is required'));
    }

    if (Number(id) !== req?.user?.id) {
        return res.status(400).json(errorFunction(true, 'Not authorized to update the user'));
    }

    const body = req?.body;

    if (req?.body?.password) {
        body.password = await generatePasswordHash(req?.body?.password);
    }

    const { error } = userUpdateValidation.validate(body);
    if (error) {
        return res.status(400).json(errorFunction(true, error?.message));   
    }

    const updateResult = await updateUserService(body, id);
    if (updateResult.success === false) {
        return res.status(400).json(errorFunction(true, updateResult?.error));
    }
    return res.status(200).json(errorFunction(false, 'Updated Successfully', {}));
}

module.exports = {
    userSignUpController,
    userLoginController,
    userLogoutController,
    deleteUserController,
    updateUserController,
};
