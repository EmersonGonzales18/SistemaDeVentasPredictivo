document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const enlaceContactenos = document.getElementById("contactenos"); //agregado

    
enlaceContactenos.addEventListener("click", function() { //agg
  Swal.fire(
    '¿Necesitas Ayuda?',
    'Comunicate al correo: soportemarkemechet@hotmail.com',
    'question'
  )
});


    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, pass })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result.ok === true) {

          
          if (data.result.role === 2) {
            
            window.location.href = '../adminApp'
            ;
          } else if (data.result.role === 1) {
            window.location.href = '../userApp';
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ERROR DE CREDENCIALES',
            
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  





  function PasswordVisibilidad() {
    var password = document.getElementById("password");
    var togglePassword = document.getElementById("togglePassword");

    if (password.type === "password") {
      password.type = "text";
      togglePassword.classList.remove("ion-eye");
      togglePassword.classList.add("ion-eye-disabled");

  
    } else {
      password.type = "password";
      togglePassword.classList.remove("ion-eye-disabled");
      togglePassword.classList.add("ion-eye");
    
    }



    
  }

function masinformacion(){
  Swal.fire({
    
    imageUrl: '/assets/informa.png',
    imageWidth: 900,
    imageHeight: 600,
    margin:0,
    imageAlt: 'Custom image',
  })
}








