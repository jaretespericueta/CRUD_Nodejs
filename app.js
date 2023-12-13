document.addEventListener("DOMContentLoaded", function () {
    const elementList = document.getElementById("elementList");
    const elementForm = document.getElementById("elementForm");
    const createBtn = document.getElementById("createBtn");
  
    // Función para cargar la lista de elementos
    function loadElements() {
      // Realiza una solicitud GET a la API REST para obtener la lista de elementos
      fetch("/server.js")
        .then((response) => response.json())
        .then((data) => {
          // Limpia la lista existente
          elementList.innerHTML = "";
  
          // Agrega cada elemento a la lista
          data.forEach((element) => {
            const li = document.createElement("li");
            li.textContent = `${element.name}: ${element.description}`;
            elementList.appendChild(li);
          });
        })
        .catch((error) => {
          console.error("Error al cargar elementos:", error);
        });
    }
  
    // Función para crear un elemento
    function createElement(name, description) {
      // Realiza una solicitud POST a la API REST para crear un nuevo elemento
      fetch("/server.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Limpia los campos del formulario
          document.getElementById("name").value = "";
          document.getElementById("description").value = "";
  
          // Recarga la lista de elementos
          loadElements();
        })
        .catch((error) => {
          console.error("Error al crear elemento:", error);
        });
    }
  
    // Evento para crear un elemento
    createBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const description = document.getElementById("description").value;
  
      if (name && description) {
        createElement(name, description);
      }
    });
  
    // Cargar la lista de elementos al cargar la página
    loadElements();
  });