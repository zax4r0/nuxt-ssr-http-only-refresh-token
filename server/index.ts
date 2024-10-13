import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import pino from "pino";
import pretty from "pino-pretty";

const app = express();
const PORT = 3000;

const logger = pino(pretty());

// Hardcoded secrets and expiration times
const JWT_SECRET = "your_hardcoded_jwt_secret_key";
const REFRESH_TOKEN_SECRET = "your_hardcoded_refresh_token_secret_key";
const JWT_EXPIRES_IN = "1m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const ACCECS_COOKIE_EXPIRES_IN = 60 * 1000;
const REFRESH_COOKIE_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;
const isSeure = false;

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use(pinoHttp({ logger }));

interface User {
  id: number;
  username: string;
  password: string;
}

interface JwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Simulated database for users
const usersDB = {
  users: [{ id: 1, username: "test@test.com", password: "test@test.com" }],
};

const generateAccessToken = (user: JwtPayload): string => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (user: JwtPayload): string => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  logger.info({ username }, "Login attempt");

  const user = usersDB.users.find(
    (u: User) => u.username === username && u.password === password
  );

  if (!user) {
    logger.warn({ username }, "Invalid credentials");
    res.status(401).send("Invalid credentials");
    return;
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSeure,
    sameSite: "lax",
    maxAge: REFRESH_COOKIE_EXPIRES_IN,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isSeure,
    sameSite: "lax",
    maxAge: ACCECS_COOKIE_EXPIRES_IN, // 10 minutes
  });

  logger.info({ userId: user.id }, "User logged in successfully");
  res.json({ accessToken, refreshToken });
});

// Middleware to authenticate access tokens
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;

  logger.debug("Authenticating access token");

  jwt.verify(accessToken, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      logger.warn("Access token expired or invalid, attempting refresh");

      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.sendStatus(403);
      }

      // Verify the refresh token
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
          logger.warn("Refresh token invalid");
          return res.sendStatus(403);
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken({
          id: (user as JwtPayload).id,
        });
        const newRefreshToken = generateRefreshToken({
          id: (user as JwtPayload).id,
        });

        // Update the refresh token cookies
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: isSeure,
          sameSite: "lax",
          maxAge: REFRESH_COOKIE_EXPIRES_IN,
        });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: isSeure,
          sameSite: "lax",
          maxAge: ACCECS_COOKIE_EXPIRES_IN,
        });

        logger.info({ userId: (user as JwtPayload).id }, "Tokens refreshed");
        return res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    } else {
      req.user = user as JwtPayload;
      logger.info({ userId: req.user.id }, "User authenticated");
      next();
    }
  });
};

// Protected route
app.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.json({ message: "This is protected data", user: req.user });
});

// Logout route to clear refresh token
app.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.sendStatus(204);
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
