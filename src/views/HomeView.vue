<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <DraggableImage imageSrc="/1.jpg" />
    <DraggableImage imageSrc="/2.jpg" />
    <DropZone />
  </div>
</template>

<script>
import DraggableImage from '@/components/DraggableImage.vue';
import DropZone from '@/components/DropZone.vue';

export default {
  components: {
    DraggableImage,
    DropZone,
  },
};
</script>

<style scoped>
.home {
  display: flex;
  gap: 20px;
}
</style>
