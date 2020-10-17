const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){
    //get token from header
    const token = req.header('x-auth-token');
    //check token
    if(!token){
        return res.status(401).json({ msg:"no token provide" });
    }

    try {
        const decoded = jwt.verify(token,process.env.jwtSecret);
        req.user = decoded.user
        next();
    } catch (error) {
        return res.status(401).json({ msg:"token is not valid" });
    }
}