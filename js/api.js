const apiProd = (function() {
    /* ^^^ Esto es una función autoinvocada */


    function getUrl() {
        return 'https://615d8b5212571a00172076ba.mockapi.io/productos'
    }

    return {
        getUrl: () => getUrl()
    }
})()