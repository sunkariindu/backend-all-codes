
const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const twilio =require('twilio')
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const cors = require('cors')
const authRoute = require('./routes/auth.route');
const router = require('./routes/router');
const shipmentRoute = require('./routes/shipmentRoute');
const paymentRoute = require('./routes/paymentRoute');
const appRoute = require('./routes/route');
const appController = require('./mailer/controller/appController');
const pincodeRoute = require('./routes/pincodeRoute.js');
// const uploadModel = require('./models/uploadModel');
 
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
 
const port = process.env.PORT || 8080;
 
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin',"*");
//   res.header('Access-Control-Allow-Headers', true);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   next();
// });
// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/data', );
// const db = mongoose.connection;
 
// db.on('error', console.error.bind(console, 'MongoDB connection error',{ useNewUrlParser: true, useUnifiedTopology: true }));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });
mongoose.connect('mongodb+srv://indus:QJj4xBy0G8N5IQCM@cluster0.hdmxbb1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  
});
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error connecting to MongoDB Atlas with Mongoose:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB Atlas with Mongoose');
});
 
app.use(express.json());
app.use(cors());
 
app.use(express. urlencoded({extended:false}))
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
 
 
var client = new twilio(accountSid,authToken)
var otp =Math.floor(100000+Math.random()*90000);
var userEnteredOTP=''
console.log(otp)
app.post('/sendotp',(req,res)=>{
    client.messages.create({
      body:`Hello Nikhila, your OTP is: ${otp}`,
              to:'+919963760431',
              from:'+13202454091'
       
    })
    .then((message)=>{
        console.log('message sent:', message.sid);
        res.status(200).send ('OTP send succesfully');
    })
    .catch((error)=>{
        console.error('errorsending message:',error);
        res.status(500).send('failed to send OTP');
    })
})    
app.post('/verifyotp', (req, res) => {
    userEnteredOTP = req.body.userEnteredOTP;
 
    if (userEnteredOTP == otp.toString()) {
        res.status(200).send('OTP verification successful');
        console.log("valid otp");
    } else {
        res.status(400).send('Invalid OTP. Please Try Again.');
    }
});
 
