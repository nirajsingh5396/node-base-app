const jwt = require('jsonwebtoken');

  const verifyToken = (req, res, next) => {
  const authToken = req.header('auth-token');
  if (!authToken) return res.status(401).send('Access Denied');

  //verifyToken
  try {
    const verified = jwt.verify(authToken, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

module.exports = verifyToken;