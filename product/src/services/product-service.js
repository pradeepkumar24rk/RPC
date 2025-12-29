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

 
}

module.exports = ProductServices;
