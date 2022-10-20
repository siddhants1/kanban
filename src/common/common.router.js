const { healthRouter } = require('../components/health/health.router');
const { userRouter } = require('../components/user/user.router');

const routingMiddleware = (app) => {
    app.use('/health', healthRouter);
    app.use('/user', userRouter);

    // 404 handler
    app.use((req, res, next) => {
        return res.status(404).json({ message: 'Not Found' });
    });
}

module.exports = {
    routingMiddleware,
};
