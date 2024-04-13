const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();


const dbFilePath = 'database.db';

const scriptFilePath = 'BD.sql';

const sqlScript = fs.readFileSync(scriptFilePath, 'utf-8');

if (fs.existsSync(dbFilePath)) {
  fs.unlinkSync(dbFilePath);
}


const db = new sqlite3.Database(dbFilePath);

db.exec(sqlScript, function(err) {
  if (err) {
    console.error('Error in  SQL script:', err);
  } else {
    console.log('OK');
  }
  db.close();
});
