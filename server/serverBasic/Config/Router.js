const app = require('./app');

const authRouter = require('../Routes/Auth');

const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/auth`,authRouter);