var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let answerSchema = new Schema({
  text: {type:String, required:true},
  author:{type:Schema.Types.ObjectId, ref:"User"},
  favorited:[{type:Schema.Types.ObjectId, ref:"User"}],
  upVote:{ type:Number, default:0 },
  questionId:{type:Schema.Types.ObjectId, ref:"Answer"},
  commentId:[{type:Schema.Types.ObjectId, ref:"Comment"}]
},{timestamps:true});



let Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;