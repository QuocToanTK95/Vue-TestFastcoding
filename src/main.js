import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import i18n from './i18n/';

const app = createApp(App);

app.use(Toast, {
	shareAppContext: true,
});

app.use(i18n);

app.mount('#app');
