const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require("../config");
const ProductServices = require("../services/shopping-service");
const { SubscribeMessage, PublishMessage } = require("../utils");
const userAuth = require("./middleware/auth");

module.exports = (app, channel) => {
  const service = new ProductServices();

  SubscribeMessage(channel, service, SHOPPING_BINDING_KEY);

  //cart
  app.get("/cart", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.GetCart(_id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/cart", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { productId, qty } = req.body;
      const data = await service.AddToCart(_id, productId, qty);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  //order
  app.post("/order", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { txnNumber } = req.body;
      const data = await service.CreateOrder({ _id, txnNumber });
      console.log("order data", data);
      const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");
      console.log("payload", payload);
      PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/orders", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  //wishlist
  app.get("/wishlist", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/wishlist", userAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { productId } = req.body;
      const data = await service.AddToWishList(_id, productId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/whoami", (req, res) => {
    return res.status(200).json({
      msg: "/shopping: I am product",
    });
  });
};
