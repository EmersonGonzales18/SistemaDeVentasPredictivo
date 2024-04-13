const Connection = require('../utilities/connection.js');

class Alert {
  constructor() {
    this.connection = new Connection("./BD/database.db");
  }
  async  get(user,id) {
    await this.connection.connect();

    const selectAllSql = `
      SELECT a.* , au.ok , au.id AS au_id
      FROM alert AS a
      JOIN alert_user AS au ON a.id = au.alert_id
      WHERE au.user_id = ? and au.id = ?
      ORDER BY a.date DESC
    `;

    const alerts = await this.connection.query(selectAllSql, [user,id]);

    await this.connection.close();

    return alerts;
  }
  async getAll(userId) {
    await this.connection.connect();

    const selectAllSql = `
      SELECT a.* , au.ok , au.id AS au_id
      FROM alert AS a
      JOIN alert_user AS au ON a.id = au.alert_id
      WHERE au.user_id = ?
      ORDER BY a.date DESC
    `;

    const alerts = await this.connection.query(selectAllSql, [userId]);

    await this.connection.close();

    return alerts;
  }
  async getAllNew(userId) {
    await this.connection.connect();

    const selectAllSql = `
      SELECT a.* , au.ok , au.id AS au_id
      FROM alert AS a
      JOIN alert_user AS au ON a.id = au.alert_id
      WHERE au.user_id = ? AND au.ok=0
      ORDER BY a.date DESC
    `;

    const alerts = await this.connection.query(selectAllSql, [userId]);

    await this.connection.close();

    return alerts;
  }
  async check(user,alertUserId) {
    await this.connection.connect();

    const updateSql = `
      UPDATE alert_user
      SET ok = 1
      WHERE id = ? and user_id = ?
    `;

    const result = await this.connection.exec(updateSql, [alertUserId,user]);

    await this.connection.close();

    return result.changes > 0;
  }
  async insert(user, icon, title, descripcion) {
    await this.connection.connect();
    const insertAlertSql = `
      INSERT INTO alert (user_id, icon, title, descripcion, date)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    const insertResult = await this.connection.query(insertAlertSql, [user, icon, title, descripcion]);
    await this.connection.close();
    return { id: insertResult.insertId };
  }
}

module.exports = Alert;
