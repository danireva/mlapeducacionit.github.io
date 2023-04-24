/* --------------------------------------------------- */
/*                 VARIABLE GLOBALES                   */
/* --------------------------------------------------- */

let listaProductos = [
    { id: 1, nombre: 'Carne', cantidad: 2, precio: 12.34 },
    { id: 2, nombre: 'Pan', cantidad: 3, precio: 34.56 },
    { id: 3, nombre: 'Fideos', cantidad: 4, precio: 45.78 },
    { id: 4, nombre: 'Leche', cantidad: 5, precio: 78.23 },
]

let crearLista = true
let ul

/* --------------------------------------------------- */
/*                FUNCIONES GLOBALES                   */
/* --------------------------------------------------- */

function borrarProd(index) {
    console.log('borrarProd', index)

    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    listaProductos.splice(index, 1)
    renderLista()
}


function cambiarCantidad(index, el) {
    //console.log(el)
    //console.dir(el)
    let cantidad = parseInt(el.value)
    console.log('cambiarCantidad', index, cantidad)
    listaProductos[index].cantidad = cantidad
}

function cambiarPrecio(index, el) {
    //console.log(el)
    //console.dir(el)
    let precio = Number(el.value)
    console.log('cambiarPrecio', index, precio)
    listaProductos[index].precio = precio
}

function renderLista() {
    console.log('Render lista')

    /* ----------- petición plantilla con fetch ------------ */

    let data = fetch('plantilla-lista.hbs')

    data
        .then(respuesta => {
            console.log(respuesta)
            return respuesta.text()
        })
        .then(plantilla => {
            console.log(plantilla) // el string del contenido del archivo.

            /* ------------------- compilar la plantilla -------------- */
            let template = Handlebars.compile(plantilla)

            /* -------------------- Ejecuto el template --------------- */
            let html = template({listaProductos}) /* Le paso la data */
            console.log(html) /* Tengo un string con la plantilla compilada. O sea la plantilla tiene la data */
            
            document.getElementById('lista').innerHTML = html

            /* Me refrescaba la librería material lite */
            let ul = document.querySelector('#contenedor-lista')
            componentHandler.upgradeElements(ul)
        })
        .catch( (error) => {
            console.error('Error', error)
        }) 
}

/* ------------------------------------------------------- */
/* Listeners                                               */
/* ------------------------------------------------------- */

function configurarListeners() {
    /* Ingreso del producto nuevo */
    const entradaProducto = document.getElementById("btn-entrada-producto")
    // console.log(entradaProducto)

    entradaProducto.addEventListener('click', () => {
        console.log('btn-entrada-producto')

        let input = document.getElementById('ingreso-producto')
        // console.dir(input)
        let producto = input.value /* value => lo que escribió el usuario */

        if ( producto ) {
            const objProd = { 
                nombre: producto, 
                cantidad: 1, 
                precio: 0
            }
            listaProductos.push(objProd)
            renderLista()
            input.value = null
        }
    })

    /* Borrado total de productos */

    const btnBorrarProductos = document.getElementById('btn-borrar-productos')
    /* console.log(btnBorrarProductos) */

    btnBorrarProductos.addEventListener('click', () => {
        console.log('btn-borrar-productos')

        if ( confirm('¿Desea borrar todos los productos?') ) { // confirm => true o false
            listaProductos = []
            renderLista()
        }

    })

}

/* --------------------------------------------------------- */
/* Registro Service Worker                                   */
/* --------------------------------------------------------- */

function registrarServiceWorker() {
    if ( 'serviceWorker' in navigator ) { // si no está el sw me daría false
        this.navigator.serviceWorker.register('sw.js') /* /sw.js */
            .then( reg => {
                console.log('El service worker se registró correctamente', reg)
            })
            .catch( err => {
                console.error('Error al registrar el service worker', err)
            })
    } else {
        console.error('serviceWorker no está disponible en el navegador')
    }
}

/*  ---------------------------------------------------------- */
/*  DEMO FUNCIONAMIENTO HBS                                    */
/*  ---------------------------------------------------------- */

function handlebarsTestFetch() {
    console.warn('Holaaaaa handlebars')
    fetch('plantilla-prueba.hbs')    
        .then(respuesta => {
            console.log(respuesta)
            if(!respuesta.ok) throw respuesta
            return respuesta.text()
        })
        .then(plantilla => {
            console.log(plantilla) // <p>{{firstname}} {{lastname}}</p>

            // compilamos el template
            let template = Handlebars.compile(plantilla)
            console.log(template) // acá tengo una referencia de una función

            // ejecuto (invoco la función) el template y le paso la data dentro obj
            let html = template({
                firstname: "Alejandro",
                lastname: "Di Stefano"
            })

            console.log(html)

            const lista = document.querySelector('#lista')

            console.log(lista)
            lista.innerHTML = html

        })
        .catch(error => console.error(error))

}

function start() {
    console.log('Arrancando la aplicación')

    registrarServiceWorker()
    configurarListeners()

    // handlebarsTestFetch()

    renderLista()
}


start()
