<!-- src/components/SortableImageList.vue -->
<template>
  <div class="image-rank-zone">
    <div class="list-name">老婆！！！</div>
    <draggable
      v-model="images"
      :options="{ animation: 200, direction: 'horizontal' }"
      class="image-list"
      group="anime"
    >
      <template #item="{ element }">
        <div class="image-item" :style="{ backgroundImage: `url(${element.src})` }"></div>
      </template>
    </draggable>
    <div class="setting" @click="addImage">
      <span>setting</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      images: [{ src: '/1.jpg' }, { src: '/2.jpg' }]
    }
  },
  methods: {
    addImage() {
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
  display: flex;
  gap: 10px;
  margin-bottom: 50px;
  min-width: 400px;
}

.image-rank-zone .list-name {
  display: inline-block;
  width: 10%;
}

.image-rank-zone .image-list {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  gap: 10px;
}

.image-rank-zone .setting {
  display: inline-block;
  width: 10%;
}

.image-rank-zone .image-item{
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
