import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import expressAsyncHandler from 'express-async-handler'
import UserListModala from '../modals/UserList.js';

import bcrypt from 'bcryptjs'


const userListRouter =  express.Router()
userListRouter.get("/user-list",
    expressAsyncHandler(async(req,res)=>{
try{
const result =await UserListModala.find()
console.log(result,'result')
res.send(result)
}catch(error){
    console.log(error,'error')
}
    })
)


userListRouter.get("/user-list/:id",
    expressAsyncHandler(async(req,res)=>{
        const userId = req.params.id
        console.log(userId,'userId')
try{
const result =await UserListModala.findById({_id:userId})
console.log(result,'result')
res.send(result)
}catch(error){
    console.log(error,'error')
}
    })
)



userListRouter.post("/user-list",expressAsyncHandler(async(req,res)=>{
const {email,firstName,lastName,password,role} = req.body

    try{

        const newUser = await new UserListModala({email,firstName,lastName,password,role})
        newUser.password = bcrypt.hashSync(password,parseInt(process.env.BCRYPT_URL))

 if(newUser.email===""||newUser.firstName===""||newUser.lastName===""||newUser.role===""){
    throw new Error("All fields are required. Please fill them in.")
 }
 const existingUser = await UserListModala.findOne({email})
 console.log(existingUser,'existingUser')
 if(existingUser){
    if(existingUser.email===email){
        throw new Error("This email is already in use.")
    }
 }


 const createdUser =  await   newUser.save();
    
    res.status(200).send(createdUser)

    }catch(error){
        console.log(error,'error')
    }
}))

userListRouter.put("/user-list/:id",expressAsyncHandler(async(req,res)=>{
    const userId  = req.query.id

    const {email,firstName,lastName,password,role} = req.body
    const findUser = await UserListModala.find({_id:userId})

        try{
    
            findUser.email = email;
            findUser.firstName = firstName;
            findUser.lastName = lastName;
            findUser.password = bcrypt.hashSync(password,parseInt(process.env.BCRYPT_URL))
            findUser.role = role 
            const updateUser = await new UserListModala(findUser)
    
   
    
     const updateExistingUser =  await   updateUser.save();
        res.status(200).send({email:updateExistingUser.email,
            firstName:updateExistingUser.firstName,
            lastName:updateExistingUser.lastName,
            password:updateExistingUser.password,
            role:updateExistingUser.role
        
        })
    
        }catch(error){
            console.log(error,'error')
        }
    }))

    userListRouter.delete("/user-list/:id",
        expressAsyncHandler(async(req,res)=>{  
        const userId  = req.params.id
        console.log(userId,'userId')
            try{
                 
          await   UserListModala.deleteOne({_id:userId});
          const getAllUsers = await UserListModala.find()
            res.status(200).send(getAllUsers)
        
            }catch(error){
                console.log(error,'error')
            }
        }))

        userListRouter.delete("/user-list",
            expressAsyncHandler(async(req,res)=>{  
           
                try{
                     
              await   UserListModala.deleteMany({});
              
                res.status(200).send({message:"ALL USERS ARE DELETED"})
            
                }catch(error){
                 console.log(error,'error')
                }
            }))
    

export default userListRouter;

