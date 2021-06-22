const redis = require("redis");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

const options = {
  host: "127.0.0.1",
  port: "6379",
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
