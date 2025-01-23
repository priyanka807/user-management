import express from "express";
import expressAsyncHandler from "express-async-handler";
import UserModala from "../modals/Users.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils.js";
import dotenv from 'dotenv';
dotenv.config();
const userRouter = express.Router();

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const BCRYPT_URL = process.env.BCRYPT_URL
    const user = new UserModala({
      id:req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,parseInt(BCRYPT_URL)),
      role: req.body.role,
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      token: generateToken(createdUser),
    });
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await UserModala.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user)
        });
      }
    }
    res.status(401).send({ message: "Invalid username or password" });
  })
);

userRouter.put(
  "/profile/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id
    const BCRYPT_URL = process.env.BCRYPT_URL
    const user = new UserModala({
      id:req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,parseInt(process.env.BCRYPT_URL)),
      role: req.body.role,
    });

    const getUserId = await  UserModala.findById(userId)
    getUserId.id = user.id
    getUserId.name = user.name
    getUserId.email = user.email
    getUserId.password = user.password
    getUserId.role = user.role
    const createdUser = await getUserId  
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      token: generateToken(createdUser),
    });
  })
);


userRouter.get(
  "/users",

  expressAsyncHandler(async (req, res) => {
 
    try {
      const result = await UserModala.find();
      res.send(result);
    } catch (error) {
      console.log("User not found");
    }
  })
);


userRouter.get(
  "/users/:id",

  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id
    try {
      const result = await UserModala.find({_id:userId});
      res.send(result);
    } catch (error) {
      console.log("User not found");
    }
  })
);

userRouter.delete(
  "/users/:id",

  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id
    try {
      await UserModala.deleteOne({_id:userId});
      const user = await UserModala.find();
      res.send(user);
    } catch (error) {
      console.log("User not found");
    }
  })
);
userRouter.delete(
  "/users",
  expressAsyncHandler(async (req, res) => {
    try {
      await UserModala.deleteMany({}); // Deletes all user records
      const user = await UserModala.find();
      res.status(200).send({ message: "All users deleted successfully" ,user:user});
    } catch (error) {
      console.error("Error deleting users:", error);
      res.status(500).send({ message: "Error deleting users" });
    }
  })
);
userRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    try {
      // Extract query parameters from request
      const { name, email } = req.query;

      // Build filter object based on provided query parameters
      let filter = {};
      if (name) {
        filter.name = { $regex: name, $options: "i" };  // Case-insensitive search
      }
      if (email) {
        filter.email = { $regex: email, $options: "i" }; // Case-insensitive search
      }
console.log(filter,'filter')
      // Fetch users based on filter criteria
      const result = await UserModala.find(filter);
      
      if (result.length > 0) {
        res.send(result);
      } else {
        res.status(404).send({ message: "No users found matching the criteria" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  })
);


export default userRouter;


