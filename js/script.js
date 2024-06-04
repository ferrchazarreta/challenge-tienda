const productosAll = async () => {
    try {
        let productos = await fetch('https://fakestoreapi.com/products')
        let productosJson = await productos.json()
        console.log(productosJson)
        render(productosJson)
    } catch (error) {
        console.error('Error:', error)
    }
}

const obtenerCategorias = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categorias = await response.json();

        let select = document.getElementById('categorias');
        let opciones = document.createElement('option');
        opciones.value = 'all';
        opciones.innerHTML = 'Todas las categorias';
        select.appendChild(opciones);

        categorias.forEach(categoria => {
            let nombreCategoria = document.createElement('option');
            nombreCategoria.value = categoria;
            nombreCategoria.innerHTML = categoria;
            select.appendChild(nombreCategoria);
        });
    } catch (error) {
        console.error('Error', error);
    }
}

const filtrarCategoria = async () => {
    let categoriaSeleccionada = document.getElementById('categorias').value;
    console.log(categoriaSeleccionada);

    if (categoriaSeleccionada === 'all') {
        productosAll();
    } else {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/category/${categoriaSeleccionada}`);
            const productosCategoria = await response.json();
            render(productosCategoria);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

const render = async (productos) => {
    try {
        let contenedor = document.getElementById('listaProductos');
        contenedor.innerHTML = '';
        productos.forEach(producto => {
            let card = document.createElement('div')
            card.className = 'p-3';
            card.innerHTML = `
                <div class="card text-center" style='height: 25rem'>
                    <div>
                    <a class="rounded-4" data-type="image" onclick="renderDetalles(${producto}">
                        <img src="${producto.image}" class="card-img-top" style = 'height: 200px; width: 200px;' alt="imagen-producto">
                    </a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.category}</p>
                        <p class="card-text">${producto.price}</p>
                        <button onclick="agregarAlCarrito(${producto})" class="btn btn-success">Comprar</button>
                    </div>
              </div>
              `
            contenedor.appendChild(card)

        });
        await new Promise(resolve => setInterval(resolve, 1000));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Renderizar detalles
const renderDetalles = async(producto) =>{
    const contenedorDetalle = document.getElementById('listaProductos')
    contenedorDetalle.innerHTML = ''

    let container = document.createElement('container')
    container.className = 'container'
    container.innerHTML = `
    <div class="row gx-5">
        <aside class="col-lg-6">
            <div class = "border rounded-4 mb-3 d-flex justify-content-center>
                <a class = "rounded-4" data-type = "image">
                    <img src="${producto.image}" class="rounded-4" style = 'max-width:100%; max-height:100vh; margin:auto;'>

                </a>
            </div>
        </aside>
        <div class="col-lg-6">
            <div class="ps-lg-3"
                <h2 class="title text-dark">${producto.title}</h2>
                <p class="text-muted">${producto.description}</p>
                <button onclick="agregarAlCarrito(${producto})" class="btn btn-success">Comprar</button>
            </div>
        </div>
    `
    contenedorDetalle.appendChild(container)
}

// Obtener todos los elementos del LocalStorage
const obtenerCarritoLS = async () => {
    let carritoLS = JSON.parse(localStorage.getItem('carrito'));
    return carritoLS ? JSON.parse(carritoLS) : [];
}

// Guardar todos los elementos en el LocalStorage
const guardarCarritoLS = async (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// Agregar los productos al carrito en el LocalStorage
const agregarAlCarrito = async (producto) => {
    let carrito = await obtenerCarritoLS();
    carrito.forEach(productoCarrito => {
        if (productoCarrito.id === producto.id) {
            carrito[carrito.indexOf(carrito.find(posicion => posicion.id === producto.id))].cantidad += 1;
        } else {
            carrito.push({ id: producto.id, cantidad: 1 });
        }
    }
    )
    await guardarCarritoLS(carrito);
}

// Renderizar carrito de compras
const renderCarrito = async () => {
    //Resetear vista
    const contenedorCarrito = document.getElementById('listaProductos')
    contenedorCarrito.innerHTML = ''

    let carrito = await obtenerCarritoLS()
    let total = 0
    let tabla = document.createElement('table')
    tabla.className = 'table table-striped'
    tabla.innerHTML = `
        <thead class="thead-dark">
            <tr>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Cantidad</th>
            </tr>
        </thead>
    `
    let body = document.createElement('tbody')
    carrito.forEach(productoCarrito => {
        let fila = document.createElement('tr')
        fila.innerHTML = `
            <th scope="row">${productoCarrito.title}</th>
            <td>${productoCarrito.price}</td>
            <td>Cantidad</td>
        `
        body.appendChild(fila)
    })
    tabla.appendChild(body)
    contenedorCarrito.appendChild(tabla)
}



const main = async () => {
    //Inicializar todos los productos
    productosAll()
    // Inicializar la obtención de categorías al cargar la página
    document.addEventListener('DOMContentLoaded', obtenerCategorias);

    // Cambiar productos en base a las categorias
    document.getElementById('categorias').addEventListener('change', filtrarCategoria);
    let verCarrito = document.getElementById('verCarrito')
    verCarrito.addEventListener('click',()=>{
        renderCarrito()
    })
}

main()