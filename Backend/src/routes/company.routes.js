import express from "express";
import { executeQuery } from "../db/index.js";

const router = express.Router();

router.get("/getcompany", async (req, res) => {
  try {
    const company = await executeQuery("SELECT * FROM MstComp");
    if (!company) {
      return res.status(404).json({ message: "No company found" });
    }
    res.status(200).json({ data: company });
  } catch (error) {
    console.log("====================================");
    console.log(error, "error in company.routes.js");
    console.log("====================================");
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
