import { precacheAndRoute } from 'workbox-precaching'
import type {Task} from "@/stores/tasks";
declare let self: ServiceWorkerGlobalScope
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
precacheAndRoute(self.__WB_MANIFEST)

const swListener = new BroadcastChannel('swListener');

const taskDates: Record<string, Date> = {}

swListener.onmessage = function(e) {
    if (e.data.type !== 'tasks') {
        return;
    }

    const tasks = JSON.parse(e.data.tasks) as Task[];
    const notify = (task: Task) => {
        self.registration.showNotification('Time for task', {
            body: task.name,
        });
    }

    tasks.forEach(task => {
        let lastDate = taskDates[task.id];

        if (!lastDate) {
            lastDate = new Date();
            taskDates[task.id] = lastDate;
        }

        const now = new Date();

        if (lastDate < now) {
            taskDates[task.id] = new Date(
                lastDate.getTime() + task.frequency*60000
            );
            notify(task);
        }
    })
}

setInterval(() => {
    console.log('from sw')
    swListener.postMessage({type: 'get_tasks'});
}, 10000);
