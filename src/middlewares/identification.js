import jwt from 'jsonwebtoken';

export async function identification(req, res, next) {
  let token;

  // if (req.headers.client === 'not-browser') {
  //   token = req.headers.authorization;
  // } else {
  //   token = req.cookies['Authorization'];
  // }

  console.log('Received Headers:', req.headers);
  token = req.headers.authorization || req.cookies.Authorization; //use while using swagger

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized...authentication token missing',
    });
  }

  try {
    const userToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
    if (jwtVerified) {
      req.user = jwtVerified;
      return next();
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res
        .status(401)
        .json({ success: false, message: 'Please signup/login' });
    }
  }
}
