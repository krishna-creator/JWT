const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const mongodb = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use("/", express.static("public"));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);

mongodb.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("connected to database");
});

app.listen(3000, console.log("Server Listening to 3000"));
