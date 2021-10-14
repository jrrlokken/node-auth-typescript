import express, { Request, Response, NextFunction, Application } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

import dbConnect from "./db/dbConnect";
import User from "./db/userModel";
import auth from "./auth";

dotenv.config();
const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "You wanted a response, so here you are!" });
  next();
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 10, function (error, hashedPassword) {
    if (error) {
      res.status(500).send({
        message: "Password was not hashed successfully",
        error,
      });
    }

    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    user
      .save()
      .then((result: any) => {
        res.status(201).send({
          message: "User created successfully",
          result,
        });
      })
      .catch((error: any) => {
        res.status(500).send({
          message: "Error creating user",
          error,
        });
      });
  });
});

app.post("/login", (req: Request, res: Response) => {
  User.findOne({ email: req.body.email }).then((user: any) => {
    bcrypt.compare(
      req.body.password,
      user.password,
      function (error, passwordCheck) {
        if (error) {
          res.status(404).send({
            message: "Email not found",
            error,
          });
        }

        if (!passwordCheck) {
          return res.status(400).send({
            message: "Passwords do not match",
            error,
          });
        }

        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.status(200).send({
          message: "Login successful",
          email: user.email,
          token,
        });
      }
    );
  });
});

// open endpoint
app.get("/free-endpoint", (req: Request, res: Response) => {
  res.json({ message: "You are free to access this page anytime" });
});

// auth endpoint
// @ts-ignore
app.get("/auth-endpoint", auth, (req: Request, res: Response) => {
  res.json({ message: "You are authorized to access me" });
});

export default app;
