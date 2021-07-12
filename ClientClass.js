var mqtt = require("mqtt");
var aedes = require("./aedes.js");
var { brokerHost } = require("./config/config.js");

class Client {
  constructor(clientConfig) {
    this.client;
    this.clientConfig = clientConfig;
  }

  createClient() {
    var self = this;
    var options = {
      clientId: this.clientConfig.clientId,
      reconnectPeriod: 1000,
      clean: true,
      encoding: "utf8",
    };
    this.client = mqtt.connect(brokerHost, options);

    this.client.on("connect", function () {
      self.client.subscribe(self.clientConfig.topic);

      console.log("Client A connected to mainflux");
    });

    this.client.on("disconnect", function (packet) {
      if (packet) {
        console.log("clientDisconnect: ", packet.payload.toString());
      }
    });

    this.client.on("message", function (topic, message, packet) {
      if (topic) {
        console.log("topic on message: ", topic.toString());
      }
      if (message) {
        console.log("message on message: ", message.toString());
      }

      if (packet && topic === self.clientConfig.topic) {
        console.log("Publish message to device: ", packet.payload.toString());
        aedes.publish({
          cmd: "publish",
          qos: 0,
          topic: self.clientConfig.topic,
          payload: packet.payload,
          retain: false,
        });
      }
    });

    this.client.on("packetreceive", function (packet) {
      if (packet) {
        console.log("packetreceive: ", packet);
      }
    });
  }

  publishMessage(packet) {
    this.client.publish(this.clientConfig.channelSending, packet.payload);
  }

  subscribeTopic(topic) {
    this.client.subscribe(topic);
  }

  disconnectClient() {
    this.client.end();
  }
}

module.exports = Client;
