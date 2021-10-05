const express = require("express");
const users = require("../model/user");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const verify = require("./verify");

const userRouter = express.Router();
userRouter
  .route("/register")
  .get((req, res) => {
    res.sendFile("/public/register.html", { root: process.cwd() });
  })
  .post(async (req, res) => {
    try {
      const emailcheck = await users.findOne({ email: req.body.email });
      if (emailcheck) {
        return res.status(400).send("Email is already exits");
      }
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(req.body.password, salt);
      const newUser = users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashpassword,
      });
      if (newUser) {
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
    }
  });

userRouter
  .route("/login")
  .get((req, res) => {
    res.sendFile("/public/login.html", { root: process.cwd() });
  })
  .post(async (req, res) => {
    try {
      const loggedUser = await users.findOne({ email: req.body.email });
      if (loggedUser) {
        const check = await bcrypt.compare(
          req.body.password,
          loggedUser.password
        );
        if (check) {
          const token = jwt.sign(
            { _id: loggedUser._id },
            process.env.TOKEN_SECERT,
            { expiresIn: "1h" }
          );
          console.log(token);
          res.redirect(`/dashboard?token=${token}`);
        } else {
          res.status(403).send("Email or Password is incorrect");
        }
      } else {
        res.status(403).send("Email or Password is incorrect");
      }
    } catch {}
  });

userRouter.route("/dashboard").get(verify, (req, res) => {
  res.sendFile("/public/dashboard.html", { root: process.cwd() });
});

module.exports = userRouter;
