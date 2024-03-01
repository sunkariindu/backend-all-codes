
const jwt = require('jsonwebtoken');
 
// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         const decode = jwt.verify(token, "webBatch");
//         req.userData = decode;
//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ success: false, message: "Auth failed: Invalid token" });
//     }
// };
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    console.log(token)
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        if(token && token.startsWith("Bearer")){
          let  data= token.split(" ")[1];
            const decoded = jwt.verify(data, 'webBatch',);
            console.log(decoded)
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        console.log(error)
res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = verifyToken;