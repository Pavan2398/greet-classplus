import jwt from 'jsonwebtoken';

const generateTokens = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  // Set Refresh Token as HTTP-Only Cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true, // Always true for cross-site compatibility
    sameSite: 'none', // Always 'none' for Vercel + Render compatibility
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    partitioned: true // Better support for cross-site cookies in modern browsers
  });

  return { accessToken };
};

export default generateTokens;
