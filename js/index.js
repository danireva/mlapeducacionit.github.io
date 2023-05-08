/* --------------------------------------------------- */
/*                 VARIABLE GLOBALES                   */
/* --------------------------------------------------- */

let listaProductos = [/* 
    { id: 1, nombre: 'Carne', cantidad: 2, precio: 12.34 },
    { id: 2, nombre: 'Pan', cantidad: 3, precio: 34.56 },
    { id: 3, nombre: 'Fideos', cantidad: 4, precio: 45.78 },
    { id: 4, nombre: 'Leche', cantidad: 5, precio: 78.23 }, */
]

let crearLista = true
let ul

/* --------------------------------------------------- */
/*                FUNCIONES GLOBALES                   */
/* --------------------------------------------------- */

async function borrarProd(index) {
    console.log('borrarProd', index)

    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    //listaProductos.splice(index, 1)
    await apiProd.del(index)
    renderLista()
}

async function cambiarValor(tipo, id, el) {

    let index = listaProductos.findIndex(prod => prod.id == id)
    let valor = tipo == 'precio' ? Number(el.value) : parseInt(el.value)
    console.log('cambiarValor', tipo, index, valor)

    listaProductos[index][tipo] = valor
    
    let prod = listaProductos[index]

    await apiProd.put(prod, id)
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
        .then(async plantilla => {
            //console.log(plantilla) // el string del contenido del archivo.

            /* ------------------- compilar la plantilla -------------- */
            let template = Handlebars.compile(plantilla)

            /* ------------------------- Obtengo la lista de productos del servidor remoto ------------------- */
            listaProductos = await apiProd.get()
            // console.warn({listaProductos})

            /* -------------------- Ejecuto el template --------------- */
            let html = template({listaProductos}) /* Le paso la data */
            //console.log(html) /* Tengo un string con la plantilla compilada. O sea la plantilla tiene la data */
            
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

    entradaProducto.addEventListener('click', async () => {
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
            await apiProd.post(objProd)
            //listaProductos.push(objProd)
            renderLista()
            input.value = null
        }
    })

    /* Borrado total de productos */

    const btnBorrarProductos = document.getElementById('btn-borrar-productos')
    /* console.log(btnBorrarProductos) */

    btnBorrarProductos.addEventListener('click', () => {
        console.log('btn-borrar-productos')

        /* if ( confirm('¿Desea borrar todos los productos?') ) { // confirm => true o false
            // listaProductos = []
            apiProd.deleteAll(listaProductos)
            renderLista()
        } */

        if (listaProductos.length) {
            let dialog = $('dialog')[0]
            //console.log(dialog)
            dialog.showModal()
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

/* --------------------------------------------------------- */
/* MODAL */
/* --------------------------------------------------------- */

function initDialog() {

    let dialog = $('dialog')[0]
    //console.log(dialog)

        if(!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog)
        }

        //document.querySelector('dialog .aceptar').addEventListener('click', async () => {
        $('dialog .aceptar').click( async () => {

            await apiProd.deleteAll(listaProductos)

            renderLista()
            dialog.close()
        })

        $('dialog .cancelar').click( () => {
            dialog.close()
        })

}



function start() {
    console.log('Arrancando la aplicación')

    registrarServiceWorker()
    configurarListeners()
    initDialog()

    renderLista()
}

// start()
window.onload = start
$(document).ready(start)
