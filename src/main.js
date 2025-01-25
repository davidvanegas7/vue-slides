import { createApp } from 'vue'
import './style.css'
import HelloWorld from './components/HelloWorld.vue';
import ListValidation from './components/ListValidation.vue';
import App from './App.vue'

const app = createApp(App);

// Registra componentes globalmente
app.component('hello-world', HelloWorld);
app.component('list-validation', ListValidation);

app.mount('#app');