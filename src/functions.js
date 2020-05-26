import apolloServer from "./graphql/server";
const functions = require("firebase-functions");
import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

const handler = apolloServer.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

const api = functions.region("europe-west2").https.onRequest(handler);

export { api };
