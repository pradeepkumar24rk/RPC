const { ProductModel } = require("../models");

class ProductRepository {
  
  async CreateProduct({ name, desc, type, unit,price, available, suplier, banner }) {
    
    const product = new ProductModel({ name, desc, type, unit,price, available, suplier, banner })
    
    const productRes = await product.save();
    // console.log("Repository "+productRes);

    return productRes
  }
  
  async FindById(productId) {
    const productRes = await ProductModel.findById(productId)
    return productRes
  }
  
}

module.exports =  ProductRepository ;