app.use('/api', authRoute);
app.use('/api', router);
app.use('/api', shipmentRoute);
app.use('/api', paymentRoute);
app.use('/api', appRoute);
app.use('/api',pincodeRoute);
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload({ createParentPath: true }));
 
 
 
 
app.post('/json-payload', (req, res) => {
  try {
    const data = req.body;
    console.log('Received JSON payload:', data);
    res.json({ status: 'success', message: 'JSON payload received successfully' });
  } catch (error) {
    console.error('Error handling JSON payload:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
 
app.post('/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }
 
    let files = req.files.file;
 
    if (!Array.isArray(files)) {
      files = [files];
    }
 
    files.forEach((file) => {
      if (file) {
        const uploadPath = path.join(__dirname, 'uploads', file.name);
 
        file.mv(uploadPath, (err) => {
          if (err) {
            console.error('Error handling file upload:', err);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
          }
 
         
          console.log('File uploaded successfully:', file.name);
        });
      }
    });
 
   
    res.json({ status: 'success', message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
 
app.get('/', (req, res) => {
    res.send('welcome to snv');
});
 
const userSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  mobile: { type: Number, unique: true },
  password: { type: String, required: true },
  companyname: { type: String, unique: true },
  cruds: [{ type: Schema.Types.ObjectId, ref: 'Crud' }],
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
  paymentcontrollers: [{ type: Schema.Types.ObjectId, ref: 'PaymentController' }],
  uploads: [{ type: Schema.Types.ObjectId, ref: 'Upload' }],
});
 
const User = mongoose.model('User', userSchema);
 
 
const crudSchema = new Schema({
  order: { type: String, unique: true },
  date: { type: String, unique: true },
  payment: { type: Number, unique: true },
  product: { type: String, required: true },
  customer: { type: String, required: true },
  phone: { type: Number, unique: true },
  weight: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
});
 
const Crud = mongoose.model('Crud', crudSchema);
 
 
const shipmentSchema = new Schema({
  order_Id: { type: Number, unique: true },
  customer_Name: { type: String, unique: true },
  customer_Address: { type: String, unique: true },
  billing_Num: { type: Number, required: true },
  pickup_loc: { type: String, required: true },
  pin_Code: { type: Number, unique: true },
  shipping_Date: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  crud: { type: Schema.Types.ObjectId, ref: 'Crud' },
});
 
const Shipment = mongoose.model('Shipment', shipmentSchema);
 
 
const paymentControllerSchema = new Schema({
  name: { type: String, unique: true },
  amount: { type: Number, unique: true },
  product_name: { type: String, unique: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  crud: { type: Schema.Types.ObjectId, ref: 'Crud' },
  shipment: { type: Schema.Types.ObjectId, ref: 'Shipment' },
});
 
const PaymentController = mongoose.model('PaymentController', paymentControllerSchema);
 
 // Create a new user, crud, shipment, upload, and paymentController associated with each other
app.get('/created', async (req, res) => {
  try {
    const newUser = await User.create({
      name: 'vani',
      email: 'vrani@example.com',
      mobile: 99665422134,
      password: 'bdyt',
      companyname: 'jghg',
      
    });
    
    const newCrud = await Crud.create({
      order: 'nhjghg',
      date: '9/05/2353',
      payment: '57654',
      product: 'vdfre',
      customer: 'rerew',
      phone: 7655431217,
      weight:5.9,

    });
    
    const newShipment = await Shipment.create({
      order_Id: 4543545,
      customer_Name: 'rao',
      customer_Address: 'wazeed',
      billing_Num: '44232',
      pickup_loc: 'kaliveru',
      pin_Code: 598234,
      shipping_Date: '6/3/2053',
      user: newUser._id,
      crud: newCrud._id,
    });

    const newPaymentController = await PaymentController.create({
      name: 'poja',
      amount: 100,
      product_name: 'ewyyueywyu',
      description: 'gfdf',
      user: newUser._id,
      crud: newCrud._id,
      shipment: newShipment._id,
    });

    const newUpload = await Upload.create({
      file: 'nfre',
      user: newUser._id,
      crud: newCrud._id,
      shipment: newShipment._id,
      paymentController: newPaymentController._id,
    });
  
    
    // Update user with the new crud, shipment, upload, and paymentController
    newUser.cruds.push(newCrud._id);
    newUser.shipments.push(newShipment._id);
    newUser.paymentcontrollers.push(newPaymentController._id);
    newUser.uploads.push(newUpload._id);
    await newUser.save();

    res.send('User, Crud, Shipment, Upload, and PaymentController created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }

});
//   let newUser;
//   try {
//     const existingUser = await User.findOne({ companyname: 'snvsolutions' });
 
//     if (existingUser) {
//       existingUser.name = 'newName';
//       await existingUser.save();
//     } else {
//       newUser = await User.create({
//         name: 'deepika',
//         email: 'deepu@gmail.com',
//         mobile: 9899987679,
//         password: 'deepu',
//         companyname: 'snvsolutions',
//       });
//     }
 
   
//       const newCrud = await Crud.create({
//         order: 'lemon',
//         date: '26/08/2028',
//         payment: 7890,
//         product: 'items',
//         customer: 'revathi',
//         phone: 8887678879,
//         weight: '7.6',
//         user: newUser._id,
//       });
 
//       const newShipment = await Shipment.create({
//         order_Id: 456765,
//         customer_Name: 'swetha',
//         customer_Address: 'nizampet',
//         billing_Num: '876678',
//         pickup_loc: 'ananatapur',
//         pin_Code: 515401,
//         shipping_Date: '18/09/2022',
//         user: newUser._id,
//         crud: newCrud._id,
//       });
 
//       const newPaymentController = await PaymentController.create({
//         name: 'nikhila',
//         amount: 100,
//         product_name: 'ironbox',
//         description: 'dfgd',
//         user: newUser._id,
//         crud: newCrud._id,
//         shipment: newShipment._id,
//       });
 
//       newUser.cruds.push(newCrud._id);
//       newUser.shipments.push(newShipment._id);
//       newUser.paymentcontrollers.push(newPaymentController._id);
 
//       await newUser.save();
//     }
 
//     res.send('User, Crud, Shipment, and PaymentController created successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message, message: 'Internal Server Error' });
//   }
// });
 
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: 'cruds',
        model: 'Crud',
        select: 'order date payment product customer phone weight',
      })
      .populate({
        path: 'shipments',
        model: 'Shipment',
        select: 'customer_Name customer_Name customer_Address billing_Num pickup_loc pin_Code shipping_Date',
      })
      .populate({
        path: 'paymentcontrollers',
        model: 'PaymentController',
        select: 'name amount product_name description',
      })
      .populate({
        path: 'uploads',  
        model: 'Upload',  
        select: 'file',
      });
     
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
 
 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
