const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.send("This is working!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://LeslieSaliba:fP2S8d2TIYItfkq1@cluster0.f1wdbcv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Mongoose

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

// Define a User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

// Create a User model from the schema
const User = mongoose.model('User', userSchema);


// CRUD = create, read, update, delete 
// 1. Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required fields" });
    }
    const newUser = new User({ username, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});


// 2. Get all users --> tested on Postman and worked on browser
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a user by ID --> tested on Postman and worked on browser
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// 3. Update a user by ID --> tested on Postman and worked on browser
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// 4. Delete a user by ID --> tested on Postman and worked on browser
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Add some sample user data for retrieval (new route)

app.post("/api/seed", async (req, res) => {
  try {
    const sampleUsers = [
      { username: "Leslie", email: "leslie@example.com" },
      { username: "Glenn", email: "glenn@example.com" },
      { username: "Gabriel", email: "gabriel@example.com" }
    ];

    // Insert sample users into the database
    await User.insertMany(sampleUsers);

    res.status(201).json({ message: "Sample user data seeded successfully" });
  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).json({ error: "Failed to seed sample user data" });
  }
});