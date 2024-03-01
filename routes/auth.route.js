

const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
 
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
 
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: hashedPassword,
            companyname: req.body.companyname,
        });
 
        await user.save();
        res.json({ success: true, message: 'ACCOUNT CREATED SUCCESSFULLY' });
    } catch (err) {
        if (err.code === 11000) {
            return res.json({ success: false, message: 'Email Already Exists' });
        }
        console.error(err);
        res.json({ success: false, message: 'Authentication failed' });
    }
});
 
 
router.post('/login',(req,res)=>{
   
    User.find({email:req.body.email}).exec().then((result)=>{
        if(result.length<1){
         return res.json({success:false,message:'User not found'})
        }
        const user = result[0];
        bcrypt.compare(req.body.password,user.password,(err,ret)=>{
            if(ret){
                const payload={
                  userId:user._id
                }
                const token=jwt.sign(payload,"webBatch")
                return res.json({success:true,token:token,message:"login successfully"})
               
            }else{
                return res.json({success:false,message:"login failed"})
            }
        })
    }).catch(err=>{
        res.json({success:false,message:'Authentication failed'})
    })
});
 
router.get('/profile', checkAuth, (req, res) => {
//     const userId=req.userData.userId;
//     User.findById(userId).exec().then((result)=>{
//         res.json({success:true,data:result})
// }).then((err)=>{
//     res.json({success:false,message:"server error"})
// })
const userId = req.userId;
console.log(req.userId)
// console.log(res)

User.findById(userId)
    .exec()
    .then((result) => {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    })
    .catch((err) => {
        console.error(err);
res.status(500).json({ success: false, message: "Server error" });
    });
   
});

router.get('/success', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users, message: 'Authentication login successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});
 
 
router.get("/api/getByuserid/:userId", async (req, res) => {
    const userId = req.params.userId;
 
    try {
        const data = await User.findById(userId).exec();
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});
 
// router.get("/api/getByuserid",(req,res)=>{
//     const userId = req.params.userId;
//     User.findOne(userId,(err,data)=>{
//         if (err){
//             console.log(err);
//         }
//         else{
//             res.send(data)
//         }
//     })
 
// })
 
module.exports = router;