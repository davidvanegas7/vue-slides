<template>
    <div class="interactive-content noselect">
      <h2>Tus contenidos gustan, pero enganchan mucho más si son <span :class="{
                correct: validationResult === 'correct',
                incorrect: validationResult === 'incorrect',
            }">{{ selectedOption || '______' }}</span></h2>
      
      <div class="options">
        <button 
          v-for="option in options" 
          :key="option" 
          :class="{
             correct: validationResult === 'correct' && selectedOption === option,
             incorrect: validationResult === 'incorrect' && selectedOption === option,
          }"
          @click="!validated && selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
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
        options: ['Animación', 'Creatividad', 'Concepto', 'Contenido', 'Aspecto'],
        selectedOption: null,
        validated: false,
        correctAnswer: 'Creatividad',
        validationResult: null,
      };
    },
    methods: {
      selectOption(option) {
        this.selectedOption = option;
        this.validated = true;

        this.validationResult = this.selectedOption == this.correctAnswer ? "correct" : "incorrect"
        if (this.validationResult) {
            // this.sendValueToParent('error');
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .interactive-content {
    text-align: center;
    padding: 20px;
  }
  
  .options {
    margin: 20px 0;
  }
  
  button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #333;
    background: #fff;
    color: #333;
    border-radius: 5px;
  }
  
  button.selected {
    background-color: #4CAF50;
    color: white;
  }
  
  .correct {
    text-decoration: underline green;
    color: green;
  }
  .incorrect {
    text-decoration: underline red;
    color: red;
  }
  .noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
  </style>