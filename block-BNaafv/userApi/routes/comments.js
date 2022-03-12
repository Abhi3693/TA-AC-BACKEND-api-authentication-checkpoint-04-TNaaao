var express = require('express');
var router = express.Router();
let User = require("../models/User");
let Question = require("../models/Question");
let Answer = require("../models/Answer");
let auth = require("../middlewares/auth");
let Comment = require("../models/Comment");

// add Comment
router.post('/:ansId/comment', auth.verifyUser ,async (req, res, next) => {
  try {
    let ans1 = await Answer.findById(req.params.ansId);
    req.body.answerId = ans1.id;
    req.body.author = req.user.id;
    let comment = await Comment.create(req.body);
    let answer = await Answer.findByIdAndUpdate(req.params.ansId, { $push : { commentsId: comment.id }}, {new:true});
    let ansJSON = await answerJSON(answer);
    return res.json({answer: [ansJSON]});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});

// delete comment
router.delete('/:commentId', auth.verifyUser ,async (req, res, next) => {
  try {
    let commentToDelete = await Comment.findById(req.params.id);
    let autherId = commentToDelete.author.toString();
    if(autherId == req.user.id) {
      let comment = await Comment.findByIdAndDelete(req.params.id);
      let answer = await Answer.findByIdAndUpdate(comment.answerId, { $pull: { commentId : comment.id}})
      return res.json({comment:["Commment deleed successfully"]});
    } else {
      return res.status(401).json({error: "Only Auther can Delete his/her comment"});

    }

  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});



async function answerJSON(ans) {
  let answer = await Answer.findById(ans.id).populate("author");
  return {
    text: answer.text,
    questionId: answer.questionId,
    id: answer.id,
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
    author: {
      id: answer.author.id,
      username: answer.author.name,
    },
  }
}



module.exports = router;
