const mongoose = require('mongoose');
const Joi = require('joi');
const userModel = require('./user');
const crypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const credentialsValidSchema  = Joi.object({
        
    email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .required(),

    password: Joi.string()
    .min(5)
    .max(255)
    .alphanum()
    .required(),
   
});

const authSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
        maxlength:1024,
        minlength:5

    },
    password:{
        type:String,
        required:true,
        maxlength:1024,
        minlength:5

    },
    date:Date

})

const Auth = mongoose.model('Auth', authSchema);


function validateCredentialsEntry(credentials){

    try {
        const result = credentialsValidSchema.validate({
            password:credentials.password, 
            email:credentials.email
            });
    
           if(result.error){
               return [false, result.error.message];
           }
           
            return[true, ""];
    } catch (error) {
        console.log(error);
    }
}

async function registerAuth(credentials){
    console.log("step");
    const result = validateCredentialsEntry(credentials);
    if(!result[0]){
        return result;
    }
    
    console.log("step");

    const User = mongoose.model("User",userModel.userSchema);
    
    const user = await User.findOne({email:credentials.email});

    if(user){
        const validPassword = await crypt.compare(credentials.password, user.password);
        if(!validPassword){
            return [false, "Login was Unsuccesfull."];
        }
        const token = jwt.sign({id:user._id}, process.env.JWT);
        const unserInfo = {
            userId: user._id,
            token: token
        }
        console.log(token);
        return [true, unserInfo];
    }

    return [false, "Login was Unsuccesfull."];


}

exports.registerAuth = registerAuth;