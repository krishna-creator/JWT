const jwt = require("jsonwebtoken");
const url = require("url");

const verify = (req, res, next) => {
  const token = url.parse(req.url, true).query;
  if (!token) {
    return res.status(401).send("you are not authorized");
  }
  jwt.verify(token.token, process.env.TOKEN_SECERT, (err, verified) => {
    if (err) {
      return res.status(403).send("you are not authorized");
    }
    req.user = verified;
    console.log(verified);
    next();
  });
};

module.exports = verify;
