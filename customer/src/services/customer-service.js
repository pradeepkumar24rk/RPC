const { CustomerRepository } = require("../database");
const {
  GenerateSalt,
  GeneratePassword,
  FormData,
  ValidatePassword,
  GenerateToken,
} = require("../utils");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors/app-errors");

class CustomerServices {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignUp(userInputs) {
    const { email, password, phone } = userInputs;
    let salt = await GenerateSalt();
    let userPassword = await GeneratePassword(password, salt);
    const existingCustomer = await this.repository.CreateCustomer({
      email,
      password: userPassword,
      phone,
      salt,
    });
    return { id: existingCustomer };
  }

  async Login(userInputs) {
    const { email, password } = userInputs;
    const existingCustomer = await this.repository.FindCustomer({
      email,
    });

    if (!existingCustomer) {
      throw new NotFoundError("Customer not found");
    }

    const validatePassword = await ValidatePassword(
      existingCustomer.password,
      password,
      existingCustomer.salt
    );

    if (!validatePassword) {
      throw new ValidationError("Invalid Password");
    }

    const token = GenerateToken({
      email: existingCustomer.email,
      _id: existingCustomer._id,
    });
    return { _id: existingCustomer._id, token };
  }
  
  async GetCustomerById(customerId) {
    const data = await this.repository.FindCustomerById(customerId);
    if (data===null) {
      throw new NotFoundError("Customer not found");
    }
    return data
  }

  async deleteCustomerById(customerId) {
    return this.repository.deleteCustomerById(customerId);
  }

}

module.exports = CustomerServices;
