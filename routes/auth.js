var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/* GET users listing. */
router.get('/', auth, async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    return res.status(200).json(user)
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({errors:error.message})
  }
});

// router.post('/logout', auth, async function(req, res, next) {
//   try {
//     const token = req.header('x-auth-token');
//     if(!token){
//       return res.status(401).json({ msg:"no token provide" });
//     }
    
//     // if(decoded){
//     //   jwt.destroy(token)
//     //   res.status(200).json({ error: false, type : 'success', result : 'Successfully logged out' });
//     // }
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({errors:error.message})
//   }
// });

router.post('/', [
  check('email','please include valid email').isEmail(),
  check('password','password must be minimum 6 character long').exists()
], async(req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email,password } = req.body;
  try {
    let user = await User.findOne({email:email})
    if(!user){
      return res.status(400).json({errors:[{msg:"invalid credentials"}]});
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({errors:[{msg:"invalid credentials"}]});
    }

    const payload = {
      user:{
        id: user.id
      }
    }
    jwt.sign(payload,process.env.jwtSecret,{ expiresIn : 360000 },(err,token)=>{
      if(err) throw(err)
      return res.json({ token })
    })
    // return res.status(200).json({result:"user registered"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
});

module.exports = router;
