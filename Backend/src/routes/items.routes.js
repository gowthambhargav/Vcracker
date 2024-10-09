import express from "express";
import { executeQuery } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await executeQuery(
      `SELECT 
                ITEMID,
                ITEMNAME,
                ITEMCODEClean,
                UNITPRICE AS ItemPrice
            FROM mstitem`
    );
    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js getitems");
    console.log("====================================");
  }
});

export default router;
