import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./graphql/resolvers/index.js";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import mongoose from "mongoose";
import { DBURL } from "./config.js";

const typeDefs = loadSchemaSync("./graphql/typeDefs.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose.connect(DBURL).then(async () => {
  console.log("MongoDB Connected!");
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context:({req}) =>({
       authToken: req.headers.authorization
    })
  });
  console.log(`server is ready at port ${url}`);
});
