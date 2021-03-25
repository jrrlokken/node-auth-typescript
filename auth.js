const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // grab the token from the auth header
    const token = await req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM-TOKEN');
    const user = decodedToken;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error('Invalid request'),
    });
  }
}