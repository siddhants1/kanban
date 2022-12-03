const { Sequelize } = require('sequelize');
const { invalidTokensModel } = require('../components/miscellaneous/miscellaneous.model');
const { roomModel } = require('../components/room/room.model');
require('dotenv').config();

const { userModel } = require('../components/user/user.model');

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
    },
);

const authenticateDbConnection = async (sequelize) => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize: connection has been established successfully');
    }
    catch(err) {}
}

authenticateDbConnection(sequelize);

const db = {};
db.sequelize = sequelize;

const User = userModel(sequelize);
const InvalidToken = invalidTokensModel(sequelize);
const Room = roomModel(sequelize);

db.User = User;
db.InvalidToken = InvalidToken;
db.Room = Room;

// ASSOCIATIONS
db.User.belongsToMany(db.Room, { through: 'User_Rooms' });
db.Room.belongsToMany(db.User, { through: 'User_Rooms' });

sequelize.sync();

module.exports = {
    db,
};
