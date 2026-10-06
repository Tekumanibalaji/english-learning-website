require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const matchRoutes = require("./routes/match");
const ratingRoutes = require("./routes/rating");
const callRoutes = require("./routes/calls");
const safetyRoutes = require("./routes/safety");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "Boost English App", version: "2.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/safety", safetyRoutes);

const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ["GET", "POST"] }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    if (token && process.env.JWT_SECRET) {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      socket.user = { id: socket.id };
    }
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.to(roomId).emit("peer-joined", { socketId: socket.id });
  });

  socket.on("webrtc-offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("webrtc-offer", { offer });
  });

  socket.on("webrtc-answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("webrtc-answer", { answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", { candidate });
  });

  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("peer-left");
  });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/boostenglish");
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Boost English backend: http://localhost:${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

start();
