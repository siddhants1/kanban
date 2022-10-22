const { DataTypes } = require('sequelize');

const userModel = (sequelize) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required',
                },
                isValid(value) {
                    if (typeof value !== 'string') {
                        throw new Error('Name must be of type string');
                    }
                    if (!value || value === null || value === undefined) {
                        throw new Error('Name cannot be empty');
                    }
                }
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isValid(value) {
                    if (typeof value !== 'string') {
                        throw new Error('lastName must be a string');
                    }
                }
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Email cannot be null',
                },
                isEmail: {
                    msg: 'A valid email is required',
                },
                async isUnique(value) {
                    const user = await sequelize.models.User.findOne({ where: { email: value } });
                    if (user !== null) {
                        throw new Error('Email already exists');
                    }
                }
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password cannot be null',
                },
                isValid(value) {
                    if (typeof value !== 'string') {
                        throw new Error('Password must be a string');
                    }
                    if (value === null || value === undefined || value?.trim() === '') {
                        throw new Error('Password cannot be empty or null');
                    }
                },
            },
        },
        isDeleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            // validate: {
            //     isValid(value) {
            //         if (typeof value !== 'number') {
            //             throw new Error('isDeleted must be a number');
            //         }
            //         if (value !== 0 || value !== 1) {
            //             throw new Error('isDeleted cannot be other than 0 or 1');
            //         }
            //     }
            // }
        },
    });

    return User;
}

module.exports = {
    userModel,
};
