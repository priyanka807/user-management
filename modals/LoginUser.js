import mongoose from 'mongoose'

const LoginSchema = new mongoose.Schema({
  
    email:{type:String,required:[true,'Email Required !!']},
    password:{type:String,required:[true,'Password Required !!']}
})


 const  LoginUserModala  = mongoose.models.loginuser || mongoose.model("loginuser",LoginSchema)
export default LoginUserModala



