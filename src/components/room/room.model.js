const { DataTypes } = require('sequelize');

const roomModel = (sequelize) => {
    const Room = sequelize.define('Room', {
        roomName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Room name is required',
                },
                isValid(value) {
                    if (typeof value !== 'string') {
                        throw new Error('Room name must be of type string');
                    }
                    if (!value || value === null || value === undefined) {
                        throw new Error('Room name cannot be empty');
                    }
                }
            },
        },
    });

    return Room;
}

module.exports = {
    roomModel,
};
