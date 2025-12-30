const { ProductModel } = require("../models");

class ProductRepository {
  
  async CreateProduct({ name, desc, type, unit,price, available, suplier, banner }) {
    
    const product = new ProductModel({ name, desc, type, unit,price, available, suplier, banner })
    
    const productRes = await product.save();
    // console.log("Repository "+productRes);

    return productRes
  }
  
  async GetProductById(productId) {
    const productRes = await ProductModel.findById(productId)
    return productRes
  }
  
  async GetProductsByIds(productIds) {
    const products = await ProductModel.find().where("_id").in(productIds).exec();
    return products;
  }
  
  async GetProducts() {
    const products = await ProductModel.find();
    return products;
  }
  
}

module.exports =  ProductRepository ;
