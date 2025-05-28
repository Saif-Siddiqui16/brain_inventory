import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  console.log("accessToken",accessToken)
  console.log("refreshToken",refreshToken)

  if (!accessToken) {
    // No access token: try refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "No tokens, please login" });
    }
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Issue new access token
      const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      
      // Set new access token cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false, // set true in prod
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      req.user = payload
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token, please login" });
    }
  }

  // If access token exists, verify it
  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = payload
    next();
  } catch (error) {
    // Access token expired or invalid, try refresh token
    if (!refreshToken) {
      return res.status(401).json({ message: "Token expired, please login" });
    }
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Issue new access token
      const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false, // true in prod
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      req.user = { id: payload.id };
      next();
    } catch {
      return res.status(401).json({ message: "Invalid refresh token, please login" });
    }
  }
};
