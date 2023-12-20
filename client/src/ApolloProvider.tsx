import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  concat,
  createHttpLink,
} from "@apollo/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { BrowserRouter } from "react-router-dom";
import React from "react";

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem("jwtToken");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: cache,
});

export default (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </ApolloProvider>
  </Provider>
);
