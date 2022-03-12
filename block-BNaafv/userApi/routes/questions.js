var express = require('express');
var router = express.Router();
let User = require("../models/User");
let Question = require("../models/Question");
let Answer = require("../models/Answer");
let auth = require("../middlewares/auth");
let slugger = require("slugger");


// Render all questions
router.get('/', async (req, res, next) => {
  let limit = 20;
  let offset = 0;
  if(req.query.limit) {
    limit = req.query.limit;
  }
  if(req.query.offset) {
    offset = req.query.offset;
  }
  try {
    let questions = await Question.find(req.query).limit(limit).skip(offset).sort({ createdAt: -1});
    // let qusJSON = questions.map( async (qus) => {
    //   let a = await questionJSON(qus)
    //    return a;
    // });
    return res.json({questions:[questions]})
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});

// Create new question
router.post('/', auth.verifyUser , async (req, res, next) => {
  try {
    req.body.slug = await slugger(req.body.title);
    req.body.tags = req.body.tags.trim().split(" "); 
    req.body.author = req.user.id
    let question = await Question.create(req.body);
    let user = await User.findByIdAndUpdate(req.user.id, { $push: { questions: question.id}}, {new:true});
    let qusJSON = await questionJSON(question);
    return res.json({question: [qusJSON]});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// Update Question
router.put('/:id', auth.verifyUser, async (req, res, next) => {
  try {
    let questionToUpdate = await Question.findById(req.params.id);
    let authorId = questionToUpdate.author.toString();
    if(authorId == req.user.id) {
      if(req.body.title) {
        req.body.slug = await slugger(req.body.title);
      }
      let question = await Question.findByIdAndUpdate(questionToUpdate.id, req.body, {new:true});
      let qusJSON = await questionJSON(question);
      return res.json({question: [qusJSON]});
    } else {
      return res.status(401).json({error: "Only Auther can update his/her question"});
    }
    return res.json({user: user})
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// Delete question
router.delete('/:slug', auth.verifyUser, async (req, res, next) => {
  try {
    let questionToDelete = await Question.findOne({slug:req.params.slug});
    let authorId = questionToDelete.author.toString();
    if(authorId == req.user.id) {
      let question = await Question.findByIdAndDelete(questionToDelete.id);
      return res.json({result: `${question.slug} Deleted Successfully`});
    } else {
      return res.status(401).json({error: "Only Auther can Delete his/her question"});
    }
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// add Answer
router.post('/:questionId/answers', auth.verifyUser, async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    req.body.questionId = req.params.questionId;
    let answer = await Answer.create(req.body);
    let question = await Question.findByIdAndUpdate(req.params.questionId, { $push: {answersId: answer.id}}, {new:true});
    let ansJSON = await answerJSON(answer);
    return res.json({answer: [ansJSON]});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});

// list all Answers of question
router.get('/:questionId/answers', async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.questionId).populate("answersId");
    return res.json({answers:question.answersId});
  } catch (error) {
    return res.status(400).json({error : [error]});
  }
});


// common functions


async function questionJSON(qus) {
  let question = await Question.findById(qus.id).populate("author");
  return {
    tags: question.tags,
    answers: question.answers,
    id: question.id,
    title: question.title,
    description: question.description,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    slug: question.slug,
    author: {
      id: question.author.id,
      username: question.author.name,
    },
  }
}

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
