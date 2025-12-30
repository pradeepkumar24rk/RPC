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
  
  async GetProductsByIds(productIds) {
    // console.log(productIds);
    const products = await this.repository.GetProductsByIds(productIds);
    if (!products) {
      throw new ValidationError("Product not found");
    }
    return products;
  }
  
  async GetProducts() {
    const products = await this.repository.GetProducts();
    return products;
  }
  
  async GetProductById(productId) {
    const product =  await this.repository.GetProductById(productId);
    console.log(productId,product);
    
    if (!product) {
      throw new ValidationError("Product not found");
    }
    return product;
  }
  
  async RPCHandler(payload) {
    const { event, data } = payload;
    // console.log(payload);
    
    switch (event) {
      case "VIEW_PRODUCT":
        return this.GetProductById(data);
      case "VIEW_PRODUCTS":
        return this.GetProductsByIds(data);
      default:
        break;
    }
  }
  
}

module.exports = ProductServices;
