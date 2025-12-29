const { ShoppingRepository } = require("../database");
const { RPCRequest } = require("../utils");

class ShoppingServices {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async AddToCart(customerId, productId, qty, remove = false) {
    const productResponse = await RPCRequest("PRODUCT_RPC", {
      type: "VIEW_PRODUCT",
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
    return this.repository.GetCartByCustomerId(customerId);
  }

  async CreateOrder(orderInput) {
    return this.repository.CreateOrder(orderInput);
  }

  async GetOrders(customerId) {
    return this.repository.GetOrdersByCustomerId(customerId);
  }

  async GetWishList(customerId) {
    const wishList = this.repository.GetWishList(customerId);
    if (!wishList) {
      return {};
    }
    const { products } = wishList;
    if (Array.isArray(products)) {
      const ids = products.map(({ _id }) => _id);
      const productResponse = await RPCRequest("PRODUCT_RPC", {
        type: "VIEW_PRODUCTS",
        data: ids,
      });
      if (productResponse) {
        return productResponse;
      }
    }
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
