import { MongoClient } from "mongodb";


const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
throw new Error("Missing MONGODB_URI in environment");
}
if (!dbName) {
throw new Error("Missing MONGODB_DB in environment");
}

declare global {
var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);
const clientPromise =
global._mongoClientPromise ?? (global._mongoClientPromise = client.connect());

export async function Db() {
const connectedClient = await clientPromise;
return connectedClient.db(dbName);
}