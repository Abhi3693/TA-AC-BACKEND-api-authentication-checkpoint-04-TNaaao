var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  body: {type:String, required:true},
  author:{type:Schema.Types.ObjectId, ref:"User"},
  upVote:{type:Number, default:0},
  answerId:{type:Schema.Types.ObjectId, ref:"Question"},
},{timestamps:true});



let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;