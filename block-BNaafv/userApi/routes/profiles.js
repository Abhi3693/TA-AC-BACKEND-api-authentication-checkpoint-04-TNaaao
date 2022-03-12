var express = require('express');
var router = express.Router();
let User = require("../models/User");
let Question = require("../models/Question");
let Answer = require("../models/Answer");
let auth = require("../middlewares/auth");


/* GET users listing. */

// get profile
router.get('/:username', auth.verifyUser , async (req, res, next) => {
  try {
    let user = await User.findOne({name:req.params.username});
    return res.json({user: await user.userProfile(req.user)});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// Update user
router.put('/:username', auth.verifyUser ,async (req, res, next) => {
  try {
    let usertoUpdate = await User.findOne({name:req.params.username});
    if(!usertoUpdate) {
      return res.status(401).json({error: "Enter registered user to update"});
    }
    let userId = usertoUpdate.id.toString();
    if(userId == req.user.id) {
      let user = await User.findByIdAndUpdate(usertoUpdate.id, req.body, {new:true});
      return res.json({user: await user.userProfile()})
    } else {
      return res.status(401).json({error: "Only Auther can update his/her profile"});
    }
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// follow user
router.post('/:username/follow', auth.verifyUser, async (req, res, next) => {
  try {
    let usertoFollow = await User.findOneAndUpdate({name:req.params.username}, { $push: {followers: req.user.id }, $inc: { followersCount: 1 }}, {new:true});
    let loggedInUser = await User.findByIdAndUpdate(req.user.id, { $push: { following: req.user.id }}, {new:true});
    return res.json({profile: await usertoFollow.userProfile()});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});

// block user
router.post('/:username/block', auth.isAdmin, async (req, res, next) => {
  try {
    let usertoBlock = await User.findOneAndUpdate({name:req.params.username}, { isBlocked: true}, {new:true});
    return res.json({profile: await usertoBlock.userProfile()});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});

// Unblock user
router.delete('/:username/block', auth.isAdmin, async (req, res, next) => {
  try {
    let usertoBlock = await User.findOneAndUpdate({name:req.params.username}, { isBlocked: false}, {new:true});
    return res.json({profile: await usertoBlock.userProfile()});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// unfollow user
router.delete('/:username/follow', auth.verifyUser, async (req, res, next) => {
  try {
    let usertoUnFollow = await User.findOneAndUpdate({name:req.params.username}, { $pull: {followers: req.user.id }, $inc: { followersCount: -1 }}, {new:true});
    let loggedInUser = await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.user.id }}, {new:true});
    return res.json({profile: await usertoUnFollow.userProfile()});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});



module.exports = router;
