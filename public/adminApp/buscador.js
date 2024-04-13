/* buscadorr */


const searchInput = document.getElementById('searchInput');
const productTable = document.getElementById('productTable');

// Agregar un evento de clic al botón de búsqueda
searchInput.addEventListener('keyup', function() {
  const searchText = searchInput.value.toLowerCase();

  // Filtrar las filas de la tabla basándose en el texto de búsqueda
  Array.from(productTable.getElementsByTagName('tr')).forEach(function(row) {
    const productName = row.getElementsByTagName('td')[1].textContent.toLowerCase();

    if (productName.includes(searchText)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});
