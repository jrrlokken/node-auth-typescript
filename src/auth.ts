import * as jwt from 'jsonwebtoken';

const auth = async (req: Request, res: Response, next: any) => {
  try {
    // grab the token from the auth header
    // @ts-ignore
    const token = await req.headers.authorization.split(' ')[1];
    // @ts-ignore
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodedToken;
    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    // @ts-ignore
    res.status(401).json({
      error: new Error('Invalid request')
    });
  }
};

export default auth;
