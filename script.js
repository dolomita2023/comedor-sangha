const container=document.getElementById("chairs");

chairs.forEach(chair=>{

container.innerHTML+=`

<div class="card">

<h2>${chair.nombre}</h2>

<p>Meta:
<strong>$${chair.meta.toLocaleString()}</strong></p>

<button>

❤️ Quiero aportar

</button>

</div>

`;

});