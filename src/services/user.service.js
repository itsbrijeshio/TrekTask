const User = require("../models/user.model.js");
const argon2 = require("argon2");
const { DBError } = require("../utils/index.js");
const { USER_MESSAGES } = require("../constants/message.js");

class UserService {
  sanitize(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async hashPassword(password) {
    return await argon2.hash(password);
  }

  async comparePassword(hashedPassword, password) {
    return await argon2.verify(hashedPassword, password);
  }

  async createUser({ name, email, password, role }) {
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      throw new DBError(USER_MESSAGES.CONFLICT_USER(email));
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return this.sanitize(user);
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new DBError(USER_MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatchedPassword = await this.comparePassword(
      user.password,
      password
    );
    if (!isMatchedPassword) {
      throw new DBError(USER_MESSAGES.INVALID_CREDENTIALS);
    }
    return this.sanitize(user);
  }

  async getUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new DBError(USER_MESSAGES.UNAUTHORIZED);
    }
    return this.sanitize(user);
  }

  async updateUser(userId, { name }) {
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
    if (!user) {
      throw new DBError(USER_MESSAGES.UNAUTHORIZED);
    }
    return this.sanitize(user);
  }

  async deleteUser(userId) {
    const isDeleted = await User.findByIdAndDelete(userId);
    if (!isDeleted) {
      throw new DBError(USER_MESSAGES.UNAUTHORIZED);
    }
    return !!isDeleted;
  }
}

module.exports = new UserService();
