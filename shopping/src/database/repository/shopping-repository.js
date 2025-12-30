const { CartModel, OrderModel, WishListModel } = require("../models");

class ShoppingRepository {
  async AddToCartItem(customerId, item, qty, isRemove) {
    const cart = await CartModel.findOne({ customerId });
    if (cart) {
      const cartItem = {
        product: item,
        unit: qty,
      };

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        let isExist = false;
        cartItems.map((item) => {
          if (item.product._id.toString() === item._id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = qty;
            }
            isExist = true;
          }
        });

        if (!isExist) {
          cartItems.push(cartItem);
        }
      } else {
        cartItems.push(cartItem);
      }

      cart.items = cartItems;

      return await cart.save();
    } else {
      return await CartModel.create({
        customerId,
        items: [
          {
            product: item,
            unit: qty,
          },
        ],
      });
    }
  }

  async GetCartByCustomerId(customerId) {
    return await CartModel.findOne({ customerId });
  }

  async CreateOrder(orderInput) {
    const cart = await CartModel.findOne({ customerId: orderInput._id });
    if (!cart) {
      throw new Error("Cart not found for the customer");
    }
    let amount = 0;
    let cartItems = cart.items;
    if (cartItems.length === 0) {
      throw new Error("No items in the cart to place an order");
    }
    cartItems.forEach((item) => {
      amount += item.product.price * item.unit;
    });
    const orderId = `ORDER-${Date.now()}`;
    const order = await OrderModel.create({
      orderId,
      customerId: orderInput.customerId,
      amount,
      status: "received",
      items: cartItems,
    });
    cart.items = [];
    await cart.save();
    return order;
  }

  async GetOrdersByCustomerId(customerId) {
    return await OrderModel.findOne({ customerId });
  }

  async GetWishList(customerId) {
    const wishList = await WishListModel.findOne({ customerId }).populate(
      "products"
    );
    return wishList;
  }

  async AddToWishList(customerId, productId) {
    const product = {
      _id: productId,
    };

    const profile = await WishListModel.findOne({ customerId });

    if (profile) {
      let wishlist = profile.products;

      if (wishlist.length > 0) {
        let isExist = false;
        wishlist.map((item) => {
          if (item._id.toString() === product._id.toString()) {
            const index = wishlist.indexOf(item);
            wishlist.splice(index, 1);
            isExist = true;
          }
        });
        if (!isExist) {
          wishlist.push(product);
        }
      } else {
        wishlist.push(product);
      }
      profile.wishlist = wishlist;
      return await profile.save();
    } else {
      return await WishListModel.create({
        customerId,
        products: [product],
      });
    }
  }

  async DeleteCartByCustomerId(customerId) {
    await CartModel.findOneAndDelete({ customerId });
    await OrderModel.deleteMany({ customerId });
    await WishListModel.findOneAndDelete({ customerId });
    return { message: "Cart,order and Wishlist deleted successfully" };
  }
}

module.exports = ShoppingRepository;
