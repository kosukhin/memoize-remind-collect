import { createApp } from 'vue'
import {createPinia, Store} from 'pinia'

import '@/assets/main.css'
import App from './App.vue'
import localForage from "localforage";
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {useTasksStore} from "@/stores/tasks";

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

setTimeout(() => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    const swListener = new BroadcastChannel('swListener');
    swListener.onmessage = function(e) {
        if (e.data.type === 'get_tasks') {
            console.log('tasks')
            const {activeTasks} = useTasksStore();
            swListener.postMessage({
                type: 'tasks',
                tasks: JSON.stringify(activeTasks),
            });
        }
    };
})