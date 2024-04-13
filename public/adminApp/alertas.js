let ALERTASUI = document.getElementById("ALERTASUI")
obtenerAlertas(1)
setInterval(()=>{
    obtenerAlertas(1)
},2000)
function obtenerAlertas(modo) {
    const apiUrl = `../api/allAlertsById/${modo}`; 
  
    fetch(apiUrl, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error al obtener alertas:", data.message);
        } else {
          console.log("Alertas obtenidas:", data.result);
          visualizar( data.result)
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
}

function visualizar(alertas) {

    const alertsDropdown = ALERTASUI.querySelector("#alertsDropdown");
    const badgeCounter = ALERTASUI.querySelector(".badge-counter");
    const dropdownList = ALERTASUI.querySelector(".dropdown-list");
    console.log("Mensajes:",alertas.length)
    // Actualizar el número de alertas en el contador
    badgeCounter.innerText = alertas.length;
    if (alertas.length < 1) {
      badgeCounter.style.display = "none";
    }else{
        badgeCounter.style.display = "";
    }
  
    // Eliminar las alertas actuales del dropdown
    dropdownList.innerHTML = `
      <h6 class="dropdown-header">
          Alertas
      </h6>
    `;
  
    // Crear y agregar nuevas alertas al dropdown
    alertas.forEach((alert) => {
      const alertItem = document.createElement("a");
      alertItem.classList.add("dropdown-item", "d-flex", "align-items-center");
      alertItem.href = "#";
  
      const iconCircle = document.createElement("div");
      iconCircle.classList.add("mr-3", "icon-circle", `bg-${alert.ok ? "success" : "warning"}`);
      iconCircle.innerHTML = `<i class="fas fa-${alert.icon == 1 ? "exclamation-triangle" : "fa-file-alt"} text-white"></i>`;
  
      const alertContent = document.createElement("div");
      alertContent.innerHTML = `
        <div class="small text-gray-500">${alert.date}</div>
        <span class="font-weight-bold">${alert.title}</span>
      `;
  
      alertItem.appendChild(iconCircle);
      alertItem.appendChild(alertContent);
  
      // Agregar el evento de clic para mostrar el Swal al hacer clic en la alerta
      alertItem.addEventListener("click", () => {
        visualizarAlerta(alert.au_id)

      });
  
      dropdownList.appendChild(alertItem);
    });
  
    // Agregar el enlace "Show All Alerts" al final del dropdown
    const showAllLink = document.createElement("a");
    showAllLink.classList.add("dropdown-item", "text-center", "small", "text-gray-500");
    showAllLink.href = "./visorAlertas.html";
    showAllLink.innerText = "Ver todo";
    dropdownList.appendChild(showAllLink);
  }
  
// Función para obtener los detalles de una alerta por su ID
async function obtenerAlertaPorId(id) {
    const apiUrl = `/api/alertById/${id}`; // Ajusta la URL de la API según tu servidor
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET"
      });
      
      if (!response.ok) {
        throw new Error("No se pudo obtener la alerta.");
      }
  
      const data = await response.json();
      console.log("ESTO LLEGO,",data)
      return data.result[0]; // Debes ajustar el formato de respuesta de acuerdo a tu API
    } catch (error) {
      console.error("Error al obtener la alerta:", error.message);
      return null;
    }
  }
  
  // Función para visualizar una alerta en detalle usando SweetAlert2 (Swal)
async function visualizarAlerta(id) {
    const alerta = await obtenerAlertaPorId(id);
    console.log("VISTOOO:",id,alerta)
    await fetch(`/api/checkAlert/${id}`,{
        method: "GET"
    })
  
    if (!alerta) {
      return; // Si no se pudo obtener la alerta, no hacemos nada
    }
  
    // Crear el contenido HTML del modal personalizado
    const modalContent = document.createElement("div");
    modalContent.innerHTML = `
      <h5 class="font-weight-bold">${alerta.title}</h5>
      <p class="text-muted">${alerta.date}</p>
      <div>${alerta.descripcion}</div>
    `;
  
    // Mostrar el mensaje de la alerta en un modal personalizado con SweetAlert2
    Swal.fire({
      html: modalContent,
      showCloseButton: true, // Mostrar botón de cerrar (X) en la esquina superior derecha
      customClass: {
        container: "custom-swal-modal", // Clase CSS para el contenedor del modal personalizado
      },
      onClose: () => {
        // Limpiar el contenido del modal al cerrarlo
        modalContent.innerHTML = "";
      },
    });
  }
  