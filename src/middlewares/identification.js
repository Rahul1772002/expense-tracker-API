import jwt from 'jsonwebtoken';

export async function identification(req, res, next) {
  let token;

  if (req.headers.client === 'not-browser') {
    token = req.headers.authorization;
  } else {
    token = req.cookies['Authorization'];
  }

  if (!token) {
    res.json(402).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const userToken = token.split(' ')[1];
    const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
    if (jwtVerified) {
      req.user = jwtVerified;
      next();
    } else {
      console.log('Could not verify token');
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Please signup/login' });
  }
}
