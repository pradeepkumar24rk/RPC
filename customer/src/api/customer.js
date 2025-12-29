const { CUSTOMER_BINDING_KEY } = require("../config");
const CustomerServices = require("../services/customer-service");
const { SubscribeMessage } = require("../utils");
const userAuth = require("./middleware/auth");
module.exports = (app, channel) => {
  const service = new CustomerServices();

 // SubscribeMessage(channel, service, CUSTOMER_BINDING_KEY);

  app.post("/signup", async (req, res) => {
    try {
      const { email, password, phone } = req.body;
      const data = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/login", async (req, res, next) => {
  console.log("login route");
    try {
      const { email, password } = req.body;
      const data = await service.Login({ email, password });
      next();
      console.log("after next()");
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
   
  app.get("/profile", userAuth, async (req, res,next) => {
    try {
      const { _id } = req.user;
      const data = await service.GetCustomerById(_id);
      return res.status(200).json(data); 
    } catch (error) {
      next(error);
    }
  })
  
  app.delete("/profile", userAuth, async (req, res,next) => {
    try {
      const { _id } = req.user;
      const data = await service.deleteCustomerById(_id);
      return res.status(200).json(data); 
    } catch (error) {
      next(error);
    }
  })
  
  
  app.get("/whoami", (req, res) => {
    return res.status(200).json({
      msg: "/customer: I am customer",
    });
  });
};
