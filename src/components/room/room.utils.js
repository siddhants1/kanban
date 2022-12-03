const joi = require('joi');
const { findRoomByNameService } = require('./room.service');

const roomCreateSchema = joi.object({
    roomName: joi.string().min(1).required()
});

const roomCreateValidations = async (data) => {
    const result = await findRoomByNameService(data?.roomName);
    if (result.success === true) {
        return {
            isValid: false,
            message: 'Room with name already exists'
        };
    }
    return {
        isValid: true
    };
};

module.exports = {
    roomCreateSchema,
    roomCreateValidations
};
