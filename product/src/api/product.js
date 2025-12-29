const ProductServices = require("../services/product-service");
const userAuth = require("./middleware/auth");

module.exports = (app, channel) => {
  const service = new ProductServices();

  app.post("/product/create", async (req, res,next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  

  app.get("/whoami", (req, res) => {
    return res.status(200).json({
      msg: "/product: I am product",
    });
  });
};
