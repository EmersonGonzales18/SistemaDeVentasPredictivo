var sales = [];
var products = {};

getProducts();

function getProducts() {
  fetch('/api/getProducts')
    .then(raw => raw.json())
    .then(function(response) {
      console.log(response)
      if (!response.error) {
        let list = "";
        for (let i = 0; i < response.result.length; i++) {
          products[response.result[i].id] = response.result[i];
          list = list + `<option value='${response.result[i].name}'></option>`;
        }
        document.getElementById('productList').innerHTML = list;
        console.log(products)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error cargando los datos...',
        });
      }
    })
    .catch(function(error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error',
      });
      console.log(error);
    });
}

function sendSales() {
  let total = 0;
  for (let i = 0; i < sales.length; i++) {
    total = total + sales[i].price * sales[i].quantity;
  }
  console.log(sales);
  fetch('/api/insertSales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ array: sales, total })
    })
    .then(raw => raw.json())
    .then(function(response) {
      console.log(response);
      if (response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error',
        });
      } else {
        if (response.status == 200) {
          sales = [];
          getProducts();
          actualiceTable();
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Venta realizada con éxito!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Stock insuficiente: ' + response.result,
          });
        }
      }
    })
    .catch(function(error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error',
      });
    });
}

function addSale() {
  var product = document.getElementById('product').value;
  var quantity = document.getElementById('quantity').value / 1;
  var find = false;
  for (const key in products) {
    if (Object.hasOwnProperty.call(products, key)) {      
      if(products[key].name==product){
        product=(products[key]);
        find = true;
        break;
      }
    }
  }
  // Ejemplo de cómo usar la función para mostrar varios errores juntos
  let errores = [];

  if (!find) {
    errores.push('Producto no encontrado...');
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errores.push('Cantidad no permitida...');
  }

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  var sale = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity
  };

  sales.push(sale);

  actualiceTable();

  document.getElementById('product').value = '';
  document.getElementById('quantity').value = '';
}

function eraseSale(id) {
  console.log(sales);
  sales.splice(id, 1);

  actualiceTable();
}

function actualiceTable() {
  var salesTable = document.getElementById('salesTable');
  salesTable.innerHTML = '';
  let total = 0;
  let i = 0;
  sales.forEach(function(sale) {
    var row = '<tr>';
    row += '<td>' + sale.id + '</td>';
    row += '<td>' + sale.name + '</td>';
    row += '<td>' + sale.price.toFixed(2) + '</td>';
    row += '<td>' + sale.quantity + '</td>';
    row += '<td>' + ( sale.price * sale.quantity ).toFixed(2)+ '</td>';
    row += '<td><div class="text-center"><button class="btn btn-danger" onclick="eraseSale(' + i + ')"><i class="fas fa-trash"></i></button></div></td>';
    row += '</tr>';
    salesTable.innerHTML += row;
    total = total + sale.price * sale.quantity;
    i++;
  });
  salesTable.innerHTML += '<td>TOTAL:</td><td></td><td></td><td></td><td>' + total.toFixed(2) + '</td>';
  
}

getPhoto()
function getPhoto() {
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getPhoto')
      .then(response => response.blob())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
        console.log(blob)
        // Crear una URL para el objeto Blob
        const photoURL = URL.createObjectURL(blob);
  
        // Obtener el elemento de imagen en el DOM
        const photoElement = document.getElementById('USERPHOTO');
  
        // Asignar la URL de la foto al atributo src de la imagen
        photoElement.src = photoURL;
      })
      .catch(error => {
        console.error('Error al obtener la foto:', error);
      });
}

getData()
function getData() {
    console.log(123)
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getData')
      .then(response => response.json())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
        console.log("GFD:",blob)
        const photoElement = document.getElementById('USERNAME');
  
        // Asignar la URL de la foto al atributo src de la imagen
        photoElement.innerText = blob.result.name;
      })
      .catch(error => {
        console.error('Error al obtener la data:', error);
      });
}


