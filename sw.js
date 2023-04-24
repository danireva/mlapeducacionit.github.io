// El service worker tiene eventos. Algunos de los eventos más importantes son:
// * Install: Se dispara cuando el SW se descarga por primera vez
// * Activate: Una vez instalado el SW se dispara este evento. Hacer limpiezas de canches antigua de la aplicación. No tener conflictos con versiones antiguas.
// * Fetch: Captura la petición (solicitud, request) y busca en la cache para comprobar si tienen una respuesta ya almacenada. Este es uno de los eventos más utilizados y es responsable de la funcionalidad offline de las AWP.

self.addEventListener('install', e => {
    console.log('sw install')
})

self.addEventListener('activate', e => {
    console.log('sw activates!!!')
})

self.addEventListener('fetch', e => {
    console.log('sw fetchs')

    /* console.log(e) */
    // console.log(e.request)
    /* console.log(e.request.url)
    console.log(e.request.method) */

    let { url, method: metodo } = e.request // destructuring object
    console.log(url, metodo)

    console.warn('Es un css?', url.includes('.css') ? 'Si' : 'No' )

    if(url.includes('main.css')) {
        console.warn('Existe el archivo main.css?')

        //let respuesta = null

        let respuesta = new Response(`
            .w-10 { width: 10%; }
            .w-20 { width: 20%; }
            .w-30 { width: 30%; }
            .w-40 { width: 40%; }
            .w-50 { width: 50%; }
            .w-60 { width: 60%; }
            .w-70 { width: 70%; }
            .w-80 { width: 80%; }
            .w-90 { width: 90%; }
            .w-100 { width: 100%; }
            
            .ml-item {
                margin-left: 20px;
            }
            
            .contenedor {
                align-items: center;
                display: flex;
                justify-content: space-around;
                padding: 20px;
            }
            
            .mdl-layout {
                min-width: 360px;
            }
            /* body {
                background-color: red;
            } */
        `, {headers: { 'content-type' : 'text/css'}})
        e.respondWith(respuesta)
    } else if (url.includes('https://code.getmdl.io/1.3.0/material.light_green-lime.min.css')) {
        console.warn('¿existe el material.light_green-lime.min.css?')
        /* let respuesta = null */
        let respuesta = fetch('https://code.getmdl.io/1.3.0/material.brown-cyan.min.css')
        e.respondWith(respuesta)
    } else if (url.includes('super.jpg')) {
        console.warn('Existe el archivo super.jpg')

        let respuesta = fetch('images/super-rotada.jpg')
        e.respondWith(respuesta)
    } else if (url.includes('index.js')) {
        console.warn('estás pidiendo el código principal del sitio')
        // let respuesta = null
        let respuesta = fetch('https://uncreated-reviews.000webhostapp.com/index.js', {
                            mode: 'no-cors'
                        })
                        .catch(error => console.error('ERROR EN FETCH DE CÓDIGO', error))   
        e.respondWith(respuesta)
    } else {
        let respuesta = fetch(url)
        e.respondWith(respuesta)
    }



})