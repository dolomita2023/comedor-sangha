// Página de cierre de la campaña: solo lectura.
// Lee los mensajes desde la API (GET) y los muestra. No envía nada.

const API_URL = "https://script.google.com/macros/s/AKfycbyeh-HSJKzkSYkawJBmOu6sLgxo7_r4BFy7sHfb2GpXDNJLB3rZtWgYwN-ROYLkharl/exec";

const contenedor = document.getElementById("listaMensajes");

function mostrarEstado(texto){

    contenedor.innerHTML = "";

    const p = document.createElement("p");
    p.className = "estado";
    p.textContent = texto;

    contenedor.appendChild(p);

}

function mensajesDe(donaciones){

    return donaciones
        .map(d => String(d.mensaje == null ? "" : d.mensaje).trim())
        .filter(m => m !== "");

}

async function cargarMensajes(){

    try {

        const respuesta = await fetch(API_URL);
        const estado = await respuesta.json();

        const mensajes = mensajesDe(estado.donaciones || []);

        if (mensajes.length === 0) {
            mostrarEstado("Gracias por cada gesto de generosidad. ❤️");
            return;
        }

        contenedor.innerHTML = "";

        mensajes.forEach(texto => {

            const div = document.createElement("div");
            div.className = "mensaje";

            // textContent: el mensaje se muestra tal cual, nunca como HTML
            div.textContent = "“" + texto + "”";

            contenedor.appendChild(div);

        });

    } catch (error) {

        console.error(error);
        mostrarEstado("No pudimos cargar los mensajes. Intenta de nuevo en un momento.");

    }

}

cargarMensajes();
