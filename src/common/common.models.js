const { Sequelize } = require('sequelize');
const { invalidTokensModel } = require('../components/miscellaneous/miscellaneous.model');
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

db.User = User;
db.InvalidToken = InvalidToken;

sequelize.sync();

module.exports = {
    db,
};
