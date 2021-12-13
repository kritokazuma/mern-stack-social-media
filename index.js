require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
  wsController,
} = require("./controllers/WebSockets/wsFriend.controller");

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://mern-stack-social-media.vercel.app",
    ],
  },
});

wsController(io);

module.exports = io;

app.use("/api/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://mern-stack-social-media.vercel.app",
      "https://localhost:3000",
    ],
  })
);
app.use(fileUpload());

//Connect MongoDb
connectDB();

app.use("/api", require("./routes/Post"));
app.use("/api/users", require("./routes/User"));
app.use("/api/profile", require("./routes/Images"));
app.use("/api/conservation", require("./routes/Messages"));

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`server is running on port ${port}`));
