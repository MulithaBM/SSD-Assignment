/* const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiterLog = require('../models/rateLimiterLogModel');

const rate = 3;
const seconds = 5;
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
const seconds = 5;
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
  } catch (error) {
    const { method, headers, query, body } = req;
    const userAgent = headers['user-agent'];
    const responseStatusCode = res.statusCode;

    logRequest(ipAddress, req.originalUrl, method, userAgent, query, body, responseStatusCode);
    res.status(429).json({ error: `Too many requests, please try again in ${seconds} seconds` });
  }
};

async function logRequest(ipAddress, requestUrl, httpMethod, userAgent, queryParams, responseStatusCode) {
  const log = new rateLimiterLog({
    ipAddress,
    requestUrl,
    httpMethod,
    userAgent,
    queryParams,
    responseStatusCode,
  });

  await log.save();
}

module.exports = rateLimiterMiddleware;






















/* const { RateLimiterMemory } = require('rate-limiter-flexible');

const rate = 50;
const seconds = 15 * 60;
const whitelist = ['172.1.1.1']; // '::1' for localhost

const limiter = new RateLimiterMemory({
  points: rate,
  duration: seconds,
  blockDuration: seconds,
});

const rateLimiterMiddleware = (req, res, next) => {
  const ipAddress = req.ip;

  if (whitelist.includes(ipAddress)) {
    return next();
  }

  limiter
    .consume(ipAddress)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ error: `Too many requests, please try again in ${seconds} seconds` });
    });
};

module.exports = rateLimiterMiddleware; */