var express = require('express');
var router = express.Router();
let Question = require("../models/Question");


/* GET home page. */
router.get('/tags', async function(req, res, next) {
  let tags = await Question.find({}).distinct("tags");
  res.json({tags:[tags]});
});

module.exports = router;
