<template>
  <div class="connection-container" ref="container">
    <div class="list-container">
      <!-- Lista 1 -->
      <ul class="list list-1">
        <li
          v-for="(item, index) in list1"
          :key="'list1-' + index"
          :ref="'list1-' + index"
          class="list-item"
          :class="{ active: activeElement === `list1-${index}` }"
          @mousedown="startConnection(index, 'list1')"
          @mouseup="clearActiveElement"
        >
          {{ item }}
        </li>
      </ul>

      <!-- SVG para dibujar las conexiones -->
      <svg class="connection-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Definición de Marcador para Puntas de Flecha -->
        <defs>
          <marker
            v-for="(line, index) in connections"
            :key="'arrowhead-' + index"
            :id="'arrowhead-' + index"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" :fill="line.color" />
          </marker>
        </defs>
        <!-- Conexiones Finales -->
        <line
          v-for="(line, index) in connections"
          :key="'line-' + index"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :stroke="line.color"
          stroke-width="4"
          :marker-end="'url(#arrowhead-' + index + ')'"
        />
        <!-- Línea Temporal -->
        <line
          v-if="tempConnection"
          :x1="tempConnection.x1"
          :y1="tempConnection.y1"
          :x2="tempConnection.x2"
          :y2="tempConnection.y2"
          stroke="gray"
          stroke-dasharray="5,5"
          stroke-width="2"
          marker-end="url(#temp-arrowhead)"
        />
        <!-- Marcador para la línea temporal -->
        <defs>
          <marker
            id="temp-arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="gray" />
          </marker>
        </defs>
      </svg>

      <!-- Lista 2 -->
      <ul class="list list-2">
        <li
          v-for="(item, index) in list2"
          :key="'list2-' + index"
          :ref="'list2-' + index"
          class="list-item"
          :class="{ active: activeElement === `list2-${index}` }"
          @mouseup="endConnection(index, 'list2')"
          @mousedown="clearActiveElement"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list1: ["Elemento A", "Elemento B", "Elemento C"],
      list2: ["Opción 1", "Opción 2", "Opción 3"],
      connections: [], // Conexiones finales
      tempConnection: null, // Conexión temporal mientras se dibuja
      activeElement: null, // Elemento activo para sombrear
    };
  },
  methods: {
    startConnection(index, list) {
      // Establecer el elemento activo
      this.activeElement = `${list}-${index}`;

      // Verificar si el elemento de la lista 1 ya tiene una conexión
      if (list === "list1") {
        const existingConnectionIndex = this.connections.findIndex(
          (conn) => conn.from.index === index
        );

        // Si ya tiene una conexión, eliminarla
        if (existingConnectionIndex !== -1) {
          this.connections.splice(existingConnectionIndex, 1);
        }
      }

      const element = this.$refs[`${list}-${index}`][0];
      const rect = element.getBoundingClientRect();
      const containerRect = this.$refs.container.getBoundingClientRect();
      const xOffset = list === "list1" ? rect.width * 0.9 : rect.width * 0.1; // Ajuste del punto
      this.tempConnection = {
        x1: rect.left + xOffset - containerRect.left,
        y1: rect.top + rect.height / 2 - containerRect.top,
        x2: rect.left + xOffset - containerRect.left,
        y2: rect.top + rect.height / 2 - containerRect.top,
        from: { index, list },
      };
    },
    endConnection(index, list) {
      if (!this.tempConnection) return;

      const element = this.$refs[`${list}-${index}`][0];
      const rect = element.getBoundingClientRect();
      const containerRect = this.$refs.container.getBoundingClientRect();
      const xOffset = list === "list2" ? rect.width * 0.1 : rect.width * 0.9; // Ajuste del punto
      this.tempConnection.x2 = rect.left + xOffset - containerRect.left;
      this.tempConnection.y2 = rect.top + rect.height / 2 - containerRect.top;

      // Generar un color aleatorio para la conexión
      const color = this.getRandomColor();
      this.tempConnection.color = color;

      this.tempConnection.to = { index, list };
      this.connections.push({ ...this.tempConnection });
      this.tempConnection = null;

      // Limpiar elemento activo
      this.activeElement = null;
    },
    clearActiveElement() {
      this.activeElement = null;
    },
    updateTempConnection(event) {
      if (this.tempConnection) {
        const containerRect = this.$refs.container.getBoundingClientRect();
        this.tempConnection.x2 = event.clientX - containerRect.left;
        this.tempConnection.y2 = event.clientY - containerRect.top;
      }
    },
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
  mounted() {
    window.addEventListener("mousemove", this.updateTempConnection);
  },
  beforeDestroy() {
    window.removeEventListener("mousemove", this.updateTempConnection);
  },
};
</script>

<style>
.connection-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 100%;
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 20rem;
}
.list-2 {
  position: absolute;
  right: 0;
}
.list-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}
.list-item.active {
  background-color: #f0f8ff; /* Sombreado para el elemento activo */
  border-color: #007acc;
}
.connection-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
