const Connection = require('../utilities/connection.js');

async function showTablesAndContents() {
    let connection;
    try {
        connection = new Connection("database.db");

        
        await connection.connect();

        const tablesSql = "SELECT name FROM sqlite_master WHERE type='table'";
        const tablesResult = await connection.query(tablesSql);

        for (const table of tablesResult) {
        const tableName = table.name;
        const contentSql = `SELECT * FROM ${tableName}`;
        const contentResult = await connection.query(contentSql);

        console.log(`Table: ${tableName}`);
        if (contentResult.length > 0) {
            for (const row of contentResult) {
            console.log(row);
            }
        } else {
            console.log('Empty table');
        }

        console.log('\n');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await connection.close();
    }
}

showTablesAndContents();
