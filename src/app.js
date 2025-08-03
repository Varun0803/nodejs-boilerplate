const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const { status: httpStatus } = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { limiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const cookieParser = require('cookie-parser');
const apiLogger = require('./middlewares/auditLogger');
const { genericMessage } = require('./config/httpMessages');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/v1/docs', express.static('src/docs/schemas'));
app.set('trust proxy', true);

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Sanitize request data
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

const corsOptions = {
  origin: config.allowedOrigins,
  credentials: true,
};
// Enable CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

if (config.auditLogger.enable) {
  app.use((req, res, next) =>
    apiLogger(config.auditLogger.allowedRequestTypesForLogging, req, res, next)
  );
}

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to endpoints in production
if (config.env === 'production' && config.rateLimiter.enable) {
  app.use((req, res, next) => {
    limiter(req, res, next);
  });
}

// V1 API routes
app.use('/v1', routes);

// Send back a 404 error for any unknown API request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, genericMessage.NOT_FOUND));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
