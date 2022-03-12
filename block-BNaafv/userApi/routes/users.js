var express = require('express');
var router = express.Router();
let User = require("../models/User");
let Question = require("../models/Question");
let Answer = require("../models/Answer");
let auth = require("../middlewares/auth");

/* GET users listing. */

// register new user
router.post('/', async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await user.signToken();
    return res.json({user: await user.userJSON(token)});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// login user
router.post('/login', async (req, res, next) => {
  let { email, password } = req.body;
  if(!email && !password) {
    return res.status(401).json({error: "Email/password required"});
  } else if (!email) {
    return res.status(401).json({error: "Email is required"});
  } else if (!password) {
    return res.status(401).json({error: "Password is required"});
  }

  try {
    let user = await User.findOne({ email:req.body.email });
    if(!user) {
      return res.status(401).json({error: "Enter registerd email"});
    }
    let result = user.verifypassword(password);
    if(!result) {
      return res.status(401).json({error: "Password is incorrect"});
    }
    let token = await user.signToken();
    return res.json({user: await user.userJSON(token)})
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// render Current user
router.get('/current-user', auth.verifyUser ,async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id)
    return res.json({user: await user.userProfile()})
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});





// admins dashboard
router.get('/dashboard', auth.isAdmin ,async (req, res, next) => {
  try {
    return res.json({result: "admin login"})
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});




module.exports = router;
