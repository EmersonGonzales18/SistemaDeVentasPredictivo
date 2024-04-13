const Connection = require('../utilities/connection.js');

class Sales {
    constructor() {
        this.connection = new Connection("./BD/database.db");
    }
    
    
    async insertSale(user, total) {
        await this.connection.connect();
      
        const insertSaleSql = 'INSERT INTO sales (date, total, user_id) VALUES (DATE("now"), ?, ?)';
        await this.connection.query(insertSaleSql, [total, user]);
      
        const selectLastInsertIdSql = 'SELECT last_insert_rowid() AS id';
        const result = await this.connection.query(selectLastInsertIdSql);
        const saleId = result[0].id;
      
        ////console.log('Sales inserted successfully!');
        await this.connection.close();
        return  saleId ;
    }

    async insertSaleDetails(saleId, array) {
        await this.connection.connect();
      
        const insertDetailSql = 'INSERT INTO sales_details (sale_id, product_id, quantity) VALUES (?, ?, ?)';
      
        for (const sale of array) {
          const params = [saleId, sale.id, sale.quantity];
          await this.connection.query(insertDetailSql, params);
        }
      
        //console.log('Sale details inserted successfully!');
        await this.connection.close();
        return true;
    }

    
    async  checkStock(array) {
        const productsWithoutStock = [];
      
        await this.connection.connect();
      
        for (const sale of array) {
          const productId = sale.id;
          const quantity = sale.quantity;
      
          const selectStockSql = 'SELECT stock FROM products WHERE id = ?';
          const result = await this.connection.query(selectStockSql, [productId]);
          const stock = result[0].stock;
      
          if (quantity > stock) {
            productsWithoutStock.push(productId);
          }
        }
      
        await this.connection.close();
      
        if (productsWithoutStock.length > 0) {
          return productsWithoutStock;
        } else {
          return null;
        }
      }
    async allInfoById(id){
        await this.connection.connect();
      
        const sql = `SELECT p.id AS PRID,u.id AS USID,sd.id AS SDID, s.date, s.total, u.name AS user_name, p.name AS product_name, sd.quantity, p.price
                     FROM sales_details AS sd
                     INNER JOIN sales AS s ON sd.sale_id = s.id
                     INNER JOIN users AS u ON s.user_id = u.id
                     INNER JOIN products AS p ON sd.product_id = p.id
                     WHERE u.id = ?
                     ORDER BY s.id`;
      
        const result = await this.connection.query(sql,[id]);
        //console.log(result)
        const data = [];
        let currentSale = null;
      
        for (const row of result) {
          //console.log("ROW:",row);
          const { date, total, user_name,PRID ,product_name, quantity, price ,USID} = row;
      
          if (!currentSale || currentSale.fecha !== date || currentSale.vendedor !== user_name) {
            if (currentSale) {
              data.push(currentSale);
            }
      
            currentSale = {
              USID : USID,
              vendedor: user_name,
              fecha: date,
              monto: total,
              productos: []
            };
          }
      
          currentSale.productos.push({
            id:PRID,
            nombre: product_name,
            monto: price*quantity,
            cantidad: quantity
          });
        }
      
        if (currentSale) {
          data.push(currentSale);
        }
      
        await this.connection.close();
        for(let i = 0 ; i<data.length;i++ ){
          let total =0
          for(let j = 0 ; j<data[i].productos.length;j++ ){         
            total=total+data[i].productos[j].monto
          }
          data[i].monto = total
        }
        return data;
    }
    async  allInfo() {
        await this.connection.connect();
      
        const sql = `SELECT u.first_name AS FIRST , u.last_name AS LAST , p.id AS PRID,u.id AS USID,sd.id AS SDID, s.date, s.total, u.name AS user_name, p.name AS product_name, sd.quantity, p.price
                     FROM sales_details AS sd
                     INNER JOIN sales AS s ON sd.sale_id = s.id
                     INNER JOIN users AS u ON s.user_id = u.id
                     INNER JOIN products AS p ON sd.product_id = p.id
                     ORDER BY s.id`;
      
        const result = await this.connection.query(sql);
        //console.log("allInfo result:",result)
        const data = [];
        let currentSale = null;
      
        for (const row of result) {
          //console.log("ROW:",row);
          const { date, total, user_name,PRID ,product_name, quantity, price ,USID,FIRST,LAST} = row;
      
          if (!currentSale || currentSale.fecha !== date || currentSale.vendedor !== user_name) {
            if (currentSale) {
              data.push(currentSale);
            }
      
            currentSale = {
              nombre: FIRST+" "+LAST,
              USID : USID,
              vendedor: user_name,
              fecha: date,
              monto: total,
              productos: []
            };
          }
      
          currentSale.productos.push({
          
            id:PRID,
            nombre: product_name,
            monto: price*quantity,
            cantidad: quantity
          });
        }
      
        if (currentSale) {
          data.push(currentSale);
        }
      
        await this.connection.close();
        for(let i = 0 ; i<data.length;i++ ){
          let total =0
          for(let j = 0 ; j<data[i].productos.length;j++ ){         
            total=total+data[i].productos[j].monto
          }
          data[i].monto = total
        }
        return data;
      }
      
      
}

module.exports = Sales;
