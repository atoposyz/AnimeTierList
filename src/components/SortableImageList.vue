<!-- src/components/SortableImageList.vue -->
<template>
    <div class="sortable-image-list">
      <draggable
        v-model="images"
        :options="{ animation: 200}"
        class="image-list"
        group="anime"
      >
        <template #item="{ element }">
          <div class="image-item" :style="{ backgroundImage: `url(${element.src})` }"></div>
        </template>
      </draggable>
      <div class="add-image" @click="addImage">
        <span>+</span>
      </div>
    </div>
  </template>
  
  <script>
  import draggable from 'vuedraggable';
  
  export default {
    components: {
      draggable,
    },
    data() {
      return {
        images: [
          { src: '/1.jpg' },
          { src: '/2.jpg' },
        ],
      };
    },
    methods: {
      addImage() {
        const newImageSrc = prompt('请输入新图片的URL:');
        if (newImageSrc) {
          this.images.push({ src: newImageSrc });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .sortable-image-list {
    display: flex;
    gap: 10px;
    min-width: 400px;
  }
  .sortable-image-list .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .sortable-image-list .image-item, .sortable-image-list .add-image {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .add-image {
    border: 2px dashed #ccc;
    cursor: pointer;
    background-color: #f0f0f0;
  }
  .add-image span {
    font-size: 24px;
    color: #ccc;
  }
  </style>
  