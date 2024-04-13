const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Products = require('../model/Products');
const Users = require('../model/Users');
const Alert = require('../model/Alerts');


class Messenger {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_SENDER, 
        pass: process.env.PASS_SENDER,
      },
    });

    cron.schedule('13-14-15 06 * * *', () => {
      this.sendMessages();
    });
  }

  async getWarningStocks() {
    let products = new Products();
    let data  = await products.getAll();
    let result = []
    let minimum = process.env.MIN
    for (let i = 0; i < data.length; i++) {
        if(data[i].stock<minimum){
            result[result.length]=data[i]
        }   
    }
    return result;

  }
  

  async sendMessages() {
    console.log("RECORDATORIO");
    let users = new Users();
    let alerts = new Alert();
    let admins = await users.getAll(2);
    const stocks = await this.getWarningStocks();
    if(stocks.length==0){
        console.log("No hay ...")
        return;
    }
    console.log(admins);
    console.log(stocks);
    await alerts.insert(1,1,"Alerta de stock bajo",this.generateContent(stocks))
    admins.forEach(async (admin) => {
      
      try {
        const html = this.generateEmailContent(stocks);

        const mailOptions = {
          from: this.transporter.options.auth.user,
          to: admin.name,
          subject: 'Productos con stock bajo',
          html: html,
        };

        this.transporter.sendMail(mailOptions, (error, info) => {

          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });

      } catch (error) {
        console.log(error);
      }
    });
  }

  generateEmailContent(stocks) {
    let html = `
      <html>
      <head>
        <title>Productos con stock bajo</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
      </head>
      <body>
        <div class="container mt-4">
          <div class="card">
            <div class="card-header">
              <h1 class="card-title">Productos con stock bajo:</h1>
            </div>
            <div class="card-body">
              <ul class="list-group">
    `;
  
    stocks.forEach((product) => {
      html += `
                <li class="list-group-item">${product.name} - Stock: ${product.stock}</li>
      `;
    });
  
    html += `
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  
    return html;
  }
  generateContent(stocks) {
    let text = "Productos con stock bajo:\n";
  
    stocks.forEach((product) => {
      text += `${product.name} - Stock: ${product.stock}\n`;
    });
  
    return text;
  }
  
}

module.exports = Messenger;


/*

stocks.forEach(({ fechaLimite, Correo,nombreCurso }) => {
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: Correo,
        subject: '',
        text: ``,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar el correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    });


*/