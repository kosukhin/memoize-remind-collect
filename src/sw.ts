import { precacheAndRoute } from 'workbox-precaching'
declare let self: ServiceWorkerGlobalScope
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
precacheAndRoute(self.__WB_MANIFEST)

const swListener = new BroadcastChannel('swListener');

swListener.onmessage = function(e) {
    if (e.data.type !== 'tasks') {
        return;
    }

    console.log('tasks in sw', e.data.tasks);
}

setInterval(() => {
    console.log('from sw')
    swListener.postMessage({type: 'get_tasks'});
    // if (false) {
    //     self.registration.showNotification('My first spell', {
    //         body: 'push body',
    //     })
    // }
}, 10000)

