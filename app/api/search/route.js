import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query") || ""; // Default to an empty string if no query
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://akshaysuthar05:admin@cluster0.jhnxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
 
    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } }, // Partial matching for slug field
              { product_name: { $regex: query, $options: "i" } }, // Partial matching for product_name field
            ],
          },
        },
      ])
      .toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
