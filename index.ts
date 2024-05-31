import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import { Server } from "socket.io";

import router from "./routes/index";
import "./strategies/passport-github";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { getAllIssues } from "services/issues.service";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: false }));
if (process.env.SESSION_SECRET) {
  app.use(
    session({
      name: "errorease-cookies",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
      },
    }),
  );
} else {
  throw new Error("Session secret not found, please check your environment variables");
}
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", router);

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  socket.emit("test", "test updated it");
});

httpServer.listen(process.env.PORT || 3000, () => { });
