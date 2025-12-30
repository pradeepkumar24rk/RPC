const { EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME } = require("../config");
const amqplib = require("amqplib");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
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

// subscribe message from rabbitmq
module.exports.SubscribeMessage = async (channel, service, bindingKey) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);
    channel.consume(appQueue.queue, (data) => {
      console.log("Message received successfully");
      console.log(data.content.toString());
      channel.ack(data);
      service.SubscribeEvents(data.content.toString());
    });
  } catch (err) {
    throw err;
  }
};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  
  try {
    const channel = await getChannel();
    const q = await channel.assertQueue("", { exclusive: true });
    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );
    console.log("send successfully", requestPayload);

    return new Promise((resolve, reject) => {
      const timeOut = setTimeout(() => {
        channel.close();
        resolve("API Request Timed out");
      }, 8000);
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeOut);
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuidv4();
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};
