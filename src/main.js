import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { initFacebookSdk, jwtInterceptor, errorInterceptor } from './helpers/auth';
import { router } from './router'
import App from './App.vue'
import './index.css'


import { fakeBackend } from './helpers/auth';
fakeBackend();

// enable interceptors for http requests
jwtInterceptor();
errorInterceptor();

// wait for facebook sdk to start app
initFacebookSdk().then(startApp);


function startApp() {
    createApp(App)
        .use(router)
        .use(createPinia())
        .mount('#app');
}
