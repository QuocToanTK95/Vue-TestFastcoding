import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import i18n from './i18n/';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

const app = createApp(App);

app.use(Toast, {
	shareAppContext: true,
});

app.use(i18n);

library.add(faPenToSquare, faTrash)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');
