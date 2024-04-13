actualize()
let products=[]
function actualize(){
    fetch('/api/getUsers')
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
                row += '<td>' + item.first_name+" "+item.last_name + '</td>';
                row += '<td>' + item.address + '</td>';
                
                
                row += '<td><div class="text-center">';
                row += '<button class="btn btn-info" onclick="formEdit(' + item.id + ')"><i class="fas fa-edit"></i> Editar</button>';
                row += '<button class="btn btn-danger" style="margin-left: 20px;" onclick="erase(' + item.id + ')"><i class="fas fa-trash-alt"></i> Eliminar</button>';
                row += '</div></td>';
                row += '</tr>';
            }
            console.log("USUARIOS:",products)
            document.getElementById('productTable').innerHTML=row
        } else {
            alert("ERROR cargando los datos ...")
        }
    })
    .catch(function(error) {
        alert("ERRORadasddsa")
        console.log(error)
    });
}

function formInsert() {
  const formulario = document.getElementById('insertForm');
  const name = formulario.name.value;
  const password = formulario.password.value;
  const rePass = formulario.rePass.value;
  const firstName = formulario.first_name.value;
  const lastName = formulario.last_name.value;
  const age = formulario.age.value;
  const gender = formulario.gender.value;
  const address = formulario.address.value;
  const photo = formulario.photo.files[0];

  const formData = new FormData();
  formData.append('name', name);
  formData.append('password', password);
  formData.append('rePass', rePass);
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('age', age);
  formData.append('gender', gender);
  formData.append('address', address);
  formData.append('photo', photo);

  let errores = [];

  if (
    name.trim() === '' ||
    password.trim() === '' ||
    rePass.trim() === '' ||
    firstName.trim() === '' ||
    lastName.trim() === '' ||
    age.trim() === '' ||
    gender.trim() === '' ||
    address.trim() === '' ||
    photo === undefined
  ) {
    errores.push('Por favor, completa todos los campos.');
  }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 0) {
    errores.push('La edad debe ser un número entero positivo.');
  }


  if (password.length > 7 || rePass.length > 7) {
    errores.push('Su contraseña debe tener máximo 7 dígitos');
  }
  if(age <18 ||age >90){
    errores.push('La Edad esta fuera de Rango');

  }
  if (password !== rePass) {
    errores.push('Las contraseñas no coinciden.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(name)) {
    errores.push('El campo usuario debe ser un correo electrónico válido.');
  }

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }


    
  
    fetch('/api/insertUsers', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        var inputFile = document.getElementById('photo');
        inputFile.files[0]=null
        var label = document.getElementById('photo-label');
        label.textContent = ""; 
        actualize()
        if(data.error){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.msg,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
          return;
        }
        if (data.result) {
          // El usuario se insertó correctamente
          Swal.fire({
            icon: 'success',
            title: 'Usuario insertado',
            text: 'El usuario se ha insertado correctamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            formulario.reset();
          });
        } else {
          // Hubo un error al insertar el usuario
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al insertar el usuario.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error en la solicitud.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      });
}

