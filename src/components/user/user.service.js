const { db } = require('../../common/common.models');

const createUserService = async (data) => {
    const txn = await db.sequelize.transaction();
    try {
        const user = await db.User.create(data, { transaction: txn });
        await txn.commit();

        return {
            success: true,
            user: user?.dataValues,
        };
    }
    catch (err) {
        await txn.rollback();
        return {
            success: false,
            error: err?.errors?.[0]?.message,
        };
    }
}

const findUserByEmailService = async (email) => {
    try {
        const user = await db.User.findOne({ where: { email: email } });
        if (user) {
            return {
                success: true,
                user: user?.dataValues,
            };
        }
        return {
            success: false,
            error: 'Incorrect Email',
        };
    }
    catch(err) {
        return {
            success: false,
            error: err?.errors?.[0]?.message,
        };
    }
}

const deleteUserService = async (id) => {
    const txn = await db.sequelize.transaction();
    try {
        const result = await db.User.update(
            { isDeleted: 1 },
            { where: { id: id } },
            { transaction: txn }
        );
        await txn.commit();
        return {
            success: true,
        };
    }
    catch(err) {
        await txn.rollback();
        return {
            success: false,
            error: err?.errors?.[0]?.message,
        };
    }
}

const updateUserService = async (data, id) => {
    const txn = await db.sequelize.transaction();
    try {
        const result = await db.User.update(
            data,
            { where: { id: id } },
            { transaction: txn }
        );
        await txn.commit();
        return {
            success: true,
        };
    }
    catch(err) {
        await txn.rollback();
        return {
            success: false,
            error: err?.errors?.[0]?.message,
        };
    }
}

module.exports = {
    createUserService,
    findUserByEmailService,
    deleteUserService,
    updateUserService,
};
