const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const uploadSchema = new Schema({
    file: { type: String, unique: true },
   
});
 
module.exports = mongoose.model('upload', uploadSchema);