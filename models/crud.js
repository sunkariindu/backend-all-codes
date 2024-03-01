const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crudSchema = new Schema({
    order:{type:String,unique:true},
    date:{type:String,unique:true},
    payment:{type:Number,unique:true},
    product:{type:String,required:true},
    customer:{type:String,required:true},
    phone:{type:Number,unique:true},
    weight:{type:String,unique:true},
    
});

module.exports = mongoose.model('crud',crudSchema);