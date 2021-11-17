require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Connect MongoDb
connectDB();

app.use("/api", require("./routes/Post"));
app.use("/api/users", require("./routes/User"));

const port = process.env.PORT;

app.listen(port, () => console.log(`server is running on port ${port}`));
