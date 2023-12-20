import User from "../../models/User.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../utils/validator.js";
import { ApolloError, UserInputError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SEC_KEY } from "../../config.js";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SEC_KEY,
    {
      expiresIn: "2h",
    }
  );
}

export const userResolvers = {
  Mutation: {
    async registerUser(
      _,
      { registerINput: { username, email, password, confirmPassword } }
    ) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const oldUser = await User.findOne({ email });

      if (oldUser) {
        throw new UserInputError(
          `A user is already registerd with the email ${email}`,
          {
            errors: {
              email: "this email is taken",
            },
          }
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        username,
        password: encryptedPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async loginUser(_, { loginInput: { email, password } }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("user not found", { errors });
      }

      const matchPassword = await bcrypt.compare(password, user.password);

      if (!matchPassword) {
        errors.general = "Wrong crendtials";
        throw new UserInputError("Wrong crendtials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};


