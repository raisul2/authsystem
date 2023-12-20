import jwt from "jsonwebtoken";
import { SEC_KEY } from "../config.js";
import { AuthenticationError } from "apollo-server-errors";

export const authContext = (context) => {
  const authHeader = context.authToken;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) { 
      try {
        const user = jwt.verify(token, SEC_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token] ");
  }
  throw new Error("Authorization header must be provided ");
};
