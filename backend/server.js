import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import Dbconfig from "./config/db.config.js";

dotenv.config();

const port = process.env.PORT || 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) {
      return;
    }

    console.log("User joined:", userId);
    socket.join(userId);
    onlineUsers[userId] = socket.id;
    socket.emit("joined");
  });

  socket.on("privateMessage", ({ to, message, from, time }) => {
    if (!to || !message || !from) {
      return;
    }

    console.log(`Message from ${from} to ${to}: ${message}`);
    io.to(to).emit("receivePrivateMessage", { message, from, time });
  });

  socket.on("typing", ({ to }) => {
    if (!to) {
      return;
    }

    socket.to(to).emit("userTyping");
  });

  socket.on("stopTyping", ({ to }) => {
    if (!to) {
      return;
    }

    socket.to(to).emit("userStoppedTyping");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

const startServer = async () => {
  await Dbconfig();

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
