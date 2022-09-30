const http = require('http');
const app = require('express')();
require('dotenv').config();

const { commonMiddlewares } = require('./common/common.middleware');
const { routingMiddleware } = require('./common/common.router');

// ------------ MIDDLEWARES BEGIN -------------------

commonMiddlewares(app);
routingMiddleware(app);

// ------------ MIDDLEWARES END -------------------

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log('Server listening on: %d', process.env.PORT);
});
