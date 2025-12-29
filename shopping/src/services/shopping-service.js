const { ShoppingRepository } = require("../database");

class ShoppingServices {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async AddToCart(customerId, product, qty, remove = false) {
    return this.repository.AddToCartItem(customerId, product, qty, remove);
  }

  async GetCart(customerId) {
    return this.repository.GetCartByCustomerId(customerId);
  }

  async CreateOrder(orderInput) {
    return this.repository.CreateOrder(orderInput);
  }

  async GetOrders(customerId) {
    return this.repository.GetOrdersByCustomerId(customerId);
  }

  async GetOrderPayload(userId, order, event) {
    let payload = {};
    if (order) {
      payload = {
        event,
        data: { userId, order },
      };
      return payload;
    }
  }
  
  async GetWishList(customerId,productId) {
    return this.repository.GetWishList(customerId,productId);
  }
  
  async AddToWishList(customerId,productId) {
    return this.repository.AddToWishList(customerId,productId);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.AddToCart(userId, product, qty);
        break;
      case "REMOVE_FROM_CART":
        this.AddToCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }
}

module.exports = ShoppingServices;
