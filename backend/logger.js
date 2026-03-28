const { createLogger, format, transports } = require('winston');

const { combine, errors, printf, timestamp } = format;

const logFormat = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

  if (stack) {
    return `${time} ${level}: ${message}${extra}\n${stack}`;
  }

  return `${time} ${level}: ${message}${extra}`;
});

module.exports = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new transports.Console()],
});
