const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/force_gym");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  telephone: String,
  email: String,
  adress: String,
  age: Number,
  password: String,
  planHistory: [
    {
      plan: String,
      startDate: String,
      endDate: String,
    },
  ],
});

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("Users", userSchema);
const Message = mongoose.model("Messages", messageSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/planning", (req, res) => {
  res.sendFile(path.join(__dirname, "planning.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});

app.get("/espace", (req, res) => {
  res.sendFile(path.join(__dirname, "espace.html"));
});

app.get("/inscri", (req, res) => {
  res.sendFile(path.join(__dirname, "inscri.html"));
});

app.get("/mdp", (req, res) => {
  res.sendFile(path.join(__dirname, "mdp.html"));
});

app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "payment.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profil.html"));
});

app.get("/compte", (req, res) => {
  res.sendFile(path.join(__dirname, "compte.html"));
});

app.get("/activite", (req, res) => {
  res.sendFile(path.join(__dirname, "activite.html"));
});

app.get("/tarif", (req, res) => {
  res.sendFile(path.join(__dirname, "tarif.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    res.status(200).send({ message: "Login successful", userId: user._id, user });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

app.post("/register", async (req, res) => {
  const { username, name, telephone, email, adress, age, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send({ message: "Email already in use" });
  }

  const newUser = new User({
    username,
    name,
    telephone,
    email,
    adress,
    age,
    password,
  });
  await newUser.save();

  res.status(201).send({ message: "User registered successfully" });
});

// Add this endpoint to fetch user data by ID
// Add this endpoint to fetch user data by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

// Add this endpoint to update user data
app.put("/user/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});
// Add this endpoint to handle contact form submissions
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const newMessage = new Message({
    name,
    email,
    subject,
    message,
  });

  try {
    await newMessage.save();
    res.status(201).send({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});