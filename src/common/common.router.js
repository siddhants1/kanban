const { healthRouter } = require('../health/health.router');

const routingMiddleware = (app) => {
    app.use('/health', healthRouter);


    // 404 handler
    app.use((req, res, next) => {
        return res.status(404).json({ message: 'Not Found' });
    });
}

module.exports = {
    routingMiddleware,
};
