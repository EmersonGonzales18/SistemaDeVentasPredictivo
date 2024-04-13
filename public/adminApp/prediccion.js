let data;
let PRODUCTS=[];
let USERS=[];

let AVRGcard = 10;
let TOTALcard = 110;
let MAXcard = 120;

const DATES = getDatesOfMonth();
console.log(DATES);

_init(actualize);

function _init(next){
  init_Products(()=>{
    init_Sales(()=>{
      init_Users(next)
    })
  })
}



function init_Products(next){
  fetch('/api/getProducts')
  .then(raw => raw.json())
  .then(function(response) {
    console.log(response)
    if (!response.error) {
      let list = "";
      for (let i = 0; i < response.result.length; i++) {
        PRODUCTS[i] = response.result[i];
        list = list + `<option value='${response.result[i].name}' valor='${response.result[i].id}'></option>`;
      }
      document.getElementById('productList').innerHTML = list;
      console.log(PRODUCTS)
      next();
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

function init_Sales(next){
  fetch('/api/allSalesInfo')
  .then(raw =>raw.json())
  .then(function(response) {
      data=response.result
      next();
  })
  .catch(function(error) {
      alert("ERRORRORORO")
      console.log(error)
  });
}

function init_Users(next){
  fetch('/api/getUsers')
  .then(raw => raw.json())
  .then(function(response) {
    console.log("USERS:",response)
    if (!response.error) {
      let list = "";
      for (let i = 0; i < response.result.length; i++) {
        USERS[i] = response.result[i];
        list = list + `<option value='${response.result[i].name}' valor='${response.result[i].id}'></option>`;
      }
      document.getElementById('usertList').innerHTML = list;
      console.log(USERS)
      next();
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



function actualize(){
    
    if(vendedorCheckbox.checked ){
      console.log("Por usuario: "+document.getElementById("vendedor").value)
      users();
      document.getElementById("TOTALcard").innerText = "S/." + TOTALcard;
    document.getElementById("AVRGcard").innerText = "S/." + AVRGcard;
    document.getElementById("MAXcard").innerText = "S/." + MAXcard;
      return;
    }
    if(productoCheckbox.checked ){
      console.log("Por producto: "+document.getElementById("producto").value)
      products();
      document.getElementById("TOTALcard").innerText = "S/." + TOTALcard;
    document.getElementById("AVRGcard").innerText = "S/." + AVRGcard;
    document.getElementById("MAXcard").innerText = "S/." + MAXcard;
      return;
    }
    console.log("TOTAL !!!!")
    total();
    document.getElementById("TOTALcard").innerText = "S/." + TOTALcard;
    document.getElementById("AVRGcard").innerText = "S/." + AVRGcard;
    document.getElementById("MAXcard").innerText = "S/." + MAXcard;

}


function data_users(data, idUsuario) {
  const ventasTotalesPorDia = [];

  data.forEach(venta => {
    if (venta.USID === idUsuario) {
      const fechaVenta = venta.fecha;

      const ventaExistente = ventasTotalesPorDia.find(v => v.fecha === fechaVenta);
      if (ventaExistente) {
        ventaExistente.monto += venta.monto;
      } else {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: venta.monto });
      }
    }
  });

  return ventasTotalesPorDia;
}

function regresionPolinomica(data) {
  const n = data.length;

  let sumX = 0;
  let sumX2 = 0;
  let sumX3 = 0;
  let sumX4 = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2Y = 0;
  let sumX3Y = 0;
  let sumX4Y = 0;

  for (let i = 0; i < n; i++) {
    const x = (new Date(data[i].fecha)).getTime(); // Convertir la fecha a milisegundos para utilizarla como valor numérico
    const y = data[i].monto;

    const x2 = Math.pow(x, 2);
    const x3 = Math.pow(x, 3);
    const x4 = Math.pow(x, 4);

    sumX += x;
    sumX2 += x2;
    sumX3 += x3;
    sumX4 += x4;
    sumY += y;
    sumXY += x * y;
    sumX2Y += x2 * y;
    sumX3Y += x3 * y;
    sumX4Y += x4 * y;
  }

  const matriz = [
    [n, sumX, sumX2, sumX3, sumX4],
    [sumX, sumX2, sumX3, sumX4, sumX2 * sumX2],
    [sumX2, sumX3, sumX4, sumX2 * sumX2, sumX3 * sumX3],
    [sumX3, sumX4, sumX2 * sumX2, sumX3 * sumX3, sumX4 * sumX4],
    [sumX4, sumX2 * sumX2, sumX3 * sumX3, sumX4 * sumX4, sumX4 * sumX4 * sumX4]
  ];

  const vectorY = [
    [sumY],
    [sumXY],
    [sumX2Y],
    [sumX3Y],
    [sumX4Y]
  ];

  

  const coeficientes = math.lusolve(matriz, vectorY);
  console.log(coeficientes)

  return {
    A: coeficientes[0][0],
    B: coeficientes[1][0],
    C: coeficientes[2][0],
    D: coeficientes[3][0],
    E: coeficientes[4][0]
  };
}


class ChartLine {
  constructor(canvas) {
    this.canvas = canvas;
    this.chart = null;
  }

  print(dataX, dataY,titulo) {
    document.getElementById("tituloChart").innerText=titulo
    const ctx = this.canvas.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataY.map(item => item.fecha),
        datasets: [
          {
            label: 'Ventas',
            data: dataX.map(item => item.monto),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Prediccion',
            data: dataY.map(item => item.monto),
            
            backgroundColor: 'rgba(200, 20, 20, 0.2)',
            borderColor: 'rgba(200, 20, 20, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
            responsive: true,
            scales: {
            x: {
                display: true,
                title: {
                display: true,
                text: 'Fechas',
                },
            },
            y: {
                display: true,
                title: {
                display: true,
                text: 'Monto',
                },
            },
            },
        },
        
    });
  }
}
let line = new ChartLine(document.getElementById("grafico"));


function users(){
    let inicio = document.getElementById("inicio").value
    let fin = document.getElementById("fin").value
    let dias = document.getElementById("dias").value/1
    let user = document.getElementById("vendedor").value;
    user = USERS.find(u=>u.name===user) ||{id:0};
    user=user.id
    let DATA = data_users(data, user);
    console.log(DATA)
    const ventasTotalesPorDia = [];
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      const fechaVenta = fechaActual.toISOString().split('T')[0];
  
      const ventaExistente = DATA.find(venta => venta.fecha === fechaVenta);
  
      if (ventaExistente) {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: ventaExistente.monto , USID: user });
      } else {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: 0, USID: user });
      }
  
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    console.log(ventasTotalesPorDia)
    let {A,B,C,D,E} = regresionPolinomica(ventasTotalesPorDia)
    let ventarRegresion = []
    for (let venta of ventasTotalesPorDia) {
      ventarRegresion[ventarRegresion.length]={
        fecha:venta.fecha,
        monto:polinom({A,B,C,D,E},(new Date(venta.fecha)).getTime())
      }
    }
    let fecha = ventarRegresion[ventarRegresion.length-1].fecha
    fecha =(new Date(fecha)) 
    for (let i = 0 ; i<dias;i++) {      
      fecha.setDate(fecha.getDate() +1);
      ventarRegresion[ventarRegresion.length]={
        fecha:fecha.toISOString().split('T')[0],
        monto:polinom({A,B,C,D,E},(fecha.getTime()))
      }
    }
    
    line.print(ventasTotalesPorDia,ventarRegresion,"Por Usuario:")
    cards({A,B,C,D,E})

}
function polinom(coeficientes, x) {

  const { A, B, C, D, E } = coeficientes;

  const y = A + B * x + C * Math.pow(x, 2) + D * Math.pow(x, 3) + E * Math.pow(x, 4);

  return y;
}

function data_products(data, productoId){
  const ventasPorDia = [];

  data.forEach((venta) => {
    const fecha = venta.fecha.split('T')[0]; // Obtener solo la parte de la fecha (sin la hora)
    const productos = venta.productos;

    productos.forEach((producto) => {
      if (producto.id === productoId) {
        const ventaExistente = ventasPorDia.find((v) => v.fecha === fecha);

        if (ventaExistente) {
          ventaExistente.monto += producto.monto;
        } else {
          ventasPorDia.push({ fecha: fecha, monto: producto.monto });
        }
      }
    });
  });

  return ventasPorDia;
}
function products(){
    let inicio = document.getElementById("inicio").value
    let fin = document.getElementById("fin").value
    let dias = document.getElementById("dias").value/1
    let product = document.getElementById("producto").value;
    product = PRODUCTS.find((p) =>{
      console.log(p.name,product)
      return p.name === product
    })||{id:0};
    
    product=product.id
    let DATA = data_products(data, product);
    console.log("PRODUCTS:",product)

    const ventasTotalesPorDia = [];
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      const fechaVenta = fechaActual.toISOString().split('T')[0];
  
      const ventaExistente = DATA.find(venta => venta.fecha === fechaVenta);
  
      if (ventaExistente) {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: ventaExistente.monto , PRID: product });
      } else {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: 0, PRID: product });
      }
  
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    console.log(ventasTotalesPorDia)
    let {A,B,C,D,E} = regresionPolinomica(ventasTotalesPorDia)
    let ventarRegresion = []
    for (let venta of ventasTotalesPorDia) {
      ventarRegresion[ventarRegresion.length]={
        fecha:venta.fecha,
        monto:polinom({A,B,C,D,E},(new Date(venta.fecha)).getTime())
      }
    }
    let fecha = ventarRegresion[ventarRegresion.length-1].fecha
    fecha =(new Date(fecha)) 
    for (let i = 0 ; i<dias;i++) {      
      fecha.setDate(fecha.getDate() +1);
      ventarRegresion[ventarRegresion.length]={
        fecha:fecha.toISOString().split('T')[0],
        monto:polinom({A,B,C,D,E},(fecha.getTime()))
      }
    }
    
    line.print(ventasTotalesPorDia,ventarRegresion,"Por Producto:")
    cards({A,B,C,D,E})
}

