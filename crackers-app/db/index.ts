import axios from 'axios';
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
          CUSTCODE TEXT ,
          CustCodeClean TEXT,
          CustName TEXT ,
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

export const truncateMstUser = async ()=> {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            DELETE FROM MstUser;
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in truncateMstUser', error);
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



export const insertToMstCompany = async (
  compId: number,
  compName: string,
  address1: string,
  address2: string,
  address3: string,
  custCode: string,
  email: string,
  mobNo: string,
  web: string,
  gstNo: string,
  compLoc: string,
  cinNo: string,
  telNo: string
) => {
  await initializeDatabase();
  try {
    console.log('Inserting company data:', {
      compId,
      compName,
      address1,
      address2,
      address3,
      custCode,
      email,
      mobNo,
      web,
      gstNo,
      compLoc,
      cinNo,
      telNo
    }); // Debugging
  
    const db = await SQLite.openDatabaseAsync('vCracker');
  
    const query = `
      INSERT INTO MstCompany (CompID, CompName, Address1, Address2, Address3, Custcode, EMAIL, MOBNO, WEB, GSTNO, CompLoc, CINNO, TELNO) 
      VALUES (${compId}, '${compName}', '${address1}', '${address2}', '${address3}', '${custCode}', '${email}', '${mobNo}', '${web}', '${gstNo}', '${compLoc}', '${cinNo}', '${telNo}');
    `;
  
    await db.execAsync(query);
  } catch (error) {
    console.log('====================================');
    console.log('Error in insertToMstCompany', error);
    console.log('====================================');
  }
};



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

export const getMstCompany = async () => {
    try {
        const query = 'SELECT * FROM MstCompany';
        const db = await SQLite.openDatabaseAsync('vCracker');
        const result = await db.getAllAsync(query);
        return result;
    } catch (error) {
        console.log('====================================');
        console.log('Error in getMstCompany', error);
        console.log('====================================');
    }
}


export const insertMstCust = async (custCode: string, custCodeClean: string, custName: string, custId: number) => {
  await initializeDatabase();
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

export const getMstCust = async () => {
    try {
        const query = 'SELECT * FROM MstCust';
        const db = await SQLite.openDatabaseAsync('vCracker');
        const result = await db.getAllAsync(query);
        return result;
    } catch (error) {
        console.log('====================================');
        console.log('Error in getMstCust', error);
        console.log('====================================');
    }
}



export const insertMstItem = async (itemId: number, itemName: string, itemCodeClean: string, itemPrice: number) => {
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

export const insertMstSalesPerson = async (sp: string) => {
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            INSERT INTO MstSalesPerson (SP) VALUES ('${sp}');
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in insertMstSalesPerson', error);
        console.log('====================================');
    }
}

export const truncateMstSalesPerson = async ()=>{
    try {
        const db = await SQLite.openDatabaseAsync('vCracker');
        await db.execAsync(`
            DELETE FROM MstSalesPerson;
        `);
    } catch (error) {
        console.log('====================================');
        console.log('Error in truncateMstSalesPerson', error);
        console.log('====================================');
    }
}


export const getMstSalesPerson = async () => {
    try {
        const query = 'SELECT * FROM MstSalesPerson';
        const db = await SQLite.openDatabaseAsync('vCracker');
        const result = await db.getAllAsync(query);
        return result;
    } catch (error) {
        console.log('====================================');
        console.log('Error in getMstSalesPerson', error);
        console.log('====================================');
    }
}

export const GetSyncData = async () => {
  console.log('Starting data synchronization');
  
  try {
    await truncateMstCompany();
    await truncateMstItem();
    await truncateMstCust();
    await truncateMstSalesPerson();
    await truncateMstUser(); // Truncate user table
    console.log('Tables truncated successfully');

    // Fetch and insert items
    const itemsResponse = await axios.get('http://192.168.1.146:3000/api/items');
    const items = itemsResponse.data.data;
    for (const item of items) {
      try {
        await insertMstItem(item.ITEMID, item.ITEMNAME, item.ITEMCODEClean, item.ItemPrice);
      } catch (error) {
        console.log('Error inserting item:', item, error);
      }
    }
    console.log('Items inserted successfully');

    // Fetch and insert customers
    const customersResponse = await axios.get('http://192.168.1.146:3000/api/mstcust');
    const customers = customersResponse.data.data;
    for (const customer of customers) {
      try {
        await insertMstCust(customer.CUSTCODE, customer.CustCodeClean, customer.CustName, customer.CUSTID);
      } catch (error) {
        console.log('Error inserting customer:', customer, error);
      }
    }
    console.log('Customers inserted successfully');

    // Fetch and insert salespersons
    const salesResponse = await axios.get('http://192.168.1.146:3000/api/getsp');
    const sales = salesResponse.data.data;
    for (const salesPerson of sales) {
      try {
        await insertMstSalesPerson(salesPerson.SP);
      } catch (error) {
        console.log('Error inserting salesperson:', salesPerson, error);
      }
    }
    console.log('Salespersons inserted successfully');

    // Fetch and insert company data
    const companyResponse = await axios.get('http://192.168.1.146:3000/api/getcompany');
    const companies = companyResponse.data.data;
    for (const company of companies) {
      try {
        await insertToMstCompany(
          company.CompID,
          company.CompName,
          company.Address1,
          company.Address2,
          company.Address3,
          company.Custcode,
          company.EMAIL,
          company.MOBNO,
          company.WEB,
          company.GSTNO,
          company.CompLoc,
          company.CINNO,
          company.TELNO
        );
      } catch (error) {
        console.log('Error inserting company:', company, error);
      }
    }
    console.log('Companies inserted successfully');

    // Fetch and insert users
    const response = await axios.get('http://192.168.1.146:3000/api/getuser');
    const mstuser = response.data.data;
    console.log('mstuser:', mstuser); // Debugging

    for (const user of mstuser) {
      try {
        await insertToMstUser(user.UserCode, user.UserID, user.LoginPwd, user.UserName);
      } catch (error) {
        console.log('Error inserting user:', user, error);
      }
    }
    console.log('Users inserted successfully');

    console.log('Data synchronization completed successfully');
  } catch (error) {
    console.log('====================================');
    console.log('Error in GetSyncData', error);
    console.log('====================================');
  }
  console.log('Data synchronization completed');
};

