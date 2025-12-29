const { CustomerModel } = require("../models");

class CustomerRepository {
  async CreateCustomer({ email, phone, password, salt }) {
    const customer = new CustomerModel({
      email,
      phone,
      password,
      salt,
    });
    const customerRes = await customer.save();
    return customerRes;
  }

  async FindCustomer({ email }) {
    return CustomerModel.findOne({ email });
  }
  
  async FindCustomerById(customerId) {
    return CustomerModel.findById(customerId);
  }
  
  async deleteCustomerById(customerId) {
    return CustomerModel.findByIdAndDelete(customerId);
  }

}

module.exports = CustomerRepository;