function total_data(data) {
  const totalPorFecha = {};

  data.forEach((venta) => {
    const fecha = venta.fecha.split('T')[0]; // Obtener solo la parte de la fecha (sin la hora)

    if (totalPorFecha[fecha]) {
      totalPorFecha[fecha] += venta.monto;
    } else {
      totalPorFecha[fecha] = venta.monto;
    }
  });

  const totalData = Object.entries(totalPorFecha).map(([fecha, monto]) => ({ fecha, monto }));

  return totalData;
}

function total(){
  let inicio = document.getElementById("inicio").value
    let fin = document.getElementById("fin").value
    let dias = document.getElementById("dias").value/1
  let DATA = total_data(data);
  console.log(DATA)
  const ventasTotalesPorDia = [];
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const fechaActual = new Date(fechaInicio);
    while (fechaActual <= fechaFin) {
      const fechaVenta = fechaActual.toISOString().split('T')[0];
  
      const ventaExistente = DATA.find(venta => venta.fecha === fechaVenta);
  
      if (ventaExistente) {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: ventaExistente.monto  });
      } else {
        ventasTotalesPorDia.push({ fecha: fechaVenta, monto: 0 });
      }
  
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    console.log(ventasTotalesPorDia)
    let {A,B,C,D,E} = regresionPolinomica(ventasTotalesPorDia)
    let ventarRegresion = []
    for (let venta of ventasTotalesPorDia) {
      ventarRegresion[ventarRegresion.length]={
        fecha:venta.fecha,
        monto:polinom({A,B,C,D,E},(new Date(venta.fecha)).getTime())
      }
    }
    let fecha = ventarRegresion[ventarRegresion.length-1].fecha
    fecha =(new Date(fecha)) 
    for (let i = 0 ; i<dias;i++) {      
      fecha.setDate(fecha.getDate() +1);
      ventarRegresion[ventarRegresion.length]={
        fecha:fecha.toISOString().split('T')[0],
        monto:polinom({A,B,C,D,E},(fecha.getTime()))
      }
    }
    
    line.print(ventasTotalesPorDia,ventarRegresion,"Ventas totales:")
    /////CARDS
    cards({A,B,C,D,E})
    

}


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


function getDatesOfMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const datesOfMonth = [];

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(currentYear, currentMonth, day);
    datesOfMonth.push(date);
  }

  return datesOfMonth;
}

function cards(coeficients){
  let sales = []
  for (let i = 0; i < DATES.length; i++) {
    sales[sales.length]= polinom(coeficients,DATES[i].getTime())
  }

  AVRGcard = sales.reduce((total, sale) => total + sale, 0) / sales.length;
  AVRGcard=AVRGcard.toFixed(2)
  TOTALcard = sales.reduce((total, sale) => total + sale, 0);
  TOTALcard=TOTALcard.toFixed(2)
  MAXcard = Math.max(...sales); 
  MAXcard=MAXcard.toFixed(2)
}



function downloadReport() {
  console.log("downloadReport")
  const doc = new jsPDF();
  const imagenURL = './img/3.png'; 
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
        const pageTitle = 'Reporte de Predicciones';
        const pageTitleWidth = doc.getTextWidth(pageTitle);
        doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 48);
        

        
        let element = "Resumen de predicciones por ventas totales:"
        if(vendedorCheckbox.checked ){
          let vendedor = document.getElementById("vendedor").value
          vendedor = USERS.find(u=>u.name===vendedor.trim()) || {first_name:"__",last_name:"__"}
          vendedor = vendedor.first_name + " " +vendedor.last_name
          element = "Resumen de predicciones por usuario: "+ vendedor


        }
        if(productoCheckbox.checked ){
          console.log("Por producto: "+document.getElementById("producto").value)
          element = "Resumen de predicciones por producto: "+document.getElementById("producto").value
        }
        
        doc.setFontSize(12);
        doc.text(element,20,55);

        let color ={ r: 47, g: 31, b: 171 }
        card(color,"Total de ventas: ","S/."+TOTALcard,20,60,80,25)

        color ={ r: 72, g: 163, b: 131 }
        card(color,"Venta promedio: ","S/."+AVRGcard,pageWidth/2,60,80,25)

        color ={ r: 64, g: 150, b: 230 }
        card(color,"Máxima venta:",MAXcard,20,90,80,25)

        


        // TABL5
        // Obtener los elementos canvas
        const canvas1 = document.getElementById('grafico');

        // Obtener las imágenes en formato base64 de los elementos canvas
        const imgData1 = canvas1.toDataURL();

        // Agregar las imágenes en el documento PDF
        doc.setFontSize(12);
        let desde = document.getElementById("inicio").value
        let hasta = document.getElementById("fin").value
        doc.setTextColor(0, 0, 0);
        doc.text("Grafico de lineas: " , 20, 125);
        doc.setFontSize(10);
        doc.text("  Desde:"+desde+"   Hasta:"+hasta , 20, 130);
        doc.addImage(imgData1, 'JPEG', 25, 140, 155, 70);
        
        doc.save('reporte.pdf'); 
      };
      reader.readAsDataURL(IMG);
    })
    .catch(error => {
      console.error('Error al cargar la imagen:', error);
    });

}
