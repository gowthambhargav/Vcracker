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
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/mstcust", async (req, res) => {
  try {
    const user = await executeQuery(
      "SELECT CUSTCODE,CustCodeClean ,CustName,CUSTID FROM mstcust"
    );
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log("====================================");
    console.log(error, "error in user.routes.js mstcust");
    console.log("====================================");
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
