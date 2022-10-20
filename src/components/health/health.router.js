const healthRouter = require('express').Router();

healthRouter.get('/ping', async (req, res) => {
    return res.status(200).json({ message: 'Success' });
});

module.exports = {
    healthRouter,
};
