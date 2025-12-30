const { ShoppingRepository } = require("../database");
const { RPCRequest } = require("../utils");
const { NotFoundError } = require("../utils/errors/app-errors");

class ShoppingServices {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async AddToCart(customerId, productId, qty, remove = false) {
    const productResponse = await RPCRequest("PRODUCT_RPC", {
      event: "VIEW_PRODUCT",
      data: productId,
    });
    if (productResponse && productResponse._id) {
      const data = await this.repository.AddToCartItem(
        customerId,
        productResponse,
        qty,
        remove
      );
      return data;
    }
    throw new Error("Product not found");
  }

  async GetCart(customerId) {
    const data = await this.repository.GetCartByCustomerId(customerId);
    if (!data) {
      throw new NotFoundError("Cart not found");
    }
    return data;
  }

  async CreateOrder(orderInput) {
    return this.repository.CreateOrder(orderInput);
  }

  async GetOrders(customerId) {
    const data = await this.repository.GetOrdersByCustomerId(customerId);
    if (!data) {
      throw new NotFoundError("Orders not found");
    }
    return data;
  }

  async GetWishList(customerId) {
    const wishList = await this.repository.GetWishList(customerId);
    // console.log(wishList);
    
    if (!wishList) {
      throw new NotFoundError("WishList not found");
    }
    const { products } = wishList;
    
    
    if (Array.isArray(products)) {
      const ids = products.map(({ _id }) => _id);
      const productResponse = await RPCRequest("PRODUCT_RPC", {
        event: "VIEW_PRODUCTS",
        data: ids,
      });
      
      if (productResponse) {
        return productResponse;
      }
    }
    return {};
  }

  async AddToWishList(customerId, productId) {
    return this.repository.AddToWishList(customerId, productId);
  }

  async DeleteCustomerData(customerId) {
    return this.repository.DeleteCartByCustomerId(customerId);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId } = data;

    switch (event) {
      case "CUSTOMER_DELETED":
        this.DeleteCustomerData(userId);
        break;
      default:
        break;
    }
  }
}

module.exports = ShoppingServices;
