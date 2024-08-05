<!-- src/components/DropZone.vue -->
<template>
    <div
      class="drop-zone"
      @dragover.prevent
      @drop="onDrop"
    >
      <div v-if="droppedImage" class="dropped-image" :style="{ backgroundImage: `url(${droppedImage})` }"></div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        droppedImage: null,
      };
    },
    methods: {
      onDrop(event) {
        const imageSrc = event.dataTransfer.getData('imageSrc');
        this.droppedImage = imageSrc;
      },
    },
  };
  </script>
  
  <style scoped>
  .drop-zone {
    width: 200px;
    height: 200px;
    border: 2px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dropped-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
  }
  </style>
  