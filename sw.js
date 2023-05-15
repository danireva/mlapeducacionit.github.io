// El service worker tiene eventos. Algunos de los eventos más importantes son:
// * Install: Se dispara cuando el SW se descarga por primera vez
// * Activate: Una vez instalado el SW se dispara este evento. Hacer limpiezas de canches antigua de la aplicación. No tener conflictos con versiones antiguas.
// * Fetch: Captura la petición (solicitud, request) y busca en la cache para comprobar si tienen una respuesta ya almacenada. Este es uno de los eventos más utilizados y es responsable de la funcionalidad offline de las AWP.

const CACHE_STATIC_NAME = 'static-v06'
const CACHE_INMUTABLE_NAME = 'inmutable-v06'
const CACHE_DYNAMIC_NAME = 'dynamic-v06'

const CON_CHACHE = true

self.addEventListener('install', e => {
    console.log('sw install')

    // cacheStatics
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then( async cache => {
        console.log(cache)
        // Guardar todos los recursos estáticos (sin número de versión) para que nuestra web app funcione offline
        // --> Estos recursos se llaman recursos de la APP SHELL

        return await cache.addAll([
            './index.html',
            './css/main.css',
            './js/index.js',
            './js/api.js',
            './plantilla-lista.hbs',
            './images/super.jpg'
        ])

    })

    // cacheInmutable
    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then( async cache => {
        console.log(cache)

        // Va guardar los recursos estáticos (con número de versión) para que nuestra web app funcione offline
        // -> Esos recursos se llaman también recursos de la APP SHELL

        return await cache.addAll([
            './js/vendor/handlebars.min-v4.7.7.js',
            'https://code.getmdl.io/1.3.0/material.light_green-lime.min.css',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js'
        ])


    })

    // waitUntil: espera a que todas las operaciones asincronicas culminen (terminen)
    // e.waitUntil(cache) => Es un promesa.
    // Espera recibir una promesa

    // Métodos de las promesas.
    // El método Promise.All() retorna una promesa

    e.waitUntil(Promise.All([cacheStatic, cacheInmutable]))


})

self.addEventListener('activate', e => {
    console.log('sw activates!!!')

    const cachesWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_DYNAMIC_NAME
    ]

    // Borra todos los caches que no esten en la lista actual (versión actual)

    e.waitUntil(
        caches.keys().then(keys => {
            console.log(keys) // Array de espacios de caches
            return Promise.all(
                keys.map( key => {
                    console.log(key)
                    if(!cachesWhiteList.includes(key)) {
                        console.warn(key) // Esto imprime los que no están en la lista blanca
                        return caches.delete(key) // Borrar los que no están en la lista blanca
                    }
                })
            )
        })
    )


})

self.addEventListener('fetch', e => {
    console.log('sw fetchs')

    // console.log(e)

    if(CON_CHACHE) {
        let {url, method} = e.request 

        if( method === 'GET' && !url.includes('mockapi.io') ) {

            const respuesta  = caches.match(e.request).then( res => {
                if (res) {
                    console.log('EXISTE: el recurso en la cache', url)
                    return res
                }
                console.warn('NO EXISTE: el recurso no existe en la cache', url)
    
                return fetch(e.request).then( nuevaRespuesta => {
                    caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                        cache.put(e.request, nuevaRespuesta)
                    })
                    return nuevaRespuesta.clone()
                })
    
            })
    
            e.respondWith(respuesta)

        } else {
            console.warn('BYPASS', method, url)
        }
       
    }

})
