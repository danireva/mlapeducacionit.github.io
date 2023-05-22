const applicationServerPublicKey = 'BOtgEWpiFRTDGRiIFOsmdV2FE5bcxoobxTRji_254Wi-iGYnKxeDXs_Vylm45woIf3gBW0E32-EevHAQhhi5JC4'

/* 
1. Generamos las VAPID KEYS: claves públia y privada para enviar notificaciones push (Las genera el web push)
web-push generate-vapid-keys --json
{"publicKey":"BOtgEWpiFRTDGRiIFOsmdV2FE5bcxoobxTRji_254Wi-iGYnKxeDXs_Vylm45woIf3gBW0E32-EevHAQhhi5JC4","privateKey":"oIuDdJ6LXc_lCJ68aSiyjIkxLWTg-1DmGZT0ATKrK60"}
*/

/* 
2. Objeto de suscripción que genera nuestro front end, utilizando la clave pública provista por el web push
{"endpoint":"https://fcm.googleapis.com/fcm/send/fhnQErZ0kGs:APA91bEtYMSJz_IihO43SZQoADEEHD65eQkU-XSRzN1AYqmzDSuMyDQPgD1pHlkKVafe8SXW6q3wE1PFpra6EytY5RCmePUrbnFVNmyJFIqt_JUhFwkcmu22eT4NV35z3vCEFwfjWeCW","expirationTime":null,"keys":{"p256dh":"BPs326VyxMVRB9XotCtnm3SdUo8_klwl02njgpHX07QPXE3fKvRRoF7khcPkxxO4cCpKPVt5EbK1vFpjpmzjSec","auth":"ujnAPrNMBWs4fDHTRx8BzA"}}
*/

/* 
3. Comando de parte del server push para enviar una notificación al usuario suscipto, utiliza la información de suscripción enviada por el front end y las claves públicas y privadas generas por el web push

DESDE web-push (app)
web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/cWc9Q3bgSg4:APA91bEHkPCzt1bv3N2YLiS2SsNSKSmZM4LSxFDuFGcj5vmw41ASjHDx1Q1g5gkkkehx49NiIjMXQJ8ZZXnpVxMh6A71jJ-kCtpSrGml8eeHORbvpaCDYOG3RifIIRUf0V1c57kZHwAe" --key="BNx-eO2KN5gKfW34fNAG6KRoLXu56BDbS5pdNLvEZP9qIWannXCOwX4O81_-6m3ohafGZVakfL3IpA8bB0gAQ7E" --auth="e7L9-wQTdCdCLcgqdgr8QQ" --payload="Hola tarolas desde el web push 2!!!" --ttl=0 --vapid-subject="mailto: mlapeducacionit@gmail.com" --vapid-pubkey="BDEcCgdsTm9zzel8VNM33LVGGvOFg7vrg9aiJzy4mlXZPqK7_i2bDVasvuFDge7APfvhX1ykDqrxuJ1b_Y1YnhU" --vapid-pvtkey="Ee24LvLR_IgqbLHk75BOkhAJIVnL8eQ2ZgsFXhZ_K2Q"

DESDE web-push (node.js)
node src/cli send-notification --endpoint="https://fcm.googleapis.com/fcm/send/fhnQErZ0kGs:APA91bEtYMSJz_IihO43SZQoADEEHD65eQkU-XSRzN1AYqmzDSuMyDQPgD1pHlkKVafe8SXW6q3wE1PFpra6EytY5RCmePUrbnFVNmyJFIqt_JUhFwkcmu22eT4NV35z3vCEFwfjWeCW" --key="BPs326VyxMVRB9XotCtnm3SdUo8_klwl02njgpHX07QPXE3fKvRRoF7khcPkxxO4cCpKPVt5EbK1vFpjpmzjSec" --auth="ujnAPrNMBWs4fDHTRx8BzA" --payload="Hola tarolas desde el web push 2!!!" --ttl=0 --vapid-subject="mailto: mlapeducacionit@gmail.com" --vapid-pubkey="BOtgEWpiFRTDGRiIFOsmdV2FE5bcxoobxTRji_254Wi-iGYnKxeDXs_Vylm45woIf3gBW0E32-EevHAQhhi5JC4" --vapid-pvtkey="oIuDdJ6LXc_lCJ68aSiyjIkxLWTg-1DmGZT0ATKrK60"

*/

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