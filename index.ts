import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";

import router from "./routes/index";
import "./strategies/passport-github";

dotenv.config();

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'nothing', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// Routes
app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  //   console.log(`Server is running on port ${process.env.PORT}`);
});
