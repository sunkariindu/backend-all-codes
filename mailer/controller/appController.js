const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const appController =require('../controller/appController.js');
const { EMAIL, PASSWORD } = require('dotenv').config()
 
/** send mail from testing account */
 
const signup = async (req,res )=> {
 
    /** testing account */
 
    let testAccount = await nodemailer.createTestAccount();
    // Create reusable transporter object  using the defalut SMTP transport
 
    let  transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port:587,
        secure: false, //true for 465 , false for other ports
        auth:{
           user: 'wilfredo.bartoletti@ethereal.email', //generate ethereal user
           pass:'kXqfQQhdMY1PGrtWCD', //generate ethereal passwpord
 
        },
 
    });
 
  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to:"bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Successfully register with us.", // plain text body
    html: "<b>Successfully register with us.</b>", // html body
 
  };
 
  transporter.sendMail(message).then((info)=>{
 
    return res.status(201)
    .json({
      msg:"you should receive an email",
      info: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
 
    })
     
 
    }).catch(error =>{
      return res.status(500).json({ error })
 
    })
   
    // res.status(201).json("Signup Successfully..!");
 
};
 
/** send mail from real gmail account */
 
const getbill = (req,res)=> {
 
 const userEmail = req.body;
// const user= new User({
// userEmail:req.body.userEmail
// })
// user.save()
let config = {
            service :'gmail',
            auth : {
              user:'indusunkari54@gmail.com',
              pass:'dvxs cmbd ykud orfn'
     
            }
 
          }
    let  transporter = nodemailer.createTransport(config);
 
    let MailGenerator = new Mailgen({
 
        theme:"default",
        product: {
          name:"Mailgen",
          link:'https://mailgen.js/'
 
        }
 
      })
   let response = {
 
                body: {
                  name:"indu sunkari",
                  intro:"Your bill has arrived!",
                  table :{
                    data:[
                           {
                             item : "Nodemailer Stack Book",
                             description:"A Backend application",
                              price:"$10.99",
                            }
                         ]
                    },
                   outro:"Looking forword to do more business"
              }
            }
 
    let mail = MailGenerator.generate(response)
 
    let message = {
        from :'indusunkari54@gmail.com',
        to :'besope2446@konican.com',
        subject :"Place Order",
        text : mail
         
         }
 
     transporter.sendMail(message).then((info)=> {
      return res.status(201).json({
        msg:"you should receive an email"
       
      })
 
      }).catch(error =>{
        return res.status(500).json({error})
 
      })
        // res.status(201).json("GetBill Successfully..!");
}
 
module.exports = {
  signup,
  getbill
}
 
 