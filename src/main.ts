import { createApp } from 'vue'
import {createPinia, Store, storeToRefs} from 'pinia'

import '@/assets/main.css'
import App from './App.vue'
import localForage from "localforage";
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {Task, TaskDates, useTasksStore} from "@/stores/tasks";

const vuetify = createVuetify({
    components,
    directives,
})

localForage.config({
    driver: localForage.INDEXEDDB,
})

const app = createApp(App)

async function indexDbPlugin({ store }: { store: Store }) {
    const stored = await localForage.getItem(store.$id + '-state') as any
    if (stored?.state) {
        store.$patch(JSON.parse(stored.state))
    }
    store.$subscribe(() => {
        localForage
            .setItem(store.$id + '-state', { state: JSON.stringify(store.$state) })
    })
}

const pinia = createPinia()
pinia.use(indexDbPlugin)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')

const showNotification = (message: string) => {
    new Notification('Time for task', {body: message})
}

setTimeout(() => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    const tasksStore = useTasksStore();
    const {activeTasks, taskDates} = storeToRefs(tasksStore);
    taskDates.value = {};

    const createNextDate = (task: Task) => {
        return new Date((new Date()).getTime() + task.frequency * 60000)
    }

    setInterval(() => {
        activeTasks.value.forEach(task => {
            const now = new Date();

            if (!taskDates.value[task.id]) {
                taskDates.value[task.id] = {
                    counter: 1,
                    lastDate: now,
                    nextDate: createNextDate(task)
                };
            }

            const taskDate = taskDates.value[task.id];
            taskDate.counter += 1;

            if (new Date(taskDate.nextDate) < now) {
                taskDate.counter = 0;
                taskDate.lastDate = taskDate.nextDate;
                taskDate.nextDate = createNextDate(task)
                showNotification(task.name);
            }
        })
    }, 10000)
})