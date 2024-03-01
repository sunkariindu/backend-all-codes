const express = require("express");
const admin_route = express();

const session = require("express-session");


const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));


const auth = require('../middleware/adminAuth');

const adminController = require("../middleware/adminController");


admin_route.post('/ums',adminController.verifyLogin);


admin_route.get('*',(req,res)=>{

    res.redirect('/admin')

})

module.exports =admin_route;