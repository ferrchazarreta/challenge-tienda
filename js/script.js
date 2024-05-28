const fetchApi = async()=>{
    try {
        let productos = await fetch('https://fakestoreapi.com/products')
        let productosJson = await productos.json()
        console.log(productosJson)
        return productosJson
    } catch (error) {
        console.error('Error:',error)
    }
}

const obtenerCategorias = async()=>{
    try {
        await fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(categorias=>{
                let select = document.getElementById('categorias')
                let opciones = document.createElement('option')
                opciones.value = 'all'
                opciones.innerHTML = 'Todas las categorias'
                select.appendChild(opciones)

                categorias.forEach(categoria =>{
                    let nombreCategoria = document.createElement('option')
                    nombreCategoria.innerHTML = categoria
                    nombreCategoria.addEventListener('click', () =>{
                        render(productos,nombreCategoria)
                    })
                    select.appendChild(nombreCategoria)
                })
            })
    } catch (error) {
        console.error('Error',error)
    }
}

const render = async(productos, categoria) =>{
    try {
        let contenedor = document.getElementById('listaProductos');
        productos.forEach(producto => {
            if(categoria === 'all' || producto.category === categoria){
                let card = document.createElement('div')
                card.innerHTML = `
                <div class="card">
                <img src="${producto.image}" class="card-img-top" alt="imagen-producto">
                <div class="card-body">
                  <h5 class="card-title">${producto.title}</h5>
                  <p class="card-text">${producto.category}</p>
                  <p class="card-text">${producto.price}</p>
                  <a href="#" class="btn btn-primary">Agregar</a>
                </div>
              </div>
              `
              contenedor.appendChild(card)
            }
        });
        await new Promise(resolve => setInterval(resolve, 1000));
    } catch (error) {
        console.error('Error:',error.message);
    }
}

const main = async()=>{
    let productos = await fetchApi()
    await obtenerCategorias()
    render(productos,'all')
}

main()