function downloadReport(){
  const doc = new jsPDF();
  console.log(doc)
  fetch('/api/allSalesInfoByid')
  .then(response => response.json())  // Obtener la respuesta como un objeto Blob
  .then(response => {
    if (!response.error){
    const doc = new jsPDF();
    const imagenURL = './img/3.png'; 
    fetch(imagenURL)
      .then(r => r.blob())
      .then(IMG => {
          const reader = new FileReader();
          reader.onloadend = () => {
          const base64Data = reader.result;
          doc.addImage(base64Data, 'PNG', 0,-10, 60, 70); 
          
          doc.setFontSize(9);
          const pageTitle1 = 'SUPER MARKET MECHE SAC';
          const pageTitle2 = 'RUC: 20494596297';
          const pageTitle3 = 'SISTEMA DE ADMINISTRACIÓN MECHE SAC';
          const pageTitle4 = 'DIERECCIÓN: AV. AREQUIPA N° 122.';
          const pageTitle5 = 'CORREO: SuperMarketMeche@hotmail.com';
          const pageTitle6 = 'TELEFONO: (+51) 532770';
          
          doc.text(pageTitle1, 50, 20);
          doc.text(pageTitle2, 50, 24);
          doc.text(pageTitle3, 50, 28);
          doc.text(pageTitle4, 50, 32);
          doc.text(pageTitle5, 50, 36);
          doc.text(pageTitle6, 50, 40);
          
          const fechaEmision = new Date();
          const fechaEmisionFormatted = fechaEmision.toISOString().split('T')[0];
          doc.text("Fecha Emisión: " + fechaEmisionFormatted, 150, 20);
          // Obtener la altura de la página actual
          const pageHeight = 297
          const pageWidth = 210
          // Agregar título
          doc.setFontSize(16);
          const pageTitle = 'Reporte de Ventas';
          const pageTitleWidth = doc.getTextWidth(pageTitle);
          doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 65);

           // TABLA
           const products = response.result;
           let TOTAL = 0;
          const tableData = [];
          const headers = ['ID', 'Nombre','Unidades vendidas','Total'];
          tableData.push(headers);
          let dic = {}
          // Agregar filas a la tabla
          for (let i = 0; i < products.length; i++) {
            for (let j = 0; j < products[i].productos.length; j++) {
              if(dic[products[i].productos[j].id]==undefined){
                dic[products[i].productos[j].id]=products[i].productos[j]
              }else{
                dic[products[i].productos[j].id].monto=dic[products[i].productos[j].id].monto+products[i].productos[j].monto
                dic[products[i].productos[j].id].cantidad=dic[products[i].productos[j].id].cantidad+products[i].productos[j].cantidad
              }
            }
          }
          console.log(dic)
          for (const key in dic) {
            if (Object.hasOwnProperty.call(dic, key)) {
              const element = dic[key];
              
              tableData.push([element.id,element.nombre,element.cantidad,"S/."+element.monto.toFixed(2)])
              TOTAL=TOTAL+element.monto;
            }
          }
          
          tableData.push(["","","TOTAL:","S/."+TOTAL.toFixed(2)])
          // Generar la tabla en el documento PDF
          doc.autoTable({
            head: [tableData[0]], // Cabecera de la tabla
            body: tableData.slice(1), // Filas de la tabla
            startY: 75, // Posición inicial de la tabla
            styles: {
              fillStyle: 'transparent', // Establecer el fondo transparente
              lineColor: [0, 0, 0] // Establecer el color de las líneas a negro (RGB: 0, 0, 0)
            }
          });
          doc.save('reporte.pdf'); 
        };
        reader.readAsDataURL(IMG);
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });

    }else {
      alert("ERROR cargando los datos...");
    }

    

   
  })
  .catch(error => {
    console.error('Error al obtener la data:', error);
  });
}