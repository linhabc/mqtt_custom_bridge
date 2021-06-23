const redis = require("redis");
const { promisifyAll } = require("bluebird");
var { redisHost, redisPort } = require("./config/config.js");

// sentinel
// const Redis = require("ioredis");
// const redis = new Redis({
//   sentinels: [
//     { host: "localhost", port: 26379 },
//     { host: "localhost", port: 26380 },
//   ],
//   name: "myMaster",
// });

// redis.set("foo", "bar");

promisifyAll(redis);

const options = {
  host: redisHost,
  port: redisPort,
};

const redisClient = redis.createClient(options);

const setKeyAndValue = async (key, value) => {
  await redisClient.setAsync(key, JSON.stringify(value));
};

const getValueByKey = async (key) => {
  var res = await redisClient.getAsync(key);
  return JSON.parse(res);
};

module.exports = {
  setKeyAndValue,
  getValueByKey,
};
