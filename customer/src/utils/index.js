const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { APP_SECRET, QUEUE_NAME, EXCHANGE_NAME, MESSAGE_BROKER_URL } = require("../config");
const amqplib = require("amqplib");

module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  savedPassword,
  enteredPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateToken = (payload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "90d" });
};

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

// create channel for rabbitmq
module.exports.CreateChannel = async () => {
  try { 
  const connection = await amqplib.connect(MESSAGE_BROKER_URL);
  const channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, "direct", false); // it's kind of distributed our message between different queues depends on certain configuration.
  return channel;
  } catch (err) {
    throw err;
  }
}

// publish message to rabbitmq
module.exports.PublishMessage = async (channel, bindingKey, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message));
    console.log("Message published successfully",message);
  } catch (err) {
    throw err;
  }
};

