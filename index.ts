import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import router from "./routes/index";

dotenv.config();

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/api", router);

app.listen(process.env.PORT || 4000, () => {
  //   console.log(`Server is running on port ${process.env.PORT}`);
});
