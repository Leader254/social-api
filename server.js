import express from "express";
import config from "./db/config.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import authRoute from "./Routes/authRoutes.js";
import postRoute from "./Routes/postsRoutes.js";
import commentRoute from "./Routes/commentsRoutes.js";
import userRoute from "./Routes/usersRoutes.js";
import likeRoute from "./Routes/likesRoutes.js";
import relationshipRoute from "./Routes/rshipRoutes.js";
// import chatRoute from "./Routes/chatRoutes.js";
import chatsRoute from "./Routes/chatRoute.js";
import messageRoute from "./Routes/messageRoutes.js";

import { Server } from "socket.io";
import http from "http";
// import { chatMessage } from "./Controllers/chatController.js";
import { chatMessage } from "./Controllers/chatMessage.js";

import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 60000,
  cors: {
    origin: "https://ambitious-hill-0b7b16c0f.3.azurestaticapps.net",
  },
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://ambitious-hill-0b7b16c0f.3.azurestaticapps.net",
  })
);
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/users", userRoute);
app.use("/api/likes", likeRoute);
app.use("/api/relationships", relationshipRoute);
// app.use("/api/chats", chatRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messageRoute);

chatMessage(io);

app.get("/", (req, res) => {
  res.send("Hello and welcome to the server");
});

server.listen(config.port || 3000, () => {
  console.log(`Server is running`);
});
