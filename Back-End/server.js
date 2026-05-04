const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// SOCKET
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// SERVE IMAGES
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const masterRoutes = require("./routes/masterRoutes");
app.use("/api/master", masterRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const interestRoutes = require("./routes/interestRoutes");
app.use("/api/interest", interestRoutes);

/* =====================================
SOCKET LOGIC (ADVANCED)
===================================== */

let users = {}; // userId → socketId

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // ================= JOIN =================
  socket.on("join", (userId) => {
    users[userId] = socket.id;

    // broadcast online users
    io.emit("onlineUsers", Object.keys(users));

    console.log("User joined:", userId);
  });

  // ================= SEND MESSAGE =================
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {

    const receiverSocket = users[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        senderId,
        text
      });
    }

  });

  // ================= TYPING =================
  socket.on("typing", ({ senderId, receiverId }) => {

    const receiverSocket = users[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("typing", { senderId });
    }

  });

  // ================= SEEN =================
  socket.on("seen", ({ senderId, receiverId }) => {

    const senderSocket = users[receiverId];

    if (senderSocket) {
      io.to(senderSocket).emit("seen");
    }

  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {

    // remove user from map
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    }

    // update online users
    io.emit("onlineUsers", Object.keys(users));

    console.log("User disconnected");
  });

});

/* =====================================
   DB CONNECT
===================================== */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* =====================================
   SERVER START
===================================== */
server.listen(5000, () => {
  console.log("Server running on port 5000");
});