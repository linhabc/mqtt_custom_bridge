require("dotenv").config();
var aedes = require("./aedes.js");
var server = require("net").createServer(aedes.handle);
var Client = require("./ClientClass.js");

var { adapterMqttSport } = require("./config/config.js");

var {
  defaultUserName,
  defaultPassword,
  defaultChannel,
} = require("./config/config.js");

let clientSet = {};

aedes.on("client", (client) => {
  console.log("Client: " + client.id + " connected to mqtt_node");
});

// client publish message to adapter
aedes.on("publish", function (packet, client) {
  if (client) {
    console.log("message from client: ", client.id);
    console.log(packet.payload.toString());

    // forward to Mainflux
    clientSet[client.id].publishMessage(packet);
  }
});

aedes.on("subscribe", async function (subscriptions, client) {
  if (client) {
    clientConfigRes = {
      clientId: client.id,
      topic: subscriptions[0].topic,
    };

    if (!clientSet.hasOwnProperty(client.id)) {
      let newClient = new Client(clientConfigRes);
      newClient.createClient();
      clientSet[client.id] = newClient;
    }

    clientSet[client.id].clientConfig.topic = subscriptions[0].topic;
    // adding client topic to the end of
    clientSet[client.id].clientConfig.channelSending =
      subscriptions[0].topic + "/client";

    clientSet[client.id].subscribeTopic(subscriptions[0].topic);

    console.log(clientSet[client.id].clientConfig);
    console.log("subscribe from client: ", subscriptions, client.id);
  }
});

aedes.on("clientDisconnect", function (client) {
  if (client) {
    console.log("clientDisconnect: ", client.id);
    if (clientSet.hasOwnProperty(client.id)) {
      clientSet[client.id].disconnectClient();
      delete clientSet[client.id];
    }
  }
});

aedes.on("clientError", function (client, err) {
  console.log("client error: ", client.id, err.message, err.stack);
});

server.listen(adapterMqttSport, function () {
  console.log("server listening on port", adapterMqttSport);
});
