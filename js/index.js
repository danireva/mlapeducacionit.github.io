/* --------------------------------------------------- */
/*                 VARIABLE GLOBALES                   */
/* --------------------------------------------------- */

let listaProductos = leerListaProductos()

/* --------------------------------------------------- */
/*                 LOCAL STORAGE CACHE                 */ 
/* --------------------------------------------------- */
function guardarListaProductos(lista) {
    let prods = JSON.stringify(lista)
    localStorage.setItem('lista', prods)
}

function leerListaProductos() {
    let lista = []
    let prods = localStorage.getItem('lista') // string

    if(prods) {
        try {
            lista = JSON.parse(prods) // paso de string a un obj de js
            console.log('try', lista)
        } catch (error) {
            console.log('catch', lista)
            lista = []
            guardarListaProductos(lista)
        }
    }
    return lista
}



/* --------------------------------------------------- */
/*                FUNCIONES GLOBALES                   */
/* --------------------------------------------------- */

async function borrarProd(index) {
    console.log('borrarProd', index)

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
    // console.log('Render lista')

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

            // Guardamos la lista de productos actual en el localstorage ( persisto en navegador )
            guardarListaProductos(listaProductos)

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


                // Habilitar el funcionamiento de las notificaciones
                // https://developer.mozilla.org/en-US/docs/Web/API/Notification

                Notification.requestPermission( res => {
                    console.warn(res)
                    if ( res === 'granted' ) {
                        navigator.serviceWorker.ready.then( res => {
                            console.warn(reg)
                        })
                    }
                })

            })
            .catch( err => {
                console.error('Error al registrar el service worker', err)
            })
    } else {
        console.error('serviceWorker no está disponible en el navegador')
    }
}

/* --------------------------------------------------------- */
/* MODAL                                                     */
/* --------------------------------------------------------- */

function initDialog() {

    let dialog = $('dialog')[0]
    //console.log(dialog)

        if(!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog)
        }

        //document.querySelector('dialog .aceptar').addEventListener('click', async () => {
        $('dialog .aceptar').click( async () => {

            await apiProd.deleteAll(listProd)

            renderLista()
            dialog.close()
        })

        $('dialog .cancelar').click( () => {
            dialog.close()
        })

}

/* --------------------------------------------------------- */
/* TEST CACHE                                                */
/* --------------------------------------------------------- */

function testCache() {
    console.log('Empezando con caches')

    if(window.caches) {
        console.log('El Broser soporta Caches')

        /* Creao espacios de caches (OPEN) */
        caches.open('prueba-1')
        /* caches.open('prueba-2') */
        caches.open('prueba-3')
        caches.open('prueba-4')
        caches.open('prueba-5')

        /* Comprobamos si un espacio de cache existe (HAS) | Devuelve una promesa */

        console.log(caches.has('prueba-2'))

        caches.has('prueba-2').then(respuesta => console.log('prueba-2: ', respuesta))  /* FALSE | me devuelve un boolean: true | false */
        caches.has('prueba-3').then(console.log) /* TRUE */
        // caches.has('prueba-3').then(alert) /* TRUE */


        /* Borrar un espacio de chache (DELETE) */
        caches.delete('prueba-1')

        /* Listo todos los espacios de caches (KEYS) */

        caches.keys().then(console.log).catch(console.log)

        /* ----------------------------------------------------- */
        /* Abro un espacio de cache y trabajo con él             */
        /* ----------------------------------------------------- */

        caches.open('cache-v1.1').then ( cache => {
            console.log(cache) // Cache
            console.log(caches) // CacheStorage

            /* Agrego un recurso al cache (ADD) */

            // cache.add('./index.html')

            /* Agrego varios recursos al cache (addAll) */
            /* Al método addAll() le tengo que pasar un [] */

            cache.addAll([
                './index.html',
                './css/main.css',
                './images/super.jpg'
            ]).then( () => {
                console.log('Recursos agregados')


                /* Borro un recuro de la cache (DELETE) */

                // cache.delete('./css/main.css').then(console.log)

                cache.match('./css/main.css').then( respuesta => {
                    if ( respuesta ) {
                        console.log('Recurso encontrado')
                    } else {
                        console.error('Recuro inexistente')
                    }
                })

                /* Creo o modifico el contenido de un recurso (PUT) */
                
                cache.put('./index.html', new Response('Hola mundo!'))

                /* Listaar todos los recursos que contiene este cache */

                // cache.keys().then(recursos => console.log('Recursos de cache', recursos))

                cache.keys().then(recursos => {
                    recursos.forEach( recurso => {
                        console.log(recurso.url)
                    })
                })

                caches.keys().then( nombres => {
                    console.log('Nombres de caches: ', nombres)
                })

            })

        })



    }

}

function start() {
    // console.log('Arrancando la aplicación')

    registrarServiceWorker()
    configurarListeners()
    initDialog()

    //testCache()

    renderLista()
}

// start()
// window.onload = start
$(document).ready(start)
