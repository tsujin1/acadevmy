import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign(
    { userId },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

export default generateToken;