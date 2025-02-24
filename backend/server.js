const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

require("dotenv").config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = new Server(server, {
  cors: {
    origin: [`${process.env.VERCEL_URL}`, `${process.env.LOCALHOST_URL}`],
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.use(cors());
app.use(express.json());

// Routes
app.use("/orders", require("./routes/orders"));
app.use("/analytics", require("./routes/analytics"));
// app.use("/recommendations", require("./routes/recommendations"));
app.use("/report", require("./routes/exportReport"));

io.on("connection", (socket) => {
  console.log("🟢 New client connected");
  socket.on("disconnect", () => console.log("🔴 Client disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
