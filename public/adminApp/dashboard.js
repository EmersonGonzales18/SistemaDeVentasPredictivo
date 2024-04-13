let USERS = []

fetch('/api/getUsers')
  .then(raw => raw.json())
  .then(function(response) {
    console.log("USERS:",response)
    if (!response.error) {
      let list = "";
      for (let i = 0; i < response.result.length; i++) {
        
        list = list + `<option value='${response.result[i].name}' valor='${response.result[i].id}'></option>`;
      }
      document.getElementById('usertList').innerHTML = list;
      USERS=response.result
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



function _init(data){
    console.log("_init:",data)
    var input = document.getElementById('vendedor');
    var desdeInput = document.getElementById('desde');
    var hastaInput = document.getElementById('hasta');
    var canvas = document.getElementById('grafico');
    var generar = document.getElementById('generar');

    var chart = new ChartLine(data, input, canvas, desdeInput, hastaInput,generar);

    let graficoTorta = document.getElementById('grafico-torta')
    let botonAlternarGraficoTorata=document.getElementById('alternar-btn-grafico-torta')

    let chart2 = new ChartPie(graficoTorta, data, botonAlternarGraficoTorata);
    //KPIS

    TOTAL = data.reduce((total, venta) => total + venta.monto, 0);

    AVRG = TOTAL / data.length;

    const userSales = {};
    data.forEach(venta => {
    if (!userSales[venta.nombre]) {
        userSales[venta.nombre] = 0;
    }
    userSales[venta.nombre] += venta.monto;
    });
    USER = Object.keys(userSales).reduce((maxUser, user) => {
    if (!maxUser || userSales[user] > userSales[maxUser]) {
        return user;
    }
    return maxUser;
    }, "");

    const productSales = {};
    data.forEach(venta => {
    venta.productos.forEach(producto => {
        if (!productSales[producto.nombre]) {
        productSales[producto.nombre] = 0;
        }
        productSales[producto.nombre] += producto.monto;
    });
    });
    PRDUCT = Object.keys(productSales).reduce((maxProduct, product) => {
    if (!maxProduct || productSales[product] > productSales[maxProduct]) {
        return product;
    }
    return maxProduct;
    }, "");
    document.getElementById("USER").innerText = USER;
    document.getElementById("AVRG").innerText = AVRG.toFixed(2);
    document.getElementById("TOTAL").innerText = TOTAL.toFixed(2);
    document.getElementById("PRODUCT").innerText = PRDUCT;
}




fetch('/api/allSalesInfo')
.then(raw =>raw.json())
.then(function(response) {
    console.log("PREV",response.result)
    _init(response.result)
})
.catch(function(error) {
    alert("ERRORRORORO")
    console.log(error)
});

getPhoto()
function getPhoto() {
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getPhoto')
      .then(response => response.blob())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
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


function downloadReport() {
  const doc = new jsPDF();
  function roundedRect(x, y, width, height, borderRadius, style) {
    doc.setDrawColor(style.borderColor.r, style.borderColor.g, style.borderColor.b);
    doc.setFillColor(style.fillColor.r, style.fillColor.g, style.fillColor.b);
    doc.setLineWidth(style.borderWidth);
    doc.roundedRect(x, y, width, height, borderRadius, borderRadius, style.drawFill);
  }
  function limitarTexto(texto, limite) {
    if (texto.length > limite) {
      return texto.substring(0, limite) + '...';
    } else {
      return texto;
    }
  }
  function card(color,titulo, contenido,X,Y,W,H){
    let cardStyle = {
      borderColor:color , // Color del borde (negro), , 
      fillColor: color, // Color del fondo (blanco)
      borderWidth: 0.3, // Ancho del borde
      drawFill: 'F' // Dibujar el relleno del rectángulo
    };
    roundedRect(X, Y, W, H, 3, cardStyle);
    cardStyle = {
      borderColor:{ r: 0, g: 0, b: 0 } , // Color del borde (negro), , 
      fillColor: { r: 255, g: 255, b: 255 }, // Color del fondo (blanco)
      borderWidth: 0.3, // Ancho del borde
      drawFill: 'F' // Dibujar el relleno del rectángulo
    };
    roundedRect(X+2.5, Y+0.5, W-3, H-1, 2.5, cardStyle);
    doc.setFontSize(10);
    doc.setTextColor(color.r, color.g, color.b);
    doc.text(limitarTexto(titulo) , X+6, Y+8);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(limitarTexto(contenido,30) , X+6, Y+14);
  }
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
        const pageTitle = 'Reporte de Dashboard';
        const pageTitleWidth = doc.getTextWidth(pageTitle);
        doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 48);
        
        const USER=document.getElementById("USER").innerText 
        const AVRG=document.getElementById("AVRG").innerText 
        const TOTAL=document.getElementById("TOTAL").innerText 
        const PRODUCT=document.getElementById("PRODUCT").innerText 
        

        // TABL5
        // Obtener los elementos canvas
        const canvas1 = document.getElementById('grafico');
        const canvas2 = document.getElementById('grafico-torta');

        // Obtener las imágenes en formato base64 de los elementos canvas
        const imgData1 = canvas1.toDataURL();
        const imgData2 = canvas2.toDataURL();

        // Agregar las imágenes en el documento PDF
        doc.setFontSize(12);
        let vendedor = document.getElementById("vendedor").value
        vendedor = USERS.find(u=>u.name===vendedor.trim()) || {first_name:"__",last_name:"__"}
        vendedor = vendedor.first_name + " " +vendedor.last_name
        let desde = document.getElementById("desde").value
        let hasta = document.getElementById("hasta").value
        doc.text("Grafico de lineas: "+vendedor , 20, 125);
        doc.setFontSize(10);
        doc.text("  Desde:"+desde+"   Hasta:"+hasta , 20, 130);
        doc.addImage(imgData1, 'JPEG', 40, 135, 125, 60);
        doc.setFontSize(12);
        doc.text("Grafico de Torta:", 20, 200);
        doc.addImage(imgData2, 'JPEG', 65, 210, 80, 60);

        let color ={ r: 47, g: 31, b: 171 }
        card(color,"Total de ventas: ","S/."+TOTAL,20,60,80,25)

        color ={ r: 72, g: 163, b: 131 }
        card(color,"Promedio histórico de venta: ","S/."+AVRG,pageWidth/2,60,80,25)

        color ={ r: 64, g: 150, b: 230 }
        card(color,"Máximo vendedor:",USER,20,90,80,25)

        color ={ r: 207, g: 174, b: 41 }
        card(color,"Producto más vendido: ",PRODUCT,pageWidth/2,90,80,25)

        doc.save('reporte.pdf'); 
      };
      reader.readAsDataURL(IMG);
    })
    .catch(error => {
      console.error('Error al cargar la imagen:', error);
    });

}
