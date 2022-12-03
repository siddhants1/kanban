const { errorFunction } = require('../../common/common.utils');
const { createRoomService } = require('./room.service');
const { roomCreateSchema, roomCreateValidations } = require('./room.utils');

const roomCreateController = async (req, res) => {
    const body = {
        roomName: req?.body?.roomName,
    };
    const { error } = roomCreateSchema.validate(body);
    if (error) {
        return res.status(400).json(errorFunction(true, error?.message));
    }

    const validationResult = await roomCreateValidations(body);
    if (validationResult.isValid === false) {
        return res.status(400).json(errorFunction(true, 'Email already exists'));
    }
    const createResult = await createRoomService(body);
    if (createResult.success === false) {
        return res.status(400).json(errorFunction(true, createResult?.message));
    }
    return res.status(200).json(errorFunction(true, 'Success', createResult?.room));
}

module.exports = {
    roomCreateController
};