var mongoose = require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  bio: {type:String},
  image: {type:String},
  followersCount:{type:Number, default:0},
  password: {type:String, required:true, minlength:3},
  following:[{type:Schema.Types.ObjectId, ref:"User"}],
  followers:[{type:Schema.Types.ObjectId, ref:"User"}],
  favorite:[{type:Schema.Types.ObjectId, ref:"Question"}],
  questions:[{type:Schema.Types.ObjectId, ref:"Question"}],
  anwsers:[{type:Schema.Types.ObjectId, ref:"Answer"}],
  isAdmin:{type:Boolean, default:false},
  isBlocked:{type:Boolean, default:false}
},{timestamps:true});

userSchema.pre("save", async function (next) {
  if(this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifypassword = async function (password) {
  try {
    let result = await bcrypt.compare(this.password, password);
    return result;
  } catch (error) {
    return error;
  }
}

userSchema.methods.signToken = async function () {
  try {
    let payLoad = {id:this.id, email:this.email, isAdmin:this.isAdmin};
    let token = jwt.sign(payLoad, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
}

userSchema.methods.userJSON = async function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  }
}

userSchema.methods.userProfile = async function (user) {
  let profile = {
    name: this.name,
    image: this.image,
    bio: this.bio,
    isBlocked:this.isBlocked
  }
  if(this.following) {
    let result = this.following.find((follow) => {
      let str = follow.toString();
      return str == user.id
    });
    if(result) {
      profile.isfollows = true;
      return profile
    } else {
      profile.isfollows = false;
      return profile
    }
  } else {
    profile.isfollows = false;
    return profile;
  }
}

let User = mongoose.model("User", userSchema);

module.exports = User;