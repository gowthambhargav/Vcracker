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

router.get("/getsp", async (req, res) => {
  try {
    const sp = await executeQuery(
      "SELECT DISTINCT SP FROM trnhdrinv WHERE SP IS NOT NULL AND SP <> ''"
    );
    if (!sp || sp.length === 0) {
      return res.status(404).json({ message: "No sp found" });
    }
    res.status(200).json({ data: sp });
  } catch (error) {
    console.log("====================================");
    console.log(error, "error in user.routes.js getsp");
    console.log("====================================");
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/getdeviceid", async (req, res) => {
  const selectQuery = "SELECT TOP 1 DevID FROM mstdevice ORDER BY DevID DESC";
  try {
    const result = await executeQuery(selectQuery);
    let newDevID;

    if (result.length === 0) {
      newDevID = "01";
    } else {
      const lastDevID = parseInt(result[0].DevID, 10);
      newDevID = (lastDevID + 1).toString().padStart(2, "0");
    }

    const insertQuery = `INSERT INTO mstdevice (DevID) VALUES ('${newDevID}')`;
    await executeQuery(insertQuery);

    res.status(200).send({ data: newDevID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