function formEdit(id) {
    console.log(id);
    const p = item(id);

    if (p == null) {
        return;
    }

    Swal.fire({
        didRender:()=>{
          console.log("RENDER")
          let photo=document.getElementById('editForm').photo
          console.log(photo)
          photo.addEventListener('change', function(event) {
            
            var input = event.target;
            var fileName = input.files[0].name;
            var label = document.getElementById('photo-label-edit');
            label.textContent = fileName;
          });
        },
        title: 'Edicion de Usuario',
        html: `
        <form id="editForm" enctype="multipart/form-data">
                                <div class="form-row">
                                <input type="hidden" class="form-control" id="id" name="id" value='${p.id}' >
                                  <div class="form-group col-md-6">
                                    <label for="name">Usuario (Correo):</label>
                                    <input type="email" class="form-control" id="name" name="name" value='${p.name}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  <div class="form-group col">
                                    <label for="password">Contraseña:</label>
                                    <input type="password" class="form-control" id="password" name="password" value='${p.password}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  
                                  <div class="form-group col-md-6">
                                    <label for="first_name">Nombres:</label>
                                    <input type="text" class="form-control" id="first_name" name="first_name" value='${p.first_name}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  <div class="form-group col-md-6">
                                    <label for="last_name">Apellidos:</label>
                                    <input type="text" class="form-control" id="last_name" name="last_name" value='${p.last_name}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  <div class="form-group col-md-6">
                                    <label for="age">Edad:</label>
                                    <input type="number" class="form-control" id="age" name="age" value='${p.age}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  <div class="form-group col-md-6">
                                    <label for="gender">Género:</label>
                                    <select class="form-control" id="gender" name="gender"  required>
                                      
                                    <option value="1" ${p.gender === '1' ? 'selected' : ''}>Femenino</option>
                                    <option value="0" ${p.gender === '0' ? 'selected' : ''}>Masculino</option>
                                    
                                    </select>
                                    <div class="invalid-feedback">Debe seleccionar su género</div>
                                  </div>
                                  <div class="form-group col-md-6">
                                    <label for="adress">Dirección:</label>
                                    <input type="text" class="form-control" id="address" name="address" value='${p.address}' required>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  <div class="form-group col">
                                    <label for="photo">Foto de perfil:</label>
                                    <div class="custom-file">
                                      <input type="file" class="custom-file-input" id="photo" name="photo" required>
                                      <label class="custom-file-label" for="photo" id="photo-label-edit">Seleccionar archivo</label>
                                    </div>
                                    <div class="invalid-feedback">Este campo es obligatorio</div>
                                  </div>
                                  
                                </div>
                                     
        </form>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const formulario = document.getElementById('editForm');
            const id = formulario.id.value;
            const name = formulario.name.value;
            const password = formulario.password.value;

            const firstName = formulario.first_name.value;
            const lastName = formulario.last_name.value;
            const age = formulario.age.value;
            const gender = formulario.gender.value;
            const address = formulario.address.value;
            const photo = formulario.photo.files[0];

            const formData = new FormData();
            formData.append('name', name);
            formData.append('password', password);
            formData.append('id', id);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('address', address);
            formData.append('photo', photo);

            if (
              name.trim() === '' ||
              password.trim() === '' ||
              
              firstName.trim() === '' ||
              lastName.trim() === '' ||
              age.trim() === '' ||
              gender.trim() === '' ||
              address.trim() === '' 
            ) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Por favor, completa todos los campos.",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              
              return false;
            }

            const parsedAge = parseInt(age);
            if (isNaN(parsedAge) || parsedAge < 0) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "La edad debe ser un número entero positivo.",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              return false;
            }

            

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(name)) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "El campo nombre debe ser un correo electrónico válido.",
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
              });
              return false;
            }

            return formData;
        }
    }).then((result) => {
        if (result && result.isConfirmed) {
            const data = result.value;
            fetch('/api/updateUsers', {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(responseData => {
                    if(responseData.error){
                      Swal.fire({
                        title: 'Mensaje',
                        text: responseData.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
                      return;
                    }
                    if(!responseData.result){
                      Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambio fallido...',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
                      return;
                    }
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambios guardados de manera exitosa',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    
                    actualize();
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambio fallido',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
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
        fetch('/api/deleteUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.result){
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambios guardados de manera exitosa',
                        icon: 'success',
                        confirmButtonText: 'OK'
                        })
                    console.log(data);
                }else{
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Error, no se guardo el cambio...',
                        icon: 'error',
                        confirmButtonText: 'OK'
                        })
                    console.error('Error:', error);
                }
                
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
        if(products[index].id==id ){
            return products[index];
        }
    }
    return null;
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


function downloadReport() {
    fetch('/api/allSalesInfo')
      .then(raw => raw.json())
      .then((response)=> {
        if (!response.error) {
          const imagenURL = './img/3.png'; 
          fetch(imagenURL)
          .then(r => r.blob())
          .then(IMG => {
              const doc = new jsPDF();
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
              const pageTitle = 'Reporte de Vendedores';
              const pageTitleWidth = doc.getTextWidth(pageTitle);
              doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 65);

              // TABLA
              let headers=['Correo','Nombre', 'Dirección', 'Ventas Totales'];
              let table =[];
              table.push(headers)
              let TOTAL = 0;
              for(let vendedor of products){
                let ID = vendedor.id;
                let total = 0;
                for(let venta in response.result){
                  if(ID==response.result[venta].USID){
                    total=total+response.result[venta].monto;
                  }
                }
                table.push([
                  vendedor.name,
                  vendedor.first_name+" "+vendedor.last_name,
                  vendedor.address,
                  "S/."+total.toFixed(2)
                ])
                TOTAL = TOTAL +total
              }
              console.log("TABLA:",table)
              table.push(["","","TOTAL","S/."+TOTAL.toFixed(2)])
          
              // Generar la tabla en el documento PDF
              doc.autoTable({
                head: [table[0]], // Cabecera de la tabla
                body: table.slice(1), // Filas de la tabla
                startY: 75, // Posición inicial de la tabla
              });  
          
              // Descargar el documento PDF
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
  
  