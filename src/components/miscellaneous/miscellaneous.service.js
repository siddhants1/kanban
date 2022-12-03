const { db } = require('../../common/common.models');
const { findRoomByNameService } = require('../room/room.service');

const addInvalidTokenService = async (token) => {
    const txn = await db.sequelize.transaction();
    try {
        const result = await db.InvalidToken.create({ token: token }, { transaction: txn });
        await txn.commit();
        return {
            success: true,
        };
    }
    catch (err) {
        await txn.rollback();
        return {
            success: false,
            message: err?.errors?.[0]?.message,
        };
    }
}

const findTokenInDB = async (token) => {
    try {
        const result = await db.InvalidToken.findOne({ where: { token: token } });
        if (result) {
            return {
                success: false,
                message: 'Invalid token',
            };
        }
        return {
            success: true,
        };
    }
    catch (err) {
        return {
            success: false,
            message: 'Internal server error'
        };
    }
}

const userRoomMappingService = async (user) => {
    const room = (await findRoomByNameService('General'))?.room;
    const txn = await db.sequelize.transaction();
    try {
        await user?.addRoom(room?.id);
        await txn.commit();
        return {
            success: true,
        };
    } catch(err) {
        await txn.rollback();
        return {
            success: false,
            message: 'Error'
        };
    }
}

module.exports = {
    findTokenInDB,
    addInvalidTokenService,
    userRoomMappingService
};
