var jwt = require('jsonwebtoken');

module.exports = {
  verifyUser: async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if(!token) {
        return res.status(401).json({error: "token required"});
      }
      let payLoad = jwt.verify(token, process.env.SECRET);
      req.user = payLoad;
      next();
    } catch (error) {
      return next(error);
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if(!token) {
        return res.status(401).json({error: "token required"});
      }
      let payLoad = jwt.verify(token, process.env.SECRET);
      if(payLoad.isAdmin) {
        req.user = payLoad;
        return next();
      } else {
        return res.status(401).json({error: "Only Admin have authority"});
      }
    } catch (error) {
      return next(error);
    }
  }
}