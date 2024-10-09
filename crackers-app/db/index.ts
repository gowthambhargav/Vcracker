import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
    const db = await SQLite.openDatabaseAsync('vCracker');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstUser (
      UserCode TEXT NOT NULL,
      UserID INTEGER ,
      LoginPwd TEXT NOT NULL,
      UserName TEXT NOT NULL
    );
  `);

    // Create MstCust table
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MstCust (
          CUSTCODE TEXT NOT NULL,
          CustCodeClean TEXT NOT NULL,
          CustName TEXT NOT NULL,
          CUSTID INTEGER
        );
      `);

      // Create MstCompany table
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MstCompany (
          CompID INTEGER NOT NULL,
          CompName TEXT NOT NULL,
          Address1 TEXT,
          Address2 TEXT,
          Address3 TEXT,
          Custcode TEXT,
          EMAIL TEXT,
          MOBNO TEXT,
          WEB TEXT,
          GSTNO TEXT,
          CompLoc TEXT,
          CINNO TEXT,
          TELNO TEXT
        );
      `);
      // create salesPerson table
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MstSalesPerson (
          SP TEXT
        );
        `);
      // create MstItem table
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS MstItem (
          ITEMID INTEGER,
          ITEMNAME TEXT,
          ITEMCODEClean TEXT,
          ItemPrice INTEGER
        );
        `);
}

export const insertToMstUser = async (userCode: string, userId: number, loginPwd: string, userName: string) => {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
      await  initializeDatabase();
        await db.execAsync(`
            INSERT INTO MstUser (UserCode, UserID, LoginPwd, UserName) VALUES ('${userCode}', ${userId}, '${loginPwd}', '${userName}');
        `);
        console.log("Inserted");
    } catch (error) {
        console.log('====================================');
        console.log('Error in insertToMstUser', error);
        console.log('====================================');
    }
} 


export const insertToMstCust = async (custCode: string, custCodeClean: string, custName: string, custId: number) => {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            INSERT INTO MstCust (CUSTCODE, CustCodeClean, CustName, CUSTID) VALUES ('${custCode}', '${custCodeClean}', '${custName}', ${custId});
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in insertToMstCust', error);
        console.log('====================================');
    }
}


export const getMstUser = async () => {
    try {
        const query = 'SELECT * FROM MstUser';
        const db = await SQLite.openDatabaseAsync('vCracker');
        const result = await db.getAllAsync(query);
        return result;
    } catch (error) {
        console.log('====================================');
        console.log('Error in getMstUser', error);
        console.log('====================================');
    }
}


export const ValidateUser = async (username: string, password: string) => {
  await initializeDatabase();
  try {
    const trimmedUsername = username.trim().toLowerCase();
    const db = await SQLite.openDatabaseAsync('vCracker');

    const user = await db.getFirstAsync(`SELECT * FROM MstUser WHERE LOWER(UserCode) = '${trimmedUsername}'`);
    // console.log('User found:', user); // Debugging
    if (!user) {
      alert('User not found');
      return null;
    }

    const query = `SELECT * FROM MstUser WHERE LOWER(UserCode) = '${trimmedUsername}' AND LoginPwd = '${password}'`;
    const result = await db.getFirstAsync(query);
    // console.log('Validation result:', result); // Debugging
    if (!result) {
      alert('Invalid password');
      return null;
    }

    return result;
  } catch (error) {
    console.log('Error in ValidateUser', error);
  }
};



export const insertToMstCompany = async (compId: number, compName: string, address1: string, address2: string, address3: string, custCode: string, email: string, mobNo: string, web: string, gstNo: string, compLoc: string, cinNo: string, telNo: string) => {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            INSERT INTO MstCompany (CompID, CompName, Address1, Address2, Address3, Custcode, EMAIL, MOBNO, WEB, GSTNO, CompLoc, CINNO, TELNO) VALUES (${compId}, '${compName}', '${address1}', '${address2}', '${address3}', '${custCode}', '${email}', '${mobNo}', '${web}', '${gstNo}', '${compLoc}', '${cinNo}', '${telNo}');
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in insertToMstCompany', error);
        console.log('====================================');
    }
}



export const truncateMstCompany = async ()=>{
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            DELETE FROM MstCompany;
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in truncateMstCompany', error);
        console.log('====================================');
    }
}


export const insertMstCust = async (custCode: string, custCodeClean: string, custName: string, custId: number) => {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            INSERT INTO MstCust (CUSTCODE, CustCodeClean, CustName, CUSTID) VALUES ('${custCode}', '${custCodeClean}', '${custName}', ${custId});
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in insertMstCust', error);
        console.log('====================================');
    }
}

export const truncateMstCust = async ()=>{
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            DELETE FROM MstCust;
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in truncateMstCust', error);
        console.log('====================================');
    }
}




export const insertMstItem = async (itemId: number, itemName: string, itemCodeClean: string, itemPrice: number) => {
  await truncateMstItem();
  await initializeDatabase();
  try {
    const db = SQLite.openDatabaseSync('vCracker');
    
    await db.execAsync(`
      INSERT INTO MstItem (ITEMID, ITEMNAME, ITEMCODEClean, ItemPrice) VALUES (${itemId}, '${itemName}', '${itemCodeClean}', ${itemPrice});
    `);
  } catch (error) {
    console.log('====================================');
    console.log('Error in insertMstItem', error);
    console.log('====================================');
  }
};

export const truncateMstItem = async ()=>{
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            DELETE FROM MstItem;
        `);
        console.log('====================================');
        console.log('MstItem Truncated');
        console.log('====================================');
    } catch (error) {
        console.log('====================================');
        console.log('Error in truncateMstItem', error);
        console.log('====================================');
    }
}

export const getMstItem = async () => {
    try {
        const query = 'SELECT * FROM MstItem';
        const db = await SQLite.openDatabaseAsync('vCracker');
        const result = await db.getAllAsync(query);
        return result;
    } catch (error) {
        console.log('====================================');
        console.log('Error in getMstItem', error);
        console.log('====================================');
    }
}



