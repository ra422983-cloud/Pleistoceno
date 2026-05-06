let productoEditando = null;
function cambiar(img){
    document.getElementById("principal").src = img.src;
}

function validarFormulario(){
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let mensaje = document.getElementById("mensaje").value;

    if(nombre == "" || correo === "" || mensaje === ""){
        alert("Todos los campos son obligatorios");
        return false;
    }

    if(!correo.includes("@")){
        alert("Correo no valido");
        return false;
    }

    return true;
}

function toggleModo(){
    document.body.classList.toggle("oscuro");

    if(document.body.classList.contains("oscuro")){
        localStorage.setItem("modo", "Oscuro");
    } else {
        localStorage.setItem("modo", "claro");
    }
}

function agregarElemento(){
    let texto = document.getElementById("entradaLista").value;

    if(texto === "") return;

    let li = document.createElement("li");
    li.textContent = texto;

    document.getElementById("lista").appendChild(li);

    document.getElementById("entradaLista").value = "";
}

function darLike(){
    let likes = localStorage.getItem("likes") || 0;
    likes++;

    localStorage.setItem("likes", likes);
    document.getElementById("contadorLike").textContent = likes;
}

window.onscroll = function(){
    let btn = document.getElementById("btnArriba");

    if(document.documentElement.scrollTop > 200){
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

function subir(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

let index = 0;
function moverCarrusel(direccion){
    let imagenes = document.querySelectorAll(".carrusel img");

    if(imagenes.length === 0) return;

    imagenes[index].style.display = "none";

    index += direccion;

    if(index >= imagenes.length) index = 0;
    if(index < 0) index = imagenes.length - 1;

    imagenes[index].style.display = "block";
}

function cargarListaProductos(){
    fetch("http://localhost:3000/api/productos", {
        cache: "no-store"
    })
    .then(res => res.json())
    .then(data => {
        let lista = document.getElementById("productos");
        if(!lista) return;

        lista.innerHTML = "";

        data.forEach(p => {
            let li = document.createElement("li");

            li.innerHTML = `
    <strong>${p.nombre}</strong> 
    - $${p.precio} 
    - Stock: ${p.stock || 0}

    <button onclick="editarProducto(
    '${p._id}', 
    '${p.nombre.replace(/'/g, "")}', 
    '${p.precio}', 
    '${p.stock}'
)">
    Editar
</button>

    <button onclick="eliminarProducto('${p._id}')">
        Eliminar
    </button>
`;

            lista.appendChild(li);
        });
    });
}

window.onload = function(){
    cargarListaProductos();
    cargarTablaProductos();

    let likes = localStorage.getItem("likes") || 0;
    let contador = document.getElementById("contadorLike");
    if(contador){
        contador.textContent = likes;
    }
}

function guardarProducto(e){
    e.preventDefault();

    let nombre = document.getElementById("nombreProducto").value;
    let precio = document.getElementById("precioProducto").value;
    let stock = document.getElementById("stockProducto").value;

    if(nombre === "" || precio === "" || stock === ""){
        alert("Completa todos los campos");
        return;
    }

    // 🔥 SI ESTÁ EDITANDO
    if(productoEditando){
        fetch(`http://localhost:3000/api/productos/${productoEditando}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, precio, stock })
        })
        .then(res => res.json())
        .then(() => {
            productoEditando = null;
            limpiarFormulario();
            cargarProductos();
        });

    } else {
        // 🔥 SI ES NUEVO
        fetch("http://localhost:3000/api/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, precio, stock })
        })
        .then(res => res.json())
        .then(() => {
            limpiarFormulario();
            cargarProductos();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let enlaces = document.querySelectorAll("a");

    enlaces.forEach(link => {
        link.addEventListener("click", function(e){

            if(link.hostname !== location.hostname){
                e.preventDefault(); // detener apertura inmediata

                let confirmar = confirm("¿Estás seguro de que deseas salir de este sitio?");

                if(confirmar){
                    window.open(link.href, "_blank"); // abrir manualmente
                }
            }

        });
    });
});

function cargarTablaProductos(){
    fetch("http://localhost:3000/api/productos", {
        cache: "no-store"
    })
    .then(res => res.json())
    .then(data => {
        let tabla = document.getElementById("tablaProductos");
        if(!tabla) return;

        tabla.innerHTML = "";

        data.forEach(p => {
            let fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>${p.stock || 0}</td>
                <td>
                    <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
                </td>
            `;

            tabla.appendChild(fila);
        });
    });
}

function eliminarProducto(id){
    let confirmar = confirm("¿Seguro que quieres eliminar este producto?");
    if(!confirmar) return;

    fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        cargarListaProductos();
        cargarTablaProductos();
    });
}

function editarProducto(id, nombre, precio, stock){
    document.getElementById("nombreProducto").value = nombre;
    document.getElementById("precioProducto").value = precio;
    document.getElementById("stockProducto").value = stock;

    productoEditando = id;
}

function limpiarFormulario(){
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("stockProducto").value = "";
}