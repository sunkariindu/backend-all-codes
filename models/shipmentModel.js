const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    order_Id: { type: Number, unique: true },
    customer_Name: { type: String, unique: true },
    customer_Address: { type: String, unique: true },
    billing_Num: { type: Number, required: true },
    pickup_loc: { type: String, required: true },
    pin_Code: { type: Number, unique: true },
    shipping_Date: { type: String, unique: true }
});
module.exports = mongoose.model('ShipmentModel',userSchema);






