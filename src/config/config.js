const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(15)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(7)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(120)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(120)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app'
    ),
    ALLOWED_ORIGINS: Joi.string().description('allowed origins for CORS'),
    ENABLE_AUDIT_LOGGER: Joi.boolean().default(false),
    ENABLE_AUDIT_LOGGER_ROTATION: Joi.boolean().default(false),
    ALLOWED_REQUEST_TYPES_FOR_LOGGING: Joi.string().default(
      'GET,POST,PUT,DELETE'
    ),
    AUDIT_LOG_ROTATION_DAYS: Joi.number().default(365),
    RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
    RATE_LIMIT_TIME: Joi.number().default(60),
    ENABLE_RATE_LIMIT: Joi.boolean().default(false),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  allowedOrigins: envVars.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  auditLogger: {
    enable: envVars.ENABLE_AUDIT_LOGGER,
    allowedRequestTypesForLogging:
      envVars.ALLOWED_REQUEST_TYPES_FOR_LOGGING.split(',').map((o) => o.trim()),
    auditLogRotationDays: envVars.AUDIT_LOG_ROTATION_DAYS,
    enableRotation: envVars.ENABLE_AUDIT_LOGGER_ROTATION,
  },
  rateLimiter: {
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    time: envVars.RATE_LIMIT_TIME,
    enable: envVars.ENABLE_RATE_LIMIT,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
