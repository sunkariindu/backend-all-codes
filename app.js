
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
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const { MongoClient } = require('mongodb');
const pincodeRoute = require('./routes/pincodeRoute.js');
const port = process.env.PORT || 8080;
 
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin',"*");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

// //Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/datamodaling', {  });
// const db = mongoose.connection;
 
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

//MongoDB Atlas connection using native driver
// const MongoClient = require('mongodb').MongoClient;
const uri ='mongodb+srv://indus:nBWd2YtYgac2tnNC@cluster0.4ou0h8h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {});

//Connect to MongoDB Atlas
client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
    } else {
        console.log('Connected to MongoDB Atlas');
    }
});

//Mongoose setup
mongoose.connect(uri, { });
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
 
 
// var client = new twilio(accountSid,authToken);
var otp =Math.floor(100000+Math.random()*90000);
var userEnteredOTP=''
console.log(otp)
app.post('/sendotp',(req,res)=>{
    client.messages.create({
        body:`hello hi nikhila ${otp}`,
        to:'+919963760431',
        from:'+19203546973'
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

 
// Handle JSON payload
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

// Handle file upload
app.post('/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }
 
    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);
 
    file.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }
 
      res.json({ status: 'success', message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});
 
app.get('/', (req, res) => {
    res.send('welcome to snv');
});
 
 
// Define User Schema
const userSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  mobile: { type: Number, unique: true },
  password: { type: String, required: true },
  companyname: { type: String, unique: true },
  cruds: [{ type: Schema.Types.ObjectId, ref: 'Crud' }],
  shipments: [{ type: Schema.Types.ObjectId, ref: 'Shipment' }],
  paymentcontrollers: [{ type: Schema.Types.ObjectId, ref: 'PaymentController' }],
});
 
const User = mongoose.model('User', userSchema);
 
// Define Crud Schema
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
 
// Define Shipment Schema
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
 
// Define PaymentController Schema
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
 
// Create a new user, crud, shipment, and paymentController associated with each other
app.get('/created', async (req, res) => {
  try {
    const newUser = await User.create({
      name: 'JohnDoe',
      email: 'john@example.com',
      mobile: 9898274754,
      password: 'Indu',
      companyname: 'snvsolutions',
    });
 
    const newCrud = await Crud.create({
      order: 'pizza',
      date: '23/12/2023',
      payment: 50000,
      product: 'fooditems',
      customer: 'manga',
      phone: 986878699,
      weight: '2.5',
      user: newUser._id,
    });
 
    const newShipment = await Shipment.create({
      order_Id: 565565,
      customer_Name: 'mangaaarao',
      customer_Address: 'muluugu',
      billing_Num: '56555',
      pickup_loc: 'waranagal',
      pin_Code: 505136,
      shipping_Date: '23/11/2023',
      user: newUser._id,
      crud: newCrud._id,
    });
 
    const newPaymentController = await PaymentController.create({
      name: 'uyy',
      amount: 100,
      product_name: 'ewyyueywyu',
      description: 'gfdf',
      user: newUser._id,
      crud: newCrud._id,
      shipment: newShipment._id,
    });
 
    // Update user with the new crud, shipment, and paymentController
    newUser.cruds.push(newCrud._id);
    newUser.shipments.push(newShipment._id);
    newUser.paymentcontrollers.push(newPaymentController._id);
    await newUser.save();
 
    res.send('User, Crud, Shipment, and PaymentController created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
 
// Fetch all users with associated cruds, shipments, and paymentControllers
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
      });
 
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
 
app.listen(8080, () => {
  console.log(`Server is running on http://localhost:${8080}`);
});


