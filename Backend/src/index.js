import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();

app.use(cors());
app.use(morgan("dev"));
dotenv.config();
app.use(express.json({ inflate: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// import router
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/items.routes.js";
import companyRouter from "./routes/company.routes.js";
// use router
app.use("/api", userRouter, companyRouter);
app.use("/api/items", itemRouter);

app.listen(3000, () => {
  console.log("Server is running on", "http://localhost:3000");
});
