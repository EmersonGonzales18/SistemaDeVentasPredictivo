function getMessage(){
    fetch('/api/getMessage')
    .then(response => response.json())
    .then(res => {
      console.log("RESP:", res);
      if (res.error) {
        Swal.fire({
          title: 'Mensaje',
          text: 'Error interno...',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        let list = res.result;
        if(list.length==0){
            return;
        }
        let mensaje = '<p>Por favor revisar el stock de los siguientes productos:</p><ul>';
        list.forEach(product => {
          mensaje += `<li>${product.name}: ${product.stock} unidades.</li>`;
        });
        mensaje += '</ul>';
  
        // Mostrar el mensaje con SweetAlert
        Swal.fire({
          title: 'Stocks bajos',
          html: mensaje,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      }
    }).catch((error)=>{
        Swal.fire({
            title: 'Mensaje',
            html: "Error al contactar con la API",
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
    });
  
  ////////////////////////////
}
getMessage();
