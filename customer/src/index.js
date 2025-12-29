const express = require("express");
const { PORT } = require("./config");
const expressApp = require("./express-app");
const { databaseConnection } = require("./database");
const { CreateChannel } = require("./utils");
const errorHandler = require("./utils/errors/error-handler");

const StartServer = async () => {
  const app = express();

  await databaseConnection();
  
  const channel = await CreateChannel()

  app.use((req,res,next)=>{
    console.log("middleware 1");
    next();
  })
  
  await expressApp(app,channel);
  
  app.use((req,res,next)=>{
    console.log("middleware 2");
    // next();
  })
  
  errorHandler(app);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      channel.close();
    });
};

StartServer();
