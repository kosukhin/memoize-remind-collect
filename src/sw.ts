import { precacheAndRoute } from 'workbox-precaching'
import type {Task} from "@/stores/tasks";
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

    const tasks = JSON.parse(e.data.tasks) as Task[];
    const now = Math.round(Date.now() / 10000) * 10;

    tasks.forEach(task => {
        const freq = task.frequency * 60;

        console.log('task', now, freq);
        if (now % freq === 0) {
            self.registration.showNotification('Time for task', {
                body: task.name,
            })
        }
    })
}

setInterval(() => {
    console.log('from sw')
    swListener.postMessage({type: 'get_tasks'});
}, 10000);
