actualize()
let products=[]
function actualize(){

    fetch("/api/getMin").then(r=>r.json()).then((min)=>{
      console.log("MIN:",min)
      if(min.error){        
        return ;
      } 
      let MIN = min.result
      fetch('/api/getProducts')
      .then(raw =>raw.json())
      .then(function(response) {
          console.log(response)
          if (!response.error) {
              products=response.result
              var row=""
              for(let i = 0 ; i<response.result.length;i++){
                  var item = response.result[i]
                  row += '<tr>';
                  row += '<td>' + item.id + '</td>';
                  row += '<td>' + item.name + '</td>';
                  row += '<td>' + item.price.toFixed(2) + '</td>';
                  row += '<td style="' + (item.stock < MIN ? 'color: red; font-weight: bold;' : '') + '">' + item.stock + '</td>';
                  row += '<td><div class="text-center">';
                  row += '<button class="btn btn-info" onclick="formEdit(' + item.id + ')"><i class="fas fa-edit"></i> Editar</button>';
                  row += '<button class="btn btn-danger" style="margin-left: 20px;" onclick="erase(' + item.id + ')"><i class="fas fa-trash-alt"></i> Eliminar</button>';
                  row += '</div></td>';
                  row += '</tr>';
              }
              document.getElementById('productTable').innerHTML=row
          } else {
              alert("ERROR cargando los datos ...")
          }
      })
      .catch(function(error) {
          alert("ERROR")
          console.log(error)
      });
      }
    )
}

function formInsert() {
  const form = document.getElementById('insertForm');
  const productInput = document.getElementById('product');
  const priceInput = document.getElementById('price');
  const quantityInput = document.getElementById('quantity');

  const product = productInput.value;
  const price = parseFloat(priceInput.value);
  const quantity = parseInt(quantityInput.value);

  
  let isValid = true;
  let errorMessage = [];
    
  if (product.trim() === '') {
    isValid = false;
    errorMessage.push('Ingrese el nombre del producto.');
  }

  if (isNaN(price) || price <= 0) {
    isValid = false;
    errorMessage.push('El precio debe ser un número positivo.');
  }

  if (isNaN(quantity) || quantity <= 0) {
    isValid = false;
    errorMessage.push('La cantidad debe ser un número positivo.');
  }

  if (!isValid) {
    mostrarErrores(errorMessage);
    return;
  }

  
  const data = { name: product, price: price, stock: quantity };

  fetch('/api/insertProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseData => {
      Swal.fire({
        title: 'Mensaje',
        text: 'Ingreso exitoso',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      console.log(responseData);
      actualize();
      document.getElementById("product").value=""
      document.getElementById("price").value=""
      document.getElementById("quantity").value=""
    })
    .catch(error => {
      Swal.fire({
        title: 'Mensaje',
        text: 'Ingreso fallido',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Error:', error);
    });
   
}

function formEdit(id){
    console.log(id)
    const p = item(id)
    if(p==null){
        return ;
    }

    Swal.fire({
        title: 'Edicion de Producto',
        html: `
          <form id="editForm">
            <input type="hidden" class="form-control" id="id" name="id" value=${p.id}>
            <div class="form-group">
              <label for="product">Nombre:</label>
              <input value='${p.name}' type="text" class="form-control" id="product" name="product" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
  
            <div class="form-group">
              <label for="price">Precio:</label>
              <input value=${p.price} type="number" class="form-control" id="price" name="price" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
  
            <div class="form-group">
              <label for="quantity">Cantidad :</label>
              <input value=${p.stock} type="number" class="form-control" id="quantity" name="quantity" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
          </form>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const form = document.getElementById('editForm');
         
            const id = form.id.value;
            const product = form.product.value;
            const price = form.price.value;
            const quantity = form.quantity.value;
  
            

            let isValid = true;
            let errorMessage = '';

            if (product.trim()=='') {
              isValid = false;
              errorMessage += 'Ingrese el nombre del producto. \n';
            }

            if (isNaN(price) || price <= 0) {
              isValid = false;
              errorMessage += 'El precio debe ser un número positivo. \n';
            }

            if (isNaN(quantity) || quantity <= 0) {
              isValid = false;
              errorMessage += 'La cantidad debe ser un número positivo. \n';
            }

            if(isValid){
              return { name: product, price: price, stock: quantity ,id:id};
            }
            
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            return false;
          
        }
      }).then((result) => {
        if (result && result.isConfirmed) {
          const data = result.value;
          fetch('/api/updateProduct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(responseData => {
                  Swal.fire({
                  title: 'Mensaje',
                  text: 'Cambios guardados de manera exitosa',
                  icon: 'success',
                  confirmButtonText: 'OK'
                  })
                console.log(responseData);
                actualize()
              })
              .catch(error => {
                  Swal.fire({
                      title: 'Mensaje',
                      text: 'Cambio fallido',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  })
                console.error('Error:', error);
              });
        }
      });
}

function erase(id) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea realizar esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/deleteProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    title: 'Mensaje',
                    text: 'Cambios guardados de manera exitosa',
                    icon: 'success',
                    confirmButtonText: 'OK'
                    })
                console.log(data);
                actualize()
            })
            .catch(error => {
                Swal.fire({
                    title: 'Mensaje',
                    text: 'Error, no se guardo el cambio...',
                    icon: 'error',
                    confirmButtonText: 'OK'
                    })
                console.error('Error:', error);
        });
      } 
    });
}
  
function item(id){
    for (let index = 0; index < products.length; index++) {
        if(products[index].id==id){
            return products[index];
        }
    }
    return null;
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


function downloadReport() {
  fetch('/api/getProducts')
    .then(raw => raw.json())
    .then((response) =>{
      if (!response.error) {
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
              const pageTitle = 'Reporte de Productos';
              const pageTitleWidth = doc.getTextWidth(pageTitle);
              doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 65);

              // TABLA
              const products = response.result;
              console.log(products)
              let TOTAL = 0;
              const tableData = [];
              const headers = ['ID', 'Nombre','Stock actual','Unidades vendidas','Total'];
              tableData.push(headers);
              
              // Agregar filas a la tabla
              for (let i = 0; i < products.length; i++) {
                tableData.push([
                  products[i].id,
                  products[i].name,
                  products[i].stock,
                  products[i].sales,
                  "S/."+products[i].total.toFixed(2)
                 ])
                  TOTAL = TOTAL  +products[i].total         
              }
              
              
              tableData.push(["","","","TOTAL:","S/."+TOTAL.toFixed(2)])
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

      } else {
        alert("ERROR cargando los datos...");
      }
    })
    .catch(function(error) {
      alert("ERROR");
      console.log(error);
    });
}
