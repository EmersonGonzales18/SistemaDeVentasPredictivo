const Connection = require('../utilities/connection.js');

class Products {
  constructor() {
    this.connection = new Connection("./BD/database.db");
  }

  async getAll() {
    
      await this.connection.connect();

      const selectAllSql = 'SELECT * FROM products';
      const products = await this.connection.query(selectAllSql);

      await this.connection.close();
      
      return products;
      
  }

  async insert(name,price,stock){
    await this.connection.connect();
    const insertSql = `
    INSERT INTO products 
    (name, price, stock) 
    VALUES
    (?, ?, ?)
    `;
    await this.connection.query(insertSql,[name,price,stock]);
    return true;
  }

  async update(name, price, stock, id) {
    await this.connection.connect();
  
    const updateSql = `
      UPDATE products
      SET name = ?,
          price = ?,
          stock = ?
      WHERE id = ?
    `;
  
    let rows = await this.connection.exec(updateSql, [name, price, stock, id]);
  
    await this.connection.close();

    return rows.changes
  }
  
  async delete(id) {
    await this.connection.connect();
  
    const deleteSql = `
      DELETE FROM products
      WHERE id = ?
    `;
  
    let rows=await this.connection.exec(deleteSql, [id]);
  
    await this.connection.close();
    
    return rows.changes
  }
  
}

module.exports = Products;
