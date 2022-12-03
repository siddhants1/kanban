const { db } = require('../../common/common.models');

const createRoomService = async (data) => {
    const txn = await db.sequelize.transaction();
    try {
        const room = await db.Room.create(data);
        await txn.commit();
        return {
            success: true,
            room: room?.dataValues
        };
    } catch (err) {
        await txn.rollback();
        return {
            success: false,
            message: err?.errors?.[0]?.message
        };
    }
}

const findRoomByNameService = async (name) => {
    try {
        const room = await db.Room.findOne({ where: { roomName: name } });
        if (room) {
            return {
                success: true,
                room: room?.dataValues
            };
        }
        return {
            success: false,
            message: 'Incorrect room name'
        };
    } catch (err) {
        return {
            success: false,
            message: err?.errors?.[0]?.message
        };
    }
}

module.exports = {
    createRoomService,
    findRoomByNameService
};
