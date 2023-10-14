const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rateLimiterLogSchema = new Schema({
  ipAddress: String,
  requestUrl: String,
  httpMethod: String,
  userAgent: String,
  queryParams: Object,
  responseStatusCode: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RateLimiterLog', rateLimiterLogSchema);