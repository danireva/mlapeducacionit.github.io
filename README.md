# PWA o AWP de prueba
https://airhorner.com/

# Documentación del Manifest (manifiesto) - MDN
<https://developer.mozilla.org/es/docs/Web/Manifest>

# Google DEV
<https://web.dev/add-manifest/>
<https://web.dev/learn/pwa/web-app-manifest/>
<https://web.dev/maskable-icon/>
<https://web.dev/pwa-checklist/>

# Generador de archivo Manifiest (manifest.json)
<https://app-manifest.firebaseapp.com/>
<https://manifest-gen.netlify.app/>

# Para hacer un test de nuestra PWA
Tengo acceder a el inspector y entrar en la pestaña Lighthouse. Destildar todo menos (Progresive Web App) y luego correr el test.

# Emulador Android 

<https://www.apkonline.net/>

# Can I Use

<https://caniuse.com/>

# Service Worker
Verifico que el service se encuentre disponible en los navegador que pienso que va a visitar mi sitio.

<https://caniuse.com/?search=service%20worker>

## Service Worker MDN
<https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API>


## Funcionamiento SW

![img-sw](_ref/Service-Worker03.png)

# Motores plantillas

### Handlebars

<https://mustache.github.io/>

<https://handlebarsjs.com/>

### Descargar Handlebars

<https://handlebarsjs.com/installation/#downloading-handlebars>

# Mockapi
Servidor backend de prueba. (Mockear un servidor backend y sus endpoints)

<https://mockapi.io/>

<https://615d8b5212571a00172076ba.mockapi.io/productos>

# Servidor de notificaciones PUSH

## 1) Instalar node (LTS)

<https://nodejs.org/es>

## 2) Instalar globalmente web-push

<https://www.npmjs.com/package/web-push>

```sh
npm i web-push -g
```

## 3) Generar VAPID Keys

```sh
web-push generate-vapid-keys --json
```

```json
{"publicKey":"BK5U7qsEqCrPIXgD2U2PmesdQkpfOycBX8iuDcq3DsLtMXhBALwRfIz0fHyjbtf5rEvsa1S4AFB05Os8GIAa8xs","privateKey":"6ibQZhgndB4OHg823ah9wzX6NRlpbRxk8rEbLTP-eno"}
```



# Configuración de PWA para notificaciones PUSH

1. En el archivo **index.html** agrego lo siguiente

```html
 <section>
        <p>
            <button disabled
                class="js-push-btn mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                Habilitar Notificaciones Push
            </button>
        </p>
        <div class="subscription-details js-subscription-details is-invisible">
            <pre><code class="js-subscription-json"></code></pre>
        </div>

</section>
```

2. Agrego estilos a mi **main.css**

```css
    pre {
        white-space: pre-wrap;
        background-color: #EEEEEE;
        padding: 16px;
    }
    
    pre code {
        word-break: break-word;
    }

    .is-invisible {
    opacity: 0;
    }
```

3. Agregar archivo **push.js**

```js
const applicationServerPublicKey = 'BK5U7qsEqCrPIXgD2U2PmesdQkpfOycBX8iuDcq3DsLtMXhBALwRfIz0fHyjbtf5rEvsa1S4AFB05Os8GIAa8xs'

    let pushButton = null;
    let isSubscribed = false;
    let swRegistration = null;

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        //console.log(outputArray)
        return outputArray;
    }


    function updateBtn() {
        if (isSubscribed) {
            pushButton.textContent = 'DesHabilitar Notificaciones Push';
        } else {
            pushButton.textContent = 'Habilitar Notificaciones Push';
        }

        pushButton.disabled = false;
    }

    function updateSubscriptionOnServer(subscription) {
        // TODO: Send subscription to application server

        const subscriptionJson = document.querySelector('.js-subscription-json');
        const subscriptionDetails =
            document.querySelector('.js-subscription-details');

        if (subscription) {
            subscriptionJson.textContent = JSON.stringify(subscription);
            subscriptionDetails.classList.remove('is-invisible');
        } else {
            subscriptionDetails.classList.add('is-invisible');
        }
    }


    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function (subscription) {
                console.log('User is subscribed:', subscription);

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateBtn();
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                updateBtn();
            });
    }


    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function (error) {
                console.log('Error unsubscribing', error);
            })
            .then(function () {
                updateSubscriptionOnServer(null);

                console.log('User is unsubscribed.');
                isSubscribed = false;

                updateBtn();
            });
    }


    function initialiseUI(reg) {

        swRegistration = reg
        pushButton = document.querySelector('.js-push-btn');

        pushButton.addEventListener('click', function () {
            pushButton.disabled = true;
            if (isSubscribed) {
                unsubscribeUser();
            } else {
                subscribeUser();
            }
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
            .then(function (subscription) {
                isSubscribed = !(subscription === null);

                if (isSubscribed) {
                    console.log('User IS subscribed.');
                } else {
                    console.log('User is NOT subscribed.');
                }

                updateBtn();
            });
    }
```

4. Agrego en el Service Worker la llamada al **initialiseUI(reg)**

```js
initialiseUI(reg)
```

5. Presionar el botón de nuestra aplicación para recibir los datos del Push Service

```json
{"endpoint":"https://fcm.googleapis.com/fcm/send/caWHaotdQBQ:APA91bFa2rLhbv5U7HD0CtOLfx3jDELv2JWItXBB_m-9qv-ovDFCgrMQl87hHQWM7mb29V-4qcURSneZB-q1V2XCk8ZerDhQ9v-6wrQQO0KiwHO6dzNeJEM2UqsfRQCin47re3NW3qVN","expirationTime":null,"keys":{"p256dh":"BJzUScr8iVxTCmWdopp2A9J25DoSQrE5T3nSjpfEzXCKl3Y1jEDYEFTilh_sG1BEGm7lxLD19i6FOrOylrdI2-M","auth":"sk3ZzpMA24AtSbQTjoHRLA"}}
```

6. Es constuir el comando para enviar las notificaciones

```sh
web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/caWHaotdQBQ:APA91bFa2rLhbv5U7HD0CtOLfx3jDELv2JWItXBB_m-9qv-ovDFCgrMQl87hHQWM7mb29V-4qcURSneZB-q1V2XCk8ZerDhQ9v-6wrQQO0KiwHO6dzNeJEM2UqsfRQCin47re3NW3qVN" --key="BJzUScr8iVxTCmWdopp2A9J25DoSQrE5T3nSjpfEzXCKl3Y1jEDYEFTilh_sG1BEGm7lxLD19i6FOrOylrdI2-M" --auth="sk3ZzpMA24AtSbQTjoHRLA" --payload="Hola tarolas desde el web push 1!!!" --ttl=0 --vapid-subject="mailto: mlapeducacionit@gmail.com" --vapid-pubkey="BK5U7qsEqCrPIXgD2U2PmesdQkpfOycBX8iuDcq3DsLtMXhBALwRfIz0fHyjbtf5rEvsa1S4AFB05Os8GIAa8xs" --vapid-pvtkey="6ibQZhgndB4OHg823ah9wzX6NRlpbRxk8rEbLTP-eno"
```






