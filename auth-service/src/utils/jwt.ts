import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  if (!config.JWT_REFRESH) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, config.JWT_REFRESH, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string) => {
  try {
    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, config.JWT_SECRET) as { id: string; role: string };
  } catch (error) {
    console.log(error);
    throw new Error("Token verification failed");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    if (!config.JWT_REFRESH) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, config.JWT_REFRESH) as {
      id: string;
      role: string;
    };
  } catch (error) {
    console.log(error);
    throw new Error("Token verification failed");
  }
};
