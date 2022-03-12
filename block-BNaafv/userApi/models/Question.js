var mongoose = require("mongoose");
const bcrypt = require('bcrypt');
let slugger = require("slugger");

let Schema = mongoose.Schema;

let questionSchema = new Schema({
  title: {type:String, required:true},
  slug: {type:String, required:true},
  description: {type:String},
  tags: [{type:String}],
  author:{type:Schema.Types.ObjectId, ref:"User", required:true},
  favorited:[{type:Schema.Types.ObjectId, ref:"User"}],
  answersId:[{type:Schema.Types.ObjectId, ref:"Answer"}]
},{timestamps:true});

let Question = mongoose.model("Question", questionSchema);

module.exports = Question;