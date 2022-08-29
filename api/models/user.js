const mongoose = require('mongoose');
const Joi = require('joi');
const crypt = require('bcrypt');

const userValidSchema  = Joi.object({
    
    name: Joi.string()
    .min(5)
    .max(50)
    .required(),
    
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

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:5,
        maxlength:50
        
    },
    email: {
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
        
    },
    password: {
        type:String,
        required:true,
        minlength:5,
        maxlength:1024,
        
    },

    isAdmin:{
        type:Boolean,
        default:false
    },

    date:{
        type:Date,
        //required:true;
    },
    
});

function validateUserEntry(user){

    try {
        const result = userValidSchema.validate({
            name: user.name, 
            password:user.password, 
            email:user.email
        });
    
           if(result.error){
               return [false, result.error.message];
           }
           
            return[true, ""];
    } catch (error) {
        return [false, error.message];
    }
    
}

const User = mongoose.model("User",userSchema);

async function showUsers(){
    const users = await User.find();
    return [true, users];
}

async function createUser(user){
    
    //Validar a entrada
    const result = validateUserEntry(user);
    if(!result[0]){
     return result;
    }

    //Verificando se o usuário existe
    const userExist = await User.findOne({email:user.email});
    if(userExist){
        return[false, "User Already Exists."];
    }

    //criar instancia
    const salt = crypt.genSalt(10);
    let newUser = new User(user);

    newUser.password = await crypt.hash(newUser.password, (await salt).toString());
    newUser.date = new Date();

    //salvar na base de dados
    userResult = await newUser.save();
    return [true,{name:userResult.name,
                  email:userResult.email}];

}

async function deleteUser(user){

    let userToDelete = await User.findById(user._id);

    if(!userToDelete){
        return [false, "User not found."];
    }

    else{
        const result = await userToDelete.deleteOne({_id:user._id});
        if(result.error){
            return [false, error.message];
        }
        return [true, "User successfully deleted."];
    }
}

async function findUserByEmail(req){

    let userFound = await User.findOne({email:req.email});

    if(!userFound){
        return [false, "User not found."];
    }

    else{
        return [true, userFound];
    }
}

module.exports.showUsers = showUsers;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.findUserByEmail = findUserByEmail;
module.exports.userSchema = userSchema;