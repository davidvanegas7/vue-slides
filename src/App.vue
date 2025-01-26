<template>
  <div class="screen">
    <span
      v-for="(slide, index) in slides"
      :key="index"
      ref="slides"
      v-show="currentSlide === index"
    >
      <component
        :ref="'slide-' + index"
        :is="{ template: `${slide}` }"
      />
    </span>
    <div class="buttons">
      <button @click="prevSlide" :disabled="currentSlide === 0">Anterior</button>
      <button @click="nextSlide" :disabled="currentSlide === slides.length - 1">Siguiente</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import ListValidation from './components/ListValidation.vue';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { provide, getCurrentInstance } from 'vue';

export default {
  data() {
    return {
      slides: [],
      currentSlide: 0,
      reviewSlides: [], // Lista de diapositivas para repasar
    };
  },
  computed: {
    isLastSlide() {
      return this.currentSlide === this.slides.length - 1;
    },
  },
  async created() {
    const response = await fetch('/src/slides.html?v=' + Date.now());
    const html = await response.text();

    this.slides = html.split('<hr />').map(slide => slide.trim());
  },
  methods: {
    prevSlide() {
      if (this.currentSlide > 0) this.currentSlide--;
    },
    nextSlide() {
      console.log("nextSlide", this.reviewSlides)
      if (this.currentSlide < this.slides.length - 1) this.currentSlide++;
      this.checkReforceSlides()
    },
    checkReforceSlides() {
      if (this.isLastSlide && this.reviewSlides.length > 0) {
        this.slides.push(...this.reviewSlides);
        this.reviewSlides = []; // Limpia la lista de repaso
      }
    },
    markForReview(slideIndex) {
      const slideToReview = this.slides[slideIndex];
      if (!this.reviewSlides.includes(slideToReview)) {
        this.reviewSlides.push(slideToReview);
        console.log(this.reviewSlides)
      }
    },
  },
  setup() {
    const instance = getCurrentInstance();

    provide("errorReported", (value) => {
      instance.proxy.markForReview(instance.proxy.currentSlide);
    });
  },
};
</script>
<style>
.screen {
  height: 35rem;
  width: 50rem;
  border: 1px solid blue;
  border-radius: 8px;
  position: relative;
}
.slide {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table tr {
  border-bottom: 1px solid #ccc;
}

table tr td {
  padding: 10px;
}
</style>