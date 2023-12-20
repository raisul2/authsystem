import { msgResolvers } from "./msg_resolver.js";
import { userResolvers } from "./user_resolver.js";
const resolvers = {
  Query: {
    ...msgResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...msgResolvers.Mutation,
  },
};

export default resolvers;
