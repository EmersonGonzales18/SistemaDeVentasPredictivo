function logout(){
    fetch('/api/logaut')
        .then(response => response.json())
        .then(data => {
            window.location.href = '../login';
        })
        .catch(error => {
          console.error('Error:', error);
        });
}