import { createApp } from 'vue'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import PrimeVue from 'primevue/config';
import VueNumberInput from '@chenfengyuan/vue-number-input';

const app = createApp(App);
app.component('VueDatePicker', VueDatePicker);
app.component(VueNumberInput.name, VueNumberInput);
app.mount('#app');
app.use(PrimeVue);
