const bluebird = require("bluebird");
const redis = require("redis");
require("dotenv").config();

bluebird.promisifyAll(redis);
const redisClient = redis.createClient(6300);

module.exports = redisClient;
