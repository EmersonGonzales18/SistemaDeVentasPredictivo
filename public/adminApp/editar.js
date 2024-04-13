let data ={}
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

        const { name, first_name, last_name, age, gender, address,password } = blob.result;

        // Llenar los inputs con los datos obtenidos
        document.getElementById('name').value = name;
        document.getElementById('first_name').value = first_name;
        document.getElementById('last_name').value = last_name;
        document.getElementById('age').value = age;
        document.getElementById('gender').value = gender;
        document.getElementById('address').value = address;
        document.getElementById('password').value = password;
      })
      .catch(error => {
        console.error('Error al obtener la data:', error);
      });
}


function save(){
    const formulario = document.getElementById('editForm');

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
    
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('photo', photo);
    console.log(formData)


    let errores = [];

  if (
    name.trim() === '' ||
    password.trim() === '' ||
    firstName.trim() === '' ||
    lastName.trim() === '' ||
    age.trim() === '' ||
    gender.trim() === '' ||
    address.trim() === '' 
  ) {
    errores.push('Por favor, completa todos los campos.');
  }

  const parsedAge = parseInt(age);
  if (isNaN(parsedAge) || parsedAge < 0) {
    errores.push('La edad debe ser un número entero positivo.');
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(name)) {
    errores.push('El campo usuario debe ser un correo electrónico válido.');
  }

  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }


    fetch('/api/updateUserAdmin', {
        method: 'POST',
        body: formData
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
        
        getData();
        getPhoto()
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