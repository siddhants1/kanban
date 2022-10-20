const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('../swagger.json');
const { findTokenInDB } = require('../components/miscellaneous/miscellaneous.service');
require('dotenv').config();

const commonMiddlewares = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(morgan('combined'));
    app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // app.use('public', express.static(path.join(__dirname, '..', '/public')));
    app.disable('x-powered-by');
}

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers?.['authorization'];
    const token = authHeader && authHeader?.split(' ')?.[1];
    if(token === null || token === undefined) {
        return res.status(401).json({ message: 'Unauthorized access: Token is required' });
    }
    
    const invalidCheckResult = await findTokenInDB(token);
    if (invalidCheckResult.success === false) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    commonMiddlewares,
    authenticationMiddleware,
};
