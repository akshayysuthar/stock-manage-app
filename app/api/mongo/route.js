import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request) {
  // Replace the following with your Atlas connection string
  const url =
    "mongodb+srv://akshaysuthar05:zac84cl4Q0WHG11Y@cluster0.jhnxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  // Connect to your Atlas cluster
  const client = new MongoClient(url);

  async function run() {
    try {
      await client.connect();
      console.log("Successfully connected to Atlas");
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }

  }

  run().catch(console.dir);
  return NextRequest.json({ a: test });
}
