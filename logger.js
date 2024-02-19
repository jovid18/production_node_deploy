const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  //로그의 심각도
  level: 'info',
  //로그의 형식
  format: format.json(),
  //로그의 저장 방식
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;
