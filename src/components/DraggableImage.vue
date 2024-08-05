<!-- src/components/DraggableImage.vue -->
<template>
    <div
      class="draggable-image"
      :style="{ backgroundImage: `url(${imageSrc})` }"
      draggable="true"
      @dragstart="onDragStart"
    ></div>
  </template>
  
  <script>
  export default {
    props: {
      imageSrc: {
        type: String,
        required: true,
      },
    },
    methods: {
      onDragStart(event) {
        event.dataTransfer.setData('imageSrc', this.imageSrc);
      },
    },
  };
  </script>
  
  <style scoped>
  .draggable-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    cursor: move;
  }
  </style>
  