var express = require('express');
var router = express.Router();
let User = require("../models/User");
let Question = require("../models/Question");
let Answer = require("../models/Answer");
let auth = require("../middlewares/auth");


/* GET users listing. */

// Update answer
router.put('/:ansId', auth.verifyUser, async (req, res, next) => {
  try {
    let ansToUpdate = await Answer.findById(req.params.ansId);
    let ansAuthor = ansToUpdate.author.toString();
    if(ansAuthor == req.user.id) {
      let answer = await Answer.findByIdAndUpdate(req.params.ansId, req.body, {new:true});
      let ansJSON = await answerJSON(answer);
      return res.json({answer: [ansJSON]});
    } else {
      return res.status(401).json({error: "Only Auther can Update his/her Answer"});
    }
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// upvote answer

router.post("/:ansId/vote", auth.verifyUser, async (req, res, next) => {
  try {
    let answer = await Answer.findByIdAndUpdate(req.params.ansId, { $inc: { upVote : 1}}, {new:true});
    let ansJSON = await answerJSON(answer);
    return res.json({answer: [ansJSON]});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
})


// Delete answer
router.delete('/:ansId', auth.verifyUser, async (req, res, next) => {
  try {
    let ansToDelete = await Answer.findById(req.params.ansId);
    let ansAuthor = ansToDelete.author.toString();
    if(ansAuthor == req.user.id) {
      let answer = await Answer.findByIdAndDelete(req.params.ansId);
      return res.json({answer: [`Answer is deleted successfully`]});
    } else {
      return res.status(401).json({error: "Only Auther can Update his/her Answer"});
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
