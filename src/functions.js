import apolloServer from "./graphql/server";
const functions = require("firebase-functions");
import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cecilian-archives.firebaseio.com",
});

const handler = apolloServer.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

const api = functions.region("europe-west2").https.onRequest(handler);

export { api };
