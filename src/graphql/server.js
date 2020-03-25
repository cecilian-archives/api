import { ApolloServer } from "apollo-server-cloud-functions";

import schema from "./schema";
import resolvers from "./resolvers/";

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req, res }) => ({
    headers: req.headers,
    req,
    res,
  }),
});

export default apolloServer;
