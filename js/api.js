const apiProd = (function() {
    /* ^^^ Esto es una función autoinvocada */


    function getUrl(id) {
        // return 'https://615d8b5212571a00172076ba.mockapi.io/productos/' + (id ? id:'')
        return 'https://615d8b5212571a00172076ba.mockapi.io/productos/' + (id || '')
    }

    /* CRUD: CREATE (POST) - READ (GET) - UPDATE (PUT) - DELETE (DELETE) */

    /* CRUD => READ (GET) */

    async function get() {
       try {
           /* let prods = await axios.get(getUrl())
           console.log(prods.data) */
            let prods = await $.ajax({url: getUrl()})
            // console.log(prods)
            return prods
       } catch (error) {
            console.error('Error get', error)
       }
    }

    /* CRUD => CREATE (POST) */

    async function post(prod) {

        try {
            return await $.ajax({url: getUrl(), method: 'post', data: prod})
        } catch (error) {
            console.error('Error post', error)
            return {}
        }
    }

    /* CRUD => UPDATE (PUT) */

    async function put(prod, id) {
        try {
            return await $.ajax({url: getUrl(id), method: 'put', data: prod})
        } catch (error) {
            console.error('Error put', error)
            return {}
        }
    }

    /* CRUD => DELETE (DELETE) */

    async function del(id) {

        try {
            return await $.ajax({url: getUrl(id), method: 'delete'})
        } catch (error) {
            console.error('Error delete', error)
            return {}
        }
    }

    /* DELETE ALL */

    async function deleteAll(listProd) {


        for (let i = 0; i < listProd.length; i++) {
            
            let id = listProd[i].id

            await del(id)
            
        }

    }




    return {
        get: () => get(),
        post: producto => post(producto),
        put: (producto, id) => put(producto, id),
        del: id => del(id),
        deleteAll: listaProductos => deleteAll(listaProductos)
    }
})()