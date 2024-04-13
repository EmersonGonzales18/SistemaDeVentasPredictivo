let USERS = []





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
let tabla;
$(async function () {
    tabla = $('#dataTable').DataTable({
      columnDefs: [
        {
          targets: -1,
          orderable: false, // No permitir el ordenamiento para la última columna (botones)
          render: function (data, type, row) {
            return `
              <button type="button" class="btn btn-info btn-sm" onclick="visualizarAlerta(${row[0]})">Ver</button>
            `;
          }
        }
      ]
    });
    
    const apiUrl = `../api/allAlertsById/2`; 
    let datos = await fetch(apiUrl, {
      method: "GET"
    });
    datos = await datos.json();
    datos = datos.result;
    let mat = [];
    for (const d of datos) {
      mat.push([d.au_id, d.title, d.date, ""]);
    }
    tabla.rows.add(mat).draw();
  });
  
  