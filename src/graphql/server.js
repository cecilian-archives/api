import { ApolloServer } from "apollo-server-cloud-functions";
import schema from "./schema";
import resolvers from "./resolvers/";

const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
});
dotenvExpand(myEnv);

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
    schemaReportingInitialDelayMaxMs: 1000,
  },
});

export default apolloServer;
