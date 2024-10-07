import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('vCracker');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS MstUser (
      UserCode TEXT NOT NULL,
      UserID INTEGER PRIMARY KEY NOT NULL,
      LoginPwd TEXT NOT NULL,
      UserName TEXT NOT NULL
    );
  `);
}

// Initialize the database
initializeDatabase().catch(error => {
  console.error('Error initializing database:', error);
});