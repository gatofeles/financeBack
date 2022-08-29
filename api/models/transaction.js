const mongoose = require('mongoose');
const Joi = require('joi');

const tranValidSchema  = Joi.object({
    
    title: Joi.string()
    .min(5)
    .max(50)
    .required(),

    cost: Joi.number()
    .min(0)
    .max(1000000000)
    .required(),

    userId: Joi.string()
    .alphanum() .min(5)
    .max(1000).required(),

    description: Joi.string()
    .min(5)
    .max(255)
   
});

const transactionSchema = mongoose.Schema({
    id : mongoose.Types.ObjectId,
    userId: {
        type:String,
        required:true,
        minlength:5
    },
    cost: {
        type:Number,
        required:true     
    },
    title: {
        type:String,
        required:true,
        minlength:5,
        maxlength:50      
    },
    description:{
        type:String,
        default:"No Description",
        minlength:5,
        maxlength:255
    },
    date: Date

});

//Classe insere novos cartões
const Transaction = mongoose.model('Transaction', transactionSchema);

function validateTransaction(tran){
    try {
        const result = tranValidSchema.validate({
            title: tran.title, 
            cost:tran.cost,
            userId:tran.userId,
            description:tran.description
        });
   
           if(result.error){          
               return [false, result.error.message];
           }
           
        return[true, ""];
    } catch (error) {
        return [false, result.error.message];
    }
}

async function createTran(tran){
    //Validar a entrada
    const result = validateTransaction(tran);
    if(!result[0]){
     return result;
    }
    //criar instancia

    let newTran = new Transaction(tran);
    newTran.date = new Date().toUTCString();
    newTran._id = new mongoose.Types.ObjectId();

    //salvar na base de dados
    
    tranResult = await newTran.save();
    console.log(tranResult);
    return [true,tranResult];
}

async function updateTran(tran){

    let tranToUpdate = await Transaction.findById(tran._id);

    if(!tranToUpdate){
        return [false, "Transaction not found."];
    }

    const result = validateTransaction(tran);
    if(!result[0]){
        return result;
    }
    
    tranToUpdate.set({
        title:tran.title,
        type:tran.type,
        value:tran.value,
        description:tran.description,

    });

    tranToUpdate.save();

    return [true, "Transaction updated succesfully."];    
}

async function deleteTran(tran){
    let tranToDelete = await Transaction.findById(tran._id);

    if(!tranToDelete){
        return [false,  "Transaction not found."];
    }

    else{
        const result = await tranToDelete.deleteOne({_id:tran._id});
        return [true, "Transaction successfully deleted."];
    }
}

async function getTransByUserId(userId){
    const trans = await Transaction.find({userId:userId});
    return [true,trans];
}

async function getTransByUserId(userId){
    const trans = await Transaction.find({userId:userId});
    return [true,trans];
}

async function getTranById(tranId){
    const tran = await Transaction.find({_id:tranId});
    if(!tran){
        return [false,  "Transaction not found."];
    }
    return [true,tran];
}

async function getAllTrans(tranId){
    const trans = await Transaction.find();
    if(!trans){
        return [false,  "Transactions not found."];
    }
    return [true,trans];
}

module.exports = mongoose.model("Transaction", transactionSchema);
module.exports.createTran = createTran;
module.exports.updateTran = updateTran;
module.exports.deleteTran = deleteTran;
module.exports.getAllTrans = getAllTrans;
module.exports.getTranById = getTranById;
module.exports.getTransByUserId = getTransByUserId;