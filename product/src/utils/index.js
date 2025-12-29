const { EXCHANGE_NAME, MESSAGE_BROKER_URL } = require("../config");
const amqplib = require("amqplib");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../config");

module.exports.ValidateToken = async (req) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    if (payload) {
      req.user = payload;
      return true;
    }
  }
  return false;
};

module.exports.FormData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// module.exports.PublishCustomerEvent = (payload)=>{
//   axios.post('http://localhost:8001/app-events',{
//     payload
//   })
// }

let amqplibConnection = null;
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
  }
  return await amqplibConnection.createChannel();
};

// create channel for rabbitmq
module.exports.CreateChannel = async (connection) => {
  try {
    const channel = await getChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false); // it's kind of distributed our message between different queues depends on certain configuration.
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.RPCObserver = async (RPC_QUEUE_NAME, service) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg) => {
      if (msg.content) {
        const payload = JSON.parse(msg.content.toString());
        const response = await service.RPCHandler(payload);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
};
