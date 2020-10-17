var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require('express-validator');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a users');
});

router.post('/create', [
  check('name','Name is required').not().isEmpty(),
  //check('street_address','Street address is required').not().isEmpty(),
  check('email','please include valid email').isEmail(),
  check('password','password must be minimum 6 character long').isLength({ min:6 })
], async(req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { 
    name,email,password,
    //street_address 
  } = req.body;
  try {
    let user = await User.findOne({email:email})
    if(user){
      return res.status(400).json({errors:[{msg:"user already exits"}]});
    }
    const avatar = gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
    })
    user = new User({
      name,
      email,
      password,
      avatar,
      //street_address
    })
    const salt = await bcrypt.genSalt(10) 
    user.password = bcrypt.hashSync(password, salt)
    await user.save()
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
