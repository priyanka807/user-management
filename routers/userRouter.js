import express from "express";
import expressAsyncHandler from "express-async-handler";
import UserModala from "../modals/Users.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils.js";

const userRouter = express.Router();


userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new UserModala({
      id:req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,process.env.BCRYPT_URL),
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
          token: generateToken(user), //to generateToken using user details
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
    console.log(userId,'userId')
    const user = new UserModala({
      id:req.body.id,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,process.env.BCRYPT_URL),
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

export default userRouter;