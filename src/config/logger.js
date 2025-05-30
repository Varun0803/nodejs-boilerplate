const winston = require('winston');
const config = require('./config');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { mode: 0o777 }); // Full access to directory (optional)
}

// Function to ensure log files exist with correct permissions
const ensureFilePermissions = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', { mode: 0o666 }); // Create file with 666 permissions
  } else {
    fs.chmodSync(filePath, 0o666); // Ensure existing file has 666 permissions
  }
};

// Define log file paths
const appLogPath = path.join(logDirectory, 'app.log');
const errorLogPath = path.join(logDirectory, 'error.log');

// Ensure log files exist and have correct permissions
ensureFilePermissions(appLogPath);
ensureFilePermissions(errorLogPath);

// Create Winston logger
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({ stderrLevels: ['error'] }),
    new winston.transports.File({ filename: appLogPath, level: 'info' }),
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
  ],
});

module.exports = logger;
