const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// MongoDB URI
const uri =
  "mongodb+srv://vkkhambra786:gmsAhQMAZXLAMv11@cluster0.umaontj.mongodb.net/insurance_database?retryWrites=true&w=majority";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Call the connectToDatabase function
connectToDatabase();

// Define a schema for the messages
const messageSchema = new mongoose.Schema({
  message: String,
  day: String,
  time: String,
});

const Message = mongoose.model("Message", messageSchema);

// Middleware to parse JSON body
app.use(bodyParser.json());

// Route handler to create a new scheduled message
app.post("/schedule-message", async (req, res) => {
  const { message, day, time } = req.body;

  try {
    // Create a new message document
    const newMessage = new Message({
      message,
      day,
      time,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: "Message scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while scheduling the message" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Post-service is running on port ${PORT}`);
});
