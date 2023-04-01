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
        self.registration.showNotification('Выполни задачу', {
            body: task.name,
        });
    }

    swListener.postMessage({
        type: 'sw_task_dates',
        taskDates,
    });

    const createNextDate = (task: Task) => {
        return new Date((new Date()).getTime() + task.frequency * 60000)
    }

    tasks.forEach(task => {
        const now = new Date();

        if (!taskDates[task.id]) {
            taskDates[task.id] = {
                lastDate: now,
                nextDate: createNextDate(task)
            };
        }

        const taskDate = taskDates[task.id];

        if (taskDate.nextDate < now) {
            taskDate.lastDate = taskDate.nextDate;
            taskDate.nextDate = createNextDate(task)
            notify(task);
        }

        console.log('v2', taskDate);
    })
}

setInterval(() => {
    swListener.postMessage({type: 'get_tasks'});
}, 10000);
