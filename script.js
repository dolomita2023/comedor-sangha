// ===============================
// MODO CALIBRACIÓN
// ===============================

const layer = document.getElementById("chairLayer");

const modal = document.getElementById("modal");

const cerrarModal = document.getElementById("cerrarModal");

const tituloModal = document.getElementById("tituloModal");

const textoModal = document.getElementById("textoModal");

const btnEnviar = document.getElementById("btnEnviar");

const camposAporte = document.getElementById("camposAporte");

const pagoInfo = document.getElementById("pagoInfo");

let sillaActual = null;

let drag = null;

let aportesPorSilla = {};
let estadoDonaciones = [];

const SILLA_SANGHA = "Silla Sangha";

let sanghaTooltipEl = null;
let sanghaTooltipTimer = null;

// ===============================
// SILLA SANGHA (excepción)
// ===============================

function todasLasDemasSillasCompletas(){

    return chairs.every(c => {

        if (c.nombre === SILLA_SANGHA) return true;

        return (aportesPorSilla[c.nombre] || 0) >= c.meta;

    });

}

function cerrarTooltipSangha(){

    if (sanghaTooltipEl) {
        sanghaTooltipEl.remove();
        sanghaTooltipEl = null;
    }

    if (sanghaTooltipTimer) {
        clearTimeout(sanghaTooltipTimer);
        sanghaTooltipTimer = null;
    }

}

function mostrarTooltipSangha(punto){

    cerrarTooltipSangha();

    const tip = document.createElement("div");

    tip.className = "sangha-tooltip";

    tip.innerHTML =
        "🌸 La <strong>Silla Sangha</strong> se habilita cuando " +
        "<strong>todas las demás sillas</strong> alcancen su meta.<br>" +
        "¡Sigamos apoyando esas primero!";

    punto.appendChild(tip);

    sanghaTooltipEl = tip;

    sanghaTooltipTimer = setTimeout(cerrarTooltipSangha, 4000);

}

document.addEventListener("click", (e) => {

    if (sanghaTooltipEl && !e.target.closest(".chair")) {
        cerrarTooltipSangha();
    }

});

// ===============================
// DIBUJAR SILLAS
// ===============================

function dibujarSillas(){
    

    layer.innerHTML="";

    chairs.forEach(chair=>{

        const punto=document.createElement("div");

        punto.className="chair";
        const recaudado = aportesPorSilla[chair.nombre] || 0;
        const esSangha = chair.nombre === SILLA_SANGHA;

if (recaudado >= chair.meta && !esSangha) {
    punto.classList.add("completa");
}

if (esSangha && !todasLasDemasSillasCompletas()) {
    punto.classList.add("bloqueada");
}

        punto.style.left=`calc(${chair.x}% - 17px)`;

        punto.style.top=`calc(${chair.y}% - 17px)`;

        punto.innerHTML=`<span>${chair.nombre}</span>`;



        // Abrir formulario con un solo clic

        punto.onclick=()=>{

            const esSangha = chair.nombre === SILLA_SANGHA;

            if (esSangha && !todasLasDemasSillasCompletas()) {

                mostrarTooltipSangha(punto);

                return;

            }

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

const metaAlcanzada = recaudado >= chair.meta && !esSangha;

if (metaAlcanzada) {

    camposAporte.style.display = "none";

    pagoInfo.style.display = "none";

    btnEnviar.style.display = "none";

    textoModal.innerHTML +=
    "<br><br>✅ ESTA SILLA ALCANZÓ SU META, PERO HAY MÁS!! Busca los puntos grises!";

} else {

    camposAporte.style.display = "block";

    pagoInfo.style.display = "flex";

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
const idTransaccion = document.getElementById("idTransaccion").value.trim();
const email = document.getElementById("email").value.trim();
    if (nombre === "") {

        alert("Por favor escribe tu nombre.");

        return;

    }

    if (valor === "" || Number(valor) <= 0) {

        alert("Ingresa el valor de tu aporte.");

        return;

    }

    if (idTransaccion === "") {

        alert("Ingresa el ID de la transacción del pago.");

        return;

    }

    if (email === "") {

        alert("Ingresa tu correo electrónico.");

        return;

    }

    const datos = {

        silla: sillaActual.nombre,

        nombre,

        valor,

        mensaje,

        idTransaccion,

        email

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
    idTransaccion: idTransaccion,
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