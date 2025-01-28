<template>
    <div>
      <h2>Organiza las palabras para crear oraciones significativas</h2>
      <div class="sentence">
        <span v-for="(word, index) in selectedWords"
            :key="index"
            class="word"
            :class="{
                correct: validationResults[index] === 'correct',
                incorrect: validationResults[index] === 'incorrect',
            }"
            :disabled="validated"
            @click="!validated && removeWord(index)"
        >
          {{ word }}
        </span>
      </div>
      <div v-show="availableWords.length">
        <h3>Palabras disponibles:</h3>
        <div class="available-words">
            <span v-for="(word, index) in availableWords" :key="index" class="word" @click="!validated && selectWord(index)">
            {{ word }}
            </span>
        </div>
      </div>
        <!-- Botón de Validar Resultados -->
        <button @click="validateResults" :disabled="validated || availableWords.length > 0" class="validate-button">
            Validar Resultados
        </button>
    </div>
  </template>
  
  <script>
  import { inject } from 'vue';

  export default {
    setup() {
        const updateParent = inject('errorReported');
        const sendValueToParent = (value) => {
            updateParent(value);
        };
        return { sendValueToParent };
    },
    data() {
      return {
        availableWords: ['Utiliza', 'genial.', 'poner', 'para', 'este', 'una', 'frase', 'espacio'],
        selectedWords: [],
        validated: false,
        correctAnswers: ['Utiliza', 'este', 'espacio', 'para', 'poner', 'una', 'frase', 'genial.'], 
        validationResults: [],       
      };
    },
    methods: {
      selectWord(index) {
        const word = this.availableWords.splice(index, 1)[0];
        this.selectedWords.push(word);
      },
      removeWord(index) {
        const word = this.selectedWords.splice(index, 1)[0];
        this.availableWords.push(word);
      },
      validateResults() {
        this.validated = true;

        this.validationResults = this.selectedWords.map((conn, index) =>
            this.correctAnswers[index] === conn
            ? "correct"
            : "incorrect"
        );
        console.log(this.validationResults)
        const result = this.validationResults.some((conn) => conn == 'incorrect')
        console.log(result)
        if (result) {
            // this.sendValueToParent('error');
        }
      },
    }
  };
  </script>
  
  <style>
  .word {
    display: inline-block;
    margin: 5px;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid #333;
    color: #333;
    border-radius: 2rem;
    cursor: pointer;
  }
  .word.correct {
    border-color: green;
    color: green;
  }
  .word.incorrect {
    border-color: red;
    color: red;
  }
  .sentence {
    margin-bottom: 20px;
    padding: 10px;
    min-height: 50px;
  }
  .available-words {
    padding: 10px;
  }
  .validate-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.validate-button:disabled {
    background-color: gray;
    cursor: not-allowed;
}
  </style>