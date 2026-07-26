// ===============================
// MODO CALIBRACIÓN
// ===============================

const layer = document.getElementById("chairLayer");

const modal = document.getElementById("modal");

const cerrarModal = document.getElementById("cerrarModal");

const tituloModal = document.getElementById("tituloModal");

const textoModal = document.getElementById("textoModal");

const btnEnviar = document.getElementById("btnEnviar");

let sillaActual = null;

let drag = null;

let aportesPorSilla = {};
let estadoDonaciones = [];

// ===============================
// DIBUJAR SILLAS
// ===============================

function dibujarSillas(){
    

    layer.innerHTML="";

    chairs.forEach(chair=>{

        const punto=document.createElement("div");

        punto.className="chair";
        const recaudado = aportesPorSilla[chair.nombre] || 0;

if (recaudado >= chair.meta) {
    punto.classList.add("completa");
}

        punto.style.left=`calc(${chair.x}% - 17px)`;

        punto.style.top=`calc(${chair.y}% - 17px)`;

        punto.innerHTML=`<span>${chair.nombre}</span>`;



        // Abrir formulario con doble clic

        punto.ondblclick=()=>{

            sillaActual = chair;

const recaudado = aportesPorSilla[chair.nombre] || 0;
const donantes = estadoDonaciones.filter(
    d => d.silla === chair.nombre
);
let listaDonantes = "";

donantes.forEach(d => {

    listaDonantes +=
        `❤️ $${d.valor.toLocaleString("es-CO")}<br>`;

});
tituloModal.innerHTML = chair.nombre;

textoModal.innerHTML =
`Meta: <strong>$${chair.meta.toLocaleString("es-CO")}</strong><br>
Recaudado: <strong>$${recaudado.toLocaleString("es-CO")}</strong><br><br>

<strong>Aportes recibidos</strong><br>

${listaDonantes || "Aún no hay aportes para esta silla."}`;

if (recaudado >= chair.meta) {

    btnEnviar.style.display = "none";

    textoModal.innerHTML +=
    "<br><br>✅ ESTA SILLA ALCANZÓ SU META, PERO HAY MÁS!! Busca los puntos grires!";

} else {

    btnEnviar.style.display = "block";

}

modal.style.display = "flex";

        }



        // Arrastrar (solo durante calibración)

// punto.onmousedown=(e)=>{
//
//     drag={
//         chair,
//         punto
//     };
//
//     e.preventDefault();
//
// }

        layer.appendChild(punto);

    });

}

dibujarSillas();
cargarEstado();




// ===============================
// MOVER
// ===============================

document.onmousemove=(e)=>{

    if(!drag) return;

    const rect=layer.getBoundingClientRect();

    let x=(e.clientX-rect.left)/rect.width*100;

    let y=(e.clientY-rect.top)/rect.height*100;

    x=Math.max(0,Math.min(100,x));

    y=Math.max(0,Math.min(100,y));

    drag.chair.x=Number(x.toFixed(1));

    drag.chair.y=Number(y.toFixed(1));

    drag.punto.style.left=`calc(${drag.chair.x}% - 17px)`;

    drag.punto.style.top=`calc(${drag.chair.y}% - 17px)`;

}



// ===============================
// SOLTAR
// ===============================

document.onmouseup=()=>{

    if(!drag) return;

    console.clear();

    console.log("COPIA ESTAS COORDENADAS:");

    chairs.forEach(c=>{

        console.log(
`${c.nombre}
x:${c.x},
y:${c.y}`
        );

    });

    drag=null;

}



// ===============================
// MODAL
// ===============================

cerrarModal.onclick=()=>{

    modal.style.display="none";

}

window.onclick=(e)=>{

    if(e.target===modal){

        modal.style.display="none";

    }

}



// ===============================
// BOTÓN
// ===============================

btnEnviar.onclick = async () => {
    console.log("Botón presionado");

       const nombre = document.getElementById("nombre").value.trim();

    const valor = document.getElementById("valor").value;

    const mensaje = document.getElementById("mensaje").value.trim();
const email = document.getElementById("email").value.trim();
    if (nombre === "") {

        alert("Por favor escribe tu nombre.");

        return;

    }

    if (valor === "" || Number(valor) <= 0) {

        alert("Ingresa el valor de tu aporte.");

        return;

    }

    const datos = {

        silla: sillaActual.nombre,

        nombre,

        valor,

        mensaje

    };

    try {

        const respuesta = await fetch(
            "https://script.google.com/macros/s/AKfycbyeh-HSJKzkSYkawJBmOu6sLgxo7_r4BFy7sHfb2GpXDNJLB3rZtWgYwN-ROYLkharl/exec",
            {

                method: "POST",

body: new URLSearchParams({
    silla: sillaActual.nombre,
    nombre: nombre,
    valor: valor,
    mensaje: mensaje,
    email: email
})

            }

        );

        const texto = await respuesta.text();
console.log(texto);
const resultado = JSON.parse(texto);


        if (resultado.ok) {

            alert("🙏 ¡Muchas gracias! Tu aporte quedó registrado.");

            document.getElementById("nombre").value = "";

            document.getElementById("valor").value = "";

            document.getElementById("mensaje").value = "";
await cargarEstado();
            modal.style.display = "none";

        } else {

    alert(resultado.error);

    await cargarEstado();

}

    } catch (error) {

        alert("No fue posible conectar con el servidor.");

        console.error(error);

    }

};
async function cargarEstado() {

    try {

        const respuesta = await fetch(
            "https://script.google.com/macros/s/AKfycbyeh-HSJKzkSYkawJBmOu6sLgxo7_r4BFy7sHfb2GpXDNJLB3rZtWgYwN-ROYLkharl/exec"
        );

        const estado = await respuesta.json();
        estadoDonaciones = estado.donaciones;
        const lista = document.getElementById("listaDonantes");

lista.innerHTML = "";

estadoDonaciones.forEach(d => {

    if (d.mensaje && d.mensaje.trim() !== "") {

        lista.innerHTML += `
            <div class="mensaje-donacion">
                ❤️ <strong>${d.nombre}</strong><br>
                ${d.mensaje}
            </div>
        `;

    }

});
console.log(estado.donaciones);
aportesPorSilla = {};

estado.donaciones.forEach(d => {

    if (!aportesPorSilla[d.silla]) {

        aportesPorSilla[d.silla] = 0;

    }

    aportesPorSilla[d.silla] += d.valor;

});
dibujarSillas();

console.log(aportesPorSilla);
        document.getElementById("dineroTotal").innerHTML =
            "$" + estado.recaudado.toLocaleString("es-CO");

        const porcentaje = estado.recaudado / estado.meta * 100;

        document.getElementById("barraProgreso").style.width =
            porcentaje + "%";

        document.getElementById("porcentajeGeneral").innerHTML =
            porcentaje.toFixed(1) + "% de $" + estado.meta.toLocaleString("es-CO");

    } catch (error) {

        console.error(error);

    }

}