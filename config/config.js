module.exports = {
  adapterMqttSport: process.env.ADAPTER_MQTT_PORT,

  mainfluxHost: process.env.MAINFLUX_HOST,

  defaultUserName: process.env.USER_NAME_DEFAULT,
  defaultPassword: process.env.PASSWORD_DEFAULT,
  defaultChannel: process.env.CHANNEL_DEFAULT,

  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};
