import { ApolloServer } from "apollo-server-cloud-functions";
import schema from "./schema";
import resolvers from "./resolvers/";
import dotenv from "dotenv/config";

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
  engine: {
    reportSchema: true,
    schemaReportingInitialDelayMaxMs: 900,
  },
});

export default apolloServer;
