function mostrarErrores(errores) {
    let html = '<ul>';
    for (const error of errores) {
      html += `<li>${error}</li>`;
    }
    html += '</ul>';
  
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: html
    });
}

