const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = 5000;

// Get MongoDB connection string from environment variable
const url = process.env.MONGO_URL || "mongodb://localhost:27017"; // Fallback for local development
const client = new MongoClient(url);

app.use(cors()); // Allow all origins by default
app.use(express.json());

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

app.get("/products", async (req, res) => {
  try {
    const db = client.db("database");
    const products = await db.collection("Products").find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).send("Error fetching collections");
  }
});

app.post("/insert-products", async (req, res) => {
  const products = [
    // Your product data here
  ];

  try {
    const db = client.db("database");
    const result = await db.collection("Products").insertMany(products);
    res.json({ message: "Products inserted successfully", result });
  } catch (error) {
    console.error("Error inserting products:", error);
    res.status(500).send("Error inserting products");
  }
});

// Start the server and connect to MongoDB
app.listen(PORT, () => {
  connect().then(() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
