<!-- src/components/SortableImageList.vue -->
<template>
  <div class="image-rank-zone">
    <div class="rank-name" :style="{ 'background-color': color }" contenteditable="true">
      <span class="label">{{ rankname }}</span>
    </div>
    <ImageListZone class="image-list" />
    <div class="settings" @click="settings">
      <span>settings</span>
    </div>
  </div>
</template>

<script>
import ImageListZone from './ImageListZone.vue';

export default {
  components: {
    ImageListZone,
  },
  props: ['rankname', 'color', 'img'],
  data() {
    return {
      images: [{ src: '/1.jpg' }, { src: '/2.jpg' }]
    }
  },
  methods: {
    settings() {
      const newImageSrc = prompt('请输入新图片的URL:')
      if (newImageSrc) {
        this.images.push({ src: newImageSrc })
      }
    }
  }
}
</script>

<style scoped>
.image-rank-zone {
  min-height: 120px;
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
  min-width: 400px;
}

.rank-name {
  display: flex;
  width: 100px;
  background-color: white;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.label {
  text-align: center;
  margin: 0 auto;
  font-size: 15px;
}

.image-rank-zone .image-list {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  gap: 2px;
}

.image-rank-zone .settings {
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center
}
</style>
