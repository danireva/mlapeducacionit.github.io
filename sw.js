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
    console.log(e.request.url)
    console.log(e.request.method)
})