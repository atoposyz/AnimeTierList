<!-- src/components/SortableImageList.vue -->
<template>
  <div class="image-rank-row">
    <div class="rank-name" :style="{ 'background-color': color }" contenteditable="true">
      <span class="label">{{ rankname }}</span>
    </div>
    <ImageListZone class="image-list" :newimages="images" @change-event="emit_change_event"/>
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
  props: ['rankname', 'color', 'imgurl'],
  data() {
    return {
      images: []
    }
  },
  watch: {
    imgurl(newurl) {
      this.images = newurl;
    },
  },
  methods: {
    emit_change_event(data) {
      this.$emit("change-event", data);
    },
    settings() {
      const newImageSrc = prompt('请输入新图片的URL:')
      if (newImageSrc) {
        this.images.push({ src: newImageSrc })
      }
      // 此处信息发生了改变，应该考虑更新 cookie
      this.emit_change_event("");
    }
  }
}
</script>

<style scoped>
.image-rank-row {
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

.image-rank-row .image-list {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  gap: 2px;
}

.image-rank-row .settings {
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center
}
</style>
