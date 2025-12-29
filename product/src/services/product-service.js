const { ProductRepository } = require("../database");
const { FormData } = require("../utils");
const { ValidationError } = require("../utils/errors/app-errors");

class ProductServices {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInput) {
    const productRes = await this.repository.CreateProduct(productInput);
    // console.log("service " + FormData(productRes));
    return FormData(productRes);
  }

  async RPCHandler(payload) {
    const { event, data } = payload;
    switch (event) {
      case "VIEW_PRODUCT":
        return this.repository.FindById(data);
        break;
      case "VIEW_PRODUCTS":
        return this.repository.GetProducts(data);
      default:
        break;
    }
  }
  
}

module.exports = ProductServices;
