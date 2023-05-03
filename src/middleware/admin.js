import jwt from "jsonwebtoken";
const key = process.env.PrivetKey;

export const AdminAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const bearer = authorization.split(" ");
    const token = bearer[1];
    try {
      const data = await jwt.verify(token, key);
      if (data) {
        next();
      } else {
        res.status(401).json({ msg: "Unauthorized" });
      }
    } catch (error) {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } else {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

export const OAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const { email } = req.body;
  try {
    const data = await jwt.verify(authorization, key);
    if (data.validation && data.email === email) {
      next();
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};
