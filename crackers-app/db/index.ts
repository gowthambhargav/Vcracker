import axios from 'axios';
import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('vCracker');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstUser (
      UserCode TEXT,
      UserID INTEGER,
      LoginPwd TEXT ,
      UserName TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstCust (
      CUSTCODE TEXT,
      CustCodeClean TEXT,
      CustName TEXT,
      CUSTID INTEGER
    );
  `);

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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstSalesPerson (
      SP TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstItem (
      ITEMID INTEGER,
      ITEMNAME TEXT,
      ITEMCODEClean TEXT,
      ItemPrice INTEGER,
      uomid INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS TrnHdrINV (
      INVID INTEGER PRIMARY KEY AUTOINCREMENT,
      INVNO VARCHAR(15) NOT NULL,
      PrintINVNO VARCHAR(50) NOT NULL,
      INVDate DATETIME NOT NULL,
      INVDateYear INTEGER,
      INVDateMonth INTEGER,
      CUSTID INTEGER NOT NULL,
      PartyName VARCHAR(150) NOT NULL,
      AddedBy VARCHAR(50) NOT NULL,
      AddedOn DATETIME NOT NULL,
      GRSAMT NUMERIC(19, 2) NOT NULL,
      INVTIME VARCHAR(15) NOT NULL,
      USERNAME VARCHAR(75) NOT NULL, 
      AMTINWORDS VARCHAR(250) NOT NULL,
      INVVALUE NUMERIC(19, 2) NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS TrnDtlINV (
      INVID INTEGER NOT NULL,
      INVDtlID INTEGER NOT NULL,
      SlNo INTEGER NOT NULL,
      ITEMID INTEGER NOT NULL,
      UOMID INTEGER NOT NULL,
      ItemSlNO INTEGER NOT NULL,
      ShortClosed CHAR(1) NOT NULL,
      ShortClosedBy INTEGER NOT NULL,
      ShortClosedDT DATETIME,
      ShortClosedQty NUMERIC(19, 2),
      StkQty NUMERIC(19, 2),
      INVQty NUMERIC(18, 2) NOT NULL,
      INVRate NUMERIC(18, 2) NOT NULL,
      INVAmt NUMERIC(18, 2) NOT NULL,
      ShortClosedRmks VARCHAR(100),
      FOREIGN KEY (INVID) REFERENCES TrnHdrINV (INVID),
      FOREIGN KEY (ITEMID) REFERENCES MstItem (ITEMID)
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS CustomerSalesCart (
      CartID INTEGER PRIMARY KEY AUTOINCREMENT,
      CUSTID INTEGER NOT NULL,
      SalesPerson TEXT NOT NULL,
      CartItems TEXT NOT NULL,
      CartTotal NUMERIC(19, 2) NOT NULL,
      CartDate DATETIME NOT NULL,
      CartMonth INTEGER NOT NULL,
      CartYear INTEGER NOT NULL,
      SeraialNo INTEGER NOT NULL

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
  console.log('Initializing database...');
  await initializeDatabase();
  try {
    console.log('Trimming and converting username to lowercase...');
    const trimmedUsername = username.trim().toLowerCase();
    console.log('Trimmed username:', trimmedUsername);

    console.log('Opening database...');
    const db = await SQLite.openDatabaseAsync('vCracker');

    console.log('Querying for user...');
    const user = await db.getFirstAsync(
      `SELECT * FROM MstUser WHERE LOWER(UserCode) = ?`,
      [trimmedUsername]
    );
    console.log('User found:', user);

    if (!user) {
      alert('User not found');
      return null;
    }

    console.log('Validating password...');
    const query = `SELECT * FROM MstUser WHERE LOWER(UserCode) = ? AND LoginPwd = ?`;
    const result = await db.getFirstAsync(query, [trimmedUsername, password]);
    console.log('Validation result:', result);

    if (!result) {
      alert('Invalid password');
      return null;
    }

    console.log('Returning result...');
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

export const insertMstItem = async (itemId: number, itemName: string, itemCodeClean: string, itemPrice: number,uomid:number) => {
  await initializeDatabase();
  try {
    const db = SQLite.openDatabaseSync('vCracker');
    
    await db.execAsync(`
      INSERT INTO MstItem (ITEMID, ITEMNAME, ITEMCODEClean, ItemPrice,uomid) VALUES (${itemId}, '${itemName}', '${itemCodeClean}', ${itemPrice},${uomid});
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

export const syncCustomerSalesCart = async () => {
  try {
    console.log('Starting syncCustomerSalesCart...');
    const db = await SQLite.openDatabaseAsync('vCracker');
    const query = 'SELECT * FROM CustomerSalesCart';
    console.log(`Executing query: ${query}`);
    const result = await db.getAllAsync(query);
    console.log('Query result:', result);

    const response = await axios.post('http://192.168.1.146:3000/api/items/sync', result);
    console.log('Data synced successfully with server. Response:', response.data);
  } catch (error) {
    console.log('====================================');
    console.log('Error in syncCustomerSalesCart', error);
    console.log('====================================');
  }
};

export const GetSyncData = async () => {
  console.log('Starting data synchronization');
  try {
    await Promise.all([
      truncateMstCompany(),
      truncateMstItem(),
      truncateMstCust(),
      truncateMstSalesPerson(),
      truncateMstUser()
    ]);
    console.log('Tables truncated successfully');

    // Fetch data concurrently
    const [itemsResponse, customersResponse, salesResponse, companyResponse, usersResponse] = await Promise.all([
      axios.get('http://192.168.1.146:3000/api/items'),
      axios.get('http://192.168.1.146:3000/api/mstcust'),
      axios.get('http://192.168.1.146:3000/api/getsp'),
      axios.get('http://192.168.1.146:3000/api/getcompany'),
      axios.get('http://192.168.1.146:3000/api/getuser')
    ]);

    const items = itemsResponse.data.data;
    const customers = customersResponse.data.data;
    const sales = salesResponse.data.data;
    const companies = companyResponse.data.data;
    const mstuser = usersResponse.data.data;

    console.log('mstuser:', mstuser); // Debugging
    console.log('====================================');
    console.log('items:', items.length);
    console.log('====================================');

    // Insert items
    await Promise.all(items.map(async (item) => {
      try {
        await initializeDatabase();
        await insertMstItem(item.ITEMID, item.ITEMNAME, item.ITEMCODEClean, item.ItemPrice, item.uomid);
      } catch (error) {
        console.log('Error inserting item:', item, error);
      }
    }));
    console.log('Items inserted successfully');

    // Insert customers
    await Promise.all(customers.map(async (customer) => {
      try {
        await insertMstCust(customer.CUSTCODE, customer.CustCodeClean, customer.CustName, customer.CUSTID);
      } catch (error) {
        console.log('Error inserting customer:', customer, error);
      }
    }));
    console.log('Customers inserted successfully');

    // Insert salespersons
    await Promise.all(sales.map(async (salesPerson) => {
      try {
        await insertMstSalesPerson(salesPerson.SP);
      } catch (error) {
        console.log('Error inserting salesperson:', salesPerson, error);
      }
    }));
    console.log('Salespersons inserted successfully');

    // Insert companies
    await Promise.all(companies.map(async (company) => {
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
    }));
    console.log('Companies inserted successfully');

    // Insert users
    await Promise.all(mstuser.map(async (user) => {
      try {
        await insertToMstUser(user.UserCode, user.UserID, user.LoginPwd, user.UserName);
      } catch (error) {
        console.log('Error inserting user:', user, error);
      }
    }));
    console.log('Users inserted successfully');

    console.log('Data synchronization completed successfully');
  } catch (error) {
    console.log('====================================');
    console.log('Error in GetSyncData', error);
    console.log('====================================');
  }

  console.log('Data synchronization completed');
};


export const GetMstItemByItemCode = async (itemCode: string) => {
  try {
    const db = await SQLite.openDatabaseAsync('vCracker');
    const query = `SELECT * FROM MstItem WHERE ITEMCODEClean = '${itemCode}'`;
    const result = await db.getFirstAsync(query);
    return result;
  } catch (error) {
    console.log('====================================');
    console.log('Error in GetMstItemByItemCode', error);
    console.log('====================================');
  }
}


export const getitembyid = async (itemid: number) => {
  try {
    const db = await SQLite.openDatabaseAsync('vCracker');
    const query = `SELECT * FROM MstItem WHERE ITEMID = ${itemid}`;
    const result = await db.getFirstAsync(query);
    return result;
  } catch (error) {
    console.log('====================================');
    console.log('Error in getitembyid', error);
    console.log('====================================');
  }
}



export const insertToCustomerSalesCart = async (custId: number, salesPerson: string, cartItems: string, cartTotal: number, cartDate: string, cartMonth: number, cartYear: number, serialNo: number) => {
  console.log(`Starting insertToCustomerSalesCart with custId: ${custId}, salesPerson: ${salesPerson}, cartItems: ${cartItems}, cartTotal: ${cartTotal}, cartDate: ${cartDate}, cartMonth: ${cartMonth}, cartYear: ${cartYear}, serialNo: ${serialNo}`);
  try {
    if (custId == null) {
      throw new Error('custId is null or undefined');
    }

    console.log('Opening database...');
    const db = await SQLite.openDatabaseAsync('vCracker');

    console.log('Preparing SQL query...');
    const query = `
    INSERT INTO CustomerSalesCart (CUSTID, SalesPerson, CartItems, CartTotal, CartDate, CartMonth, CartYear, SeraialNo) 
    VALUES (${custId}, '${salesPerson}', '${cartItems}', ${cartTotal}, '${cartDate}', ${cartMonth}, ${cartYear}, ${serialNo});
  `;
  console.log(`SQL query: ${query}`);
  
  console.log('Executing SQL query...');
  await db.execAsync(query);

    console.log('Insert successful.');
  } catch (error) {
    console.log('====================================');
    console.log('Error in insertToCustomerSalesCart', error);
    console.log('====================================');
  }
};


export const getCustomerSalesCart = async () => {
  try {
    const query = 'SELECT * FROM CustomerSalesCart';
    const db = await SQLite.openDatabaseAsync('vCracker');
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.log('====================================');
    console.log('Error in getCustomerSalesCart', error);
    console.log('====================================');
  }
}