function logout1(){


    Swal.fire({
        title: '¿ Esta Seguro ?',
        text: "Cerrar Dashboard y Guardar los Cambios",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2b914a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado',
            window.location.href = '../login',
            'Su archivo ha sido eliminado.',
            'success'
          )
        }
      })

}

