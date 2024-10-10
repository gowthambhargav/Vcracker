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
        // Example query to test the connection
        // const dataTest = await executeQuery("SELECT * FROM mstitem");
        // console.log(dataTest);

        // Insert into TrnHdrINV
        const insertHdrQuery = `
          INSERT INTO TrnHdrINV (
            INVNO, Prefix, PrintINVNO, INVDate, INVDateYear, INVDateMonth, CUSTID, PartyName, PartyAdd1, PartyAdd2, PartyAdd3, PartyAdd4, PartyCity, PartyState, PartyPinCode, PartyCountry, PartyCName, PartyCMob, PartyCEmail, PartyCDesig, Authorised, AuthBy, AuthOn, LOCID, ChangedBy, ChangedOn, Cancelled, AddedBy, AddedOn, PartyGSTNO, PartySGSTNO, CRPERIOD, GRSAMT, INVTIME, USERNAME, CGSTPER, CGSTAMT, SGSTPER, SGSTAMT, IGSTPER, IGSTAMT, AMTINWORDS, BTOTAMT, QDISCPER, QDISCAMT, SUBTOTAMT, VATPER, VATAMT, ADVAMT, PCKCHGAMT, OTHAMT, INVVALUE, REF, CASES, BUNDLRPKTS, REMARKS, SP, CASHAMT, CARDAMT, PAYTMAMT, PAYTMNO, ONLINEAMT, ONLINEAMTDET
          ) VALUES (
            @SerialNo, ' ', '12345', @CartDate, @CartYear, @CartMonth, @CUSTID, 'PartyName', 'PartyAdd1', 'PartyAdd2', 'PartyAdd3', 'PartyAdd4', 'PartyCity', 'PartyState', 'PartyPinCode', 'PartyCountry', 'PartyCName', 'PartyCMob', 'PartyCEmail', 'PartyCDesig', 'Y', '1', GETDATE(), 1, 'ChangedBy', GETDATE(), 'N', 'AddedBy', GETDATE(), 'PartyGSTNO', 'PartySGSTNO', 30, @CartTotal, 'INVTIME', 'USERNAME', 5, 10, 5, 10, 5, 10, 'AMTINWORDS', @CartTotal, 5, 10, @CartTotal, 5, 10, 0, 0, 0, 0, @CartTotalFixed, ' ', 0, 0, ' ', @SalesPerson, 0, 0, 0, ' ', 0, ' '
          );
        `;

        await executeQuery(insertHdrQuery, [
          { name: "SerialNo", type: TYPES.Int, value: cart.SerialNo },
          {
            name: "CartDate",
            type: TYPES.DateTime,
            value: new Date(cart.CartDate),
          },
          { name: "CartYear", type: TYPES.Int, value: cart.CartYear },
          { name: "CartMonth", type: TYPES.Int, value: cart.CartMonth },
          { name: "CUSTID", type: TYPES.Int, value: cart.CUSTID },
          { name: "CartTotal", type: TYPES.Decimal, value: cart.CartTotal },
          {
            name: "CartTotalFixed",
            type: TYPES.Decimal,
            value: cart.CartTotal.toFixed(2),
          },
          { name: "SalesPerson", type: TYPES.VarChar, value: cart.SalesPerson },
        ]);

        // Retrieve the latest INVID
        const latestInvidQuery = "SELECT MAX(INVID) as INVID FROM TrnHdrINV";
        const latestInvidResult = await executeQuery(latestInvidQuery);
        const latestInvid = latestInvidResult[0].INVID;
        console.log("====================================");
        console.log(latestInvid);
        console.log("====================================");

        // Insert into TrndtlINV
        const cartItemsArray = JSON.parse(cart.CartItems);
        for (let i = 0; i < cartItemsArray.length; i++) {
          const item = cartItemsArray[i];
          const insertDtlQuery = `
            INSERT INTO TrndtlINV (
              INVID, INVDtlID, SlNo, ITEMID, UOMID, ItemSlNO, ShortClosed, ShortClosedBy, ShortClosedDT, ShortClosedQty, StkQty, INVQty, INVRate, INVAmt, ShortClosedRmks
            ) VALUES (
              @INVID, @INVDtlID, @SlNo, @ITEMID, @UOMID, @ItemSlNO, 'N', NULL, NULL, NULL, NULL, @INVQty, @INVRate, @INVAmt, NULL
            );
          `;
          await executeQuery(insertDtlQuery, [
            { name: "INVID", type: TYPES.Int, value: latestInvid },
            { name: "INVDtlID", type: TYPES.Int, value: i + 1 },
            { name: "SlNo", type: TYPES.Int, value: i + 1 },
            { name: "ITEMID", type: TYPES.Int, value: item.ITEMID },
            { name: "UOMID", type: TYPES.Int, value: item.uomid },
            { name: "ItemSlNO", type: TYPES.Int, value: i + 1 },
            { name: "INVQty", type: TYPES.Decimal, value: item.quantity },
            { name: "INVRate", type: TYPES.Decimal, value: item.ItemPrice },
            {
              name: "INVAmt",
              type: TYPES.Decimal,
              value: item.quantity * item.ItemPrice,
            },
          ]);
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

export default router;
