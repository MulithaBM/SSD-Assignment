/* const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiterLog = require('../models/rateLimiterLogModel');

const rate = 3;
const seconds = 20;
const whitelist = ['172.1.1.1']; // '::1' for localhost

const limiter = new RateLimiterMemory({
  points: rate,
  duration: seconds,
  blockDuration: seconds,
});

const rateLimiterMiddleware = async (req, res, next) => {

  console.log(ipAddress);

  if (whitelist.includes(ipAddress)) {
    return next();
  }

  try {
    await limiter.consume(ipAddress);
    next();
  } catch (error) {
    logRequest(ipAddress, req.originalUrl);
    res.status(429).json({ error: `Too many requests, please try again in ${seconds} seconds` });
  }
};

async function logRequest(ipAddress, requestUrl) {
  const log = new rateLimiterLog({
    ipAddress,
    requestUrl,
  });

  await log.save();
}

module.exports = rateLimiterMiddleware; */

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiterLog = require('../models/rateLimiterLogModel');

const rate = 3;
const seconds = 20;
const whitelist = ['172.1.1.1']; // '::1' for localhost

const limiter = new RateLimiterMemory({
  points: rate,
  duration: seconds,
  blockDuration: seconds,
});

const rateLimiterMiddleware = async (req, res, next) => {
  const ipAddress = req.ip;

  if (whitelist.includes(ipAddress)) {
    return next();
  }

  try {
    await limiter.consume(ipAddress);
    next();
  } catch (rateLimiterRes) {
    const remainingSeconds = Math.ceil(rateLimiterRes.msBeforeNext / 1000);

    const { method, headers, query, body } = req;
    const userAgent = headers['user-agent'];
    const responseStatusCode = 429;

    const timestamp = Date.now();
    const date = new Date(timestamp);

    const timeZoneOffset = 330;

    const localTimeIST = new Date(date.getTime() + timeZoneOffset * 60000);

    logRequest(ipAddress, req.originalUrl, method, userAgent, query, responseStatusCode, localTimeIST);

    res.status(429).json({
      error: `Too many requests, please try again in ${remainingSeconds} seconds`,
    });
  }
};

async function logRequest(ipAddress, requestUrl, method, userAgent, query, responseStatusCode, timestamp) {
  const log = new rateLimiterLog({
    ipAddress,
    requestUrl,
    method,
    userAgent,
    query,
    responseStatusCode,
    timestamp,
  });

  await log.save();
}

module.exports = rateLimiterMiddleware;
