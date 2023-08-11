import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import pepsRouter from "./routes/peps.js";
config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/peps", pepsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
