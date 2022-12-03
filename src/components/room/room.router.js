const { authenticationMiddleware } = require('../../common/common.middleware');
const { roomCreateController } = require('./room.controller');

const roomRouter = require('express').Router();

roomRouter.post('/create', authenticationMiddleware, roomCreateController);

module.exports = {
    roomRouter
};
