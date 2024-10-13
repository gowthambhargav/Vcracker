import express from "express";
import {
  beginTransaction,
  commitTransaction,
  executeQuery,
  rollbackTransaction,
} from "../db/index.js";
import { TYPES } from "tedious";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await executeQuery(
      `SELECT 
                ITEMID,
                ITEMNAME,
                ITEMCODEClean,
                UNITPRICE AS ItemPrice,
                uomid
            FROM mstitem WHERE showinmob='Y' ORDER BY ITEMNAME`
    );
    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }
    res.status(200).json({ length: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js getitems");
    console.log("====================================");
  }
});

router.post("/sync", async (req, res) => {
  try {
    console.log("====================================");
    console.log(req.body, "req.body.CartItems");
    console.log("====================================");

    const cartItems = req.body;

    for (const cart of cartItems) {
      try {
        // Insert into TrnHdrINV
        const insertHdrQuery = `
          INSERT INTO TrnHdrINV (
            INVNO, Prefix, PrintINVNO, INVDate, CUSTID, 
            Authorised, AuthBy, AuthOn, LOCID, ChangedBy, ChangedOn, Cancelled, 
            AddedBy, AddedOn, CRPERIOD, GRSAMT, INVTIME, USERNAME, 
            CGSTPER, CGSTAMT, SGSTPER, SGSTAMT, IGSTPER, IGSTAMT, 
            BTOTAMT, QDISCPER, QDISCAMT, SUBTOTAMT, VATPER, VATAMT, 
            ADVAMT, PCKCHGAMT, OTHAMT, INVVALUE, REF, CASES, BUNDLRPKTS, 
            REMARKS, SP, CASHAMT, CARDAMT, PAYTMAMT, PAYTMNO, ONLINEAMT, ONLINEAMTDET
          ) VALUES (
            '${cart.SerialNo}', ' ', '12345', '${cart.cartDate}', ${cart.custId},
            'Y', '1', GETDATE(), 1, 'ChangedBy', GETDATE(), 'N',
            'AddedBy', GETDATE(), 30, ${cart.cartTotal}, 'INVTIME', 'USERNAME',
            5, 10, 5, 10, 5, 10,
            ${cart.cartTotal}, 5, 10, ${cart.cartTotal}, 5, 10,
            0, 0, 0, ${parseFloat(cart.cartTotal).toFixed(2)}, ' ', 0, 0,
            ' ', '${cart.salesPerson}', 0, 0, 0, ' ', 0, ' '
          );
        `;

        await executeQuery(insertHdrQuery);

        // Retrieve the latest INVID
        const latestInvidQuery = "SELECT MAX(INVID) as INVID FROM TrnHdrINV";
        const latestInvidResult = await executeQuery(latestInvidQuery);
        const latestInvid = latestInvidResult[0].INVID;
        console.log("====================================");
        console.log(latestInvid, "latestInvid");
        console.log("====================================");

        // Insert into TrndtlINV
        const cartItemsArray = JSON.parse(cart.CartItems);
        for (let i = 0; i < cartItemsArray.length; i++) {
          const item = cartItemsArray[i];
          console.log(item,"item");
          
          const insertDtlQuery = `
            INSERT INTO TrndtlINV (
              INVID, SlNo, ITEMID, UOMID, ItemSlNO, ShortClosed, 
              StkQty, INVQty, INVRate, INVAmt
            ) VALUES (
              ${latestInvid}, ${i + 1}, ${item.ITEMID}, ${item.uomid}, ${i + 1}, 'N',
              ${item.quantity}, ${item.quantity}, ${item.ItemPrice}, ${item.quantity * item.ItemPrice}
            );
          `;
          await executeQuery(insertDtlQuery);
        }

        // Verify the insertion
        const verifyQuery = `
          SELECT COUNT(*) as count
          FROM TrndtlINV
          WHERE INVID = ${latestInvid}
        `;
        const verifyResult = await executeQuery(verifyQuery);
        const insertedCount = verifyResult[0].count;

        if (insertedCount !== cartItemsArray.length) {
          throw new Error(`Verification failed: Expected ${cartItemsArray.length} records, but found ${insertedCount}`);
        }

      } catch (err) {
        console.error("Error processing cart item:", err);
        return res
          .status(500)
          .json({ message: "Error processing cart item", error: err.message });
      }
    }

    res.json({ message: "Sync completed successfully" });
  } catch (err) {
    console.error("Error in /sync route", err);
    res.status(500).json({ message: "Error syncing data", error: err.message });
  }
});

router.get("/getall", async (req, res) => {
  try {
    // Get the data from the TrnHdrINV ordered by INVNO in descending order
    const items = await executeQuery(`
      SELECT 
        INVNO,
        INVDate,
        CUSTID,
        GRSAMT,
        INVVALUE,
        SP,
        CASHAMT,
        CARDAMT,
        PAYTMAMT,
        ONLINEAMT,
        ONLINEAMTDET
      FROM TrnHdrINV 
      ORDER BY INVNO DESC
    `);

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({ length: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js getall");
    console.log("====================================");
  }
});

router.get("/gettrndtl", async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT TOP 50
        *
      FROM TrnHdrINV 
      ORDER BY INVID DESC
    `);

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({ length: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js gettrndtl");
    console.log("====================================");
  }
});

// get the details of the tables of trnhdrinv and trndtlinv
router.get("/getdetails", async (req, res) => {
  try {
    // Get metadata for TrnHdrINV
    const hdrMetadata = await executeQuery(`
      SELECT 
        COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'TrnHdrINV'
    `);

    // Get metadata for TrndtlINV
    const dtlMetadata = await executeQuery(`
      SELECT 
        COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'TrndtlINV'
    `);

    // Get data from TrnHdrINV
    const items = await executeQuery(`
      SELECT 
        *
      FROM TrnHdrINV 
      ORDER BY INVNO DESC
    `);

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    // Get data from TrndtlINV
    const items2 = await executeQuery(`
      SELECT 
        *
      FROM TrndtlINV 
      ORDER BY SlNo DESC
    `);

    if (!items2) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({
      hdrMetadata,
      dtlMetadata,
      hdrData: { length: items.length, data: items },
      dtlData: { length: items2.length, data: items2 },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js getdetails");
    console.log("====================================");
  }
});

router.get("/getdtl", async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT TOP 50
        *
      FROM TrndtlINV 
      ORDER BY SlNo DESC
    `);

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({ length: items.length, data: items });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log("====================================");
    console.log(error, "error in items.routes.js getdtl");
    console.log("====================================");
  }
});





export default router;
