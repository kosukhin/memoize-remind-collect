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
