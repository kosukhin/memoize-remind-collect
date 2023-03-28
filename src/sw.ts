import { precacheAndRoute } from 'workbox-precaching'
import type {Task} from "@/stores/tasks";
declare let self: ServiceWorkerGlobalScope
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
precacheAndRoute(self.__WB_MANIFEST)

const swListener = new BroadcastChannel('swListener');

const taskDates: Record<string, {lastDate: Date, nextDate: Date}> = {}

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

    swListener.postMessage({
        type: 'sw_task_dates',
        taskDates,
    });

    tasks.forEach(task => {
        const taskDate = taskDates[task.id];
        const now = new Date();

        if (!taskDate) {
            taskDates[task.id] = {
                lastDate: now,
                nextDate: new Date(now.getTime() + task.frequency * 60000)
            };
        }

        if (taskDates[task.id].lastDate < now) {
            taskDates[task.id].lastDate = taskDates[task.id].nextDate;
            taskDates[task.id].nextDate = new Date(now.getTime() + task.frequency * 60000);
            notify(task);
        }
    })
}

setInterval(() => {
    swListener.postMessage({type: 'get_tasks'});
}, 10000);
