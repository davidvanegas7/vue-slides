import { createApp } from 'vue'
import './style.css'
import HelloWorld from './components/HelloWorld.vue';
import ListValidation from './components/ListValidation.vue';
import App from './App.vue'
import WordListComponent from './components/WordListComponent.vue';
import InteractiveQuestion from './components/InteractiveQuestion.vue';

const app = createApp(App);

// Registra componentes globalmente
app.component('hello-world', HelloWorld);
app.component('list-validation', ListValidation);
app.component('word-list', WordListComponent);
app.component('interactive-question', InteractiveQuestion);

app.mount('#app');