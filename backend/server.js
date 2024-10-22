const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = 5000;

// Get MongoDB connection string from environment variable
const url = process.env.MONGO_URL || "mongodb://mongo:27017/database"; // Fallback for local development
const client = new MongoClient(url);

app.use(cors()); // Allow all origins by default
app.use(express.json());

const products = [
  {
    name: "Product A",
    description: "A high-quality product for daily use.",
    price: 19.99,
    category: "Electronics",
    stock: 100,
    sku: "PA001",
  },
  {
    name: "Product B",
    description: "An innovative gadget that enhances productivity.",
    price: 29.99,
    category: "Gadgets",
    stock: 50,
    sku: "PB002",
  },
  {
    name: "Product C",
    description: "Stylish and comfortable shoes for all occasions.",
    price: 49.99,
    category: "Footwear",
    stock: 75,
    sku: "PC003",
  },
  {
    name: "Product D",
    description: "Eco-friendly reusable water bottle.",
    price: 15.99,
    category: "Home & Kitchen",
    stock: 200,
    sku: "PD004",
  },
  {
    name: "Product E",
    description: "A sleek laptop with powerful performance.",
    price: 999.99,
    category: "Computers",
    stock: 30,
    sku: "PE005",
  },
  {
    name: "Product F",
    description: "Wireless headphones with noise cancellation.",
    price: 89.99,
    category: "Audio",
    stock: 120,
    sku: "PF006",
  },
  {
    name: "Product G",
    description: "A versatile kitchen mixer for baking enthusiasts.",
    price: 199.99,
    category: "Home Appliances",
    stock: 40,
    sku: "PG007",
  },
  {
    name: "Product H",
    description: "Smartwatch with fitness tracking features.",
    price: 149.99,
    category: "Wearables",
    stock: 60,
    sku: "PH008",
  },
  {
    name: "Product I",
    description: "High-performance gaming mouse.",
    price: 59.99,
    category: "Gaming",
    stock: 80,
    sku: "PI009",
  },
  {
    name: "Product J",
    description: "Portable Bluetooth speaker with great sound quality.",
    price: 39.99,
    category: "Audio",
    stock: 150,
    sku: "PJ010",
  },
];

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db("database");
    const collection = db.collection("Products");

    // Check if the collection is empty
    const count = await collection.countDocuments();
    if (count === 0) {
      // Insert products if the collection is empty
      await collection.insertMany(products);
      console.log("Dummy data inserted into the Products collection.");
    }
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
