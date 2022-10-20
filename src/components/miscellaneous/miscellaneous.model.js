const { DataTypes } = require('sequelize');

const invalidTokensModel = (sequelize) => {
    const InvalidToken = sequelize.define('InvalidToken', {
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Token is required',
                },
                isValid(value) {
                    if (!value) {
                        throw new Error('Token cannot be empty or null');
                    }
                    if (typeof value !== 'string') {
                        throw new Error('token must be of type string');
                    }
                }
            },
        },
    });
    return InvalidToken;
}

module.exports = {
    invalidTokensModel,
};
