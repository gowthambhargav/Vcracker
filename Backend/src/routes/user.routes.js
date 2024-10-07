import express from "express";
import { executeQuery } from "../db/index.js";

const router = express.Router();

router.get("/getuser", async (req, res) => {
  try {
    const user = await executeQuery(
      "SELECT UserCode ,UserID ,LoginPwd, UserName FROM mstuser"
    );
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log("====================================");
    console.log(error, "error in user.routes.js");
    console.log("====================================");
  }
});

export default router;
