
import  LoginUserModala  from "../modals/LoginUser.js"
import UserListModala from '../modals/UserList.js';
import expressAsyncHandler from "express-async-handler"
import bcrypt from 'bcryptjs'
import express from 'express'
import { generateToken } from "../utils.js";

const loginRouter = express.Router()

loginRouter.post("/login-user",
    expressAsyncHandler(async(req,res)=>{
   const {email,password}  = req.body
try{
const existedUser = await  UserListModala.findOne({email})
const user = await new LoginUserModala({email,password})
if(!existedUser){
    throw new Error("User not found ")
}
const matched =await bcrypt.compare(password,existedUser.password)
if(!matched){
    throw new Error("Password not matched ")
}

user.password = bcrypt.hashSync(password,parseInt(process.env.BCRYPT_URL))
const loginuser = await user.save()

const token = generateToken({_id:loginuser._id})
res.cookie('authenthication',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict', maxAge: 30 * 24 * 60 * 60 * 1000,})

res.status(201).send({_id:loginuser._id,email:loginuser.email,password:loginuser.password,token:token})
}catch(error){
    res.status(500).send(error)
console.log(error,'error')
}
}))


export default loginRouter;





