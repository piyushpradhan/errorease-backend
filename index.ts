import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";

import router from "./routes/index";
import "./strategies/passport-github";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
if (process.env.SESSION_SECRET) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        sameSite: false,
      },
    }),
  );
} else {
  throw new Error("Session secret not found, please check your environment variables");
}
app.use(cookieParser());
app.use(cors({
  allowedHeaders: "*",
  origin: "*",
  credentials: true
}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  //   console.log(`Server is running on port ${process.env.PORT}`);
});
