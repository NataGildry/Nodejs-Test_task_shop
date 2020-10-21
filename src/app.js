const express = require('express');
const http = require('http');

const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const { config } = require('./config');

const serverRequestLimit = rateLimit({
    windowMs: config.serverRateLimits.period,
    max: config.serverRateLimits.maxRequests
});

const app = express();
const server = http.createServer(app);

global.appRoot = path.resolve(process.cwd(), '../');

app.use(morgan('dev'));
app.use(helmet());
app.use(serverRequestLimit);

const configureCors = (origin, callback) => {
    const whiteList = config.ALLOWED_ORIGIN.split(';');

    if(!origin) { // FOR POSTMAN
        return callback(null, true);
    }

    if(!whiteList.includes(origin)) {
        return callback(new Error('Cors not allowed'), false);
    }

    return callback(null, true);
};
app.use(cors({
    origin: configureCors
}));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(global.appRoot, 'public')));

app.use(morgan('dev'));
app.use(helmet());

const { productsRouter, usersRouter, authRouter } = require('./routes');

const mountRoutes = () => {
    app.use('/auth', authRouter);
    app.use('/products', productsRouter);
    app.use('/users', usersRouter);
};
mountRoutes();

const customErrorHandler = (err, req, res, next) => {
    res
        .status(err.status || 500)
        .json({
            message: err.message || 'Unknown Error',
            code: err.code
        });
    next();
};
app.use(customErrorHandler);

async function start() {
    try {
        await mongoose.connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        mongoose.connection.on('error', console.log.bind(console, 'MONGO ERROR'));
        server.listen(config.PORT, () => {
            console.log(`Listen ${config.PORT}`);
        });
    } catch (e) {
        process.on('SIGTERM', () => {
            server.close(() => {
                process.exit(0);
            });
        });

        process.on('uncaughtException', (error) => {
            console.log(error);
        });

        process.on('unhandledRejection', (error) => {
            console.log(error);
        });
    }
}

start();
