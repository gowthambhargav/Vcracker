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
      // Trim and convert username to lowercase
      const trimmedUsername = username.trim().toLowerCase();
      const db = await SQLite.openDatabaseAsync('vCracker');
  
      // Check if the username exists
      const user = await db.getFirstAsync(`SELECT * FROM MstUser WHERE LOWER(UserCode) = '${trimmedUsername}'`);
      if (!user) {
        alert('User not found');
        return null;
      }
  
      // Check if the password is valid
      const query = `SELECT * FROM MstUser WHERE LOWER(UserCode) = '${trimmedUsername}' AND LoginPwd = '${password}'`;
      const result = await db.getFirstAsync(query);
      if (!result) {
        alert('Invalid password');
        return null;
      }
  
      return result;
    } catch (error) {
      console.log('====================================');
      console.log('Error in ValidateUser', error);
      console.log('====================================');
    }
  };











