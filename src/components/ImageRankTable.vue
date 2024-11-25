<!-- src/components/SortableImageList.vue -->
<template>
  <div class="image-rank-row">
    <div class="rank-name" :style="{ 'background-color': store.ranklist[index].color }" contenteditable="true">
      <span class="label">{{ store.ranklist[index].name }}</span>
    </div>
    <ImageListZone class="image-list" :index="index" :key="index" @change-event="emit_change_event"/>
    <div class="settings" @click="opensettingbox(index)">
      <span>settings</span>
    </div>
  </div>
</template>

<script>
import ImageListZone from './ImageListZone.vue';
import { store } from '@/utils/store.js'

export default {
  components: {
    ImageListZone,
  },
  props: ['index'],
  data() {
    return {
      store,
    }
  },
  methods: {
    emit_change_event(data) {
      this.$emit("change-event", data);
    },
    opensettingbox(index) {
      console.log("try to opensettingbox No." + index);
      this.$emit("opensettingbox", index);
    //   const newImageSrc = prompt('请输入新图片的URL:')
    //   if (newImageSrc) {
    //     this.images.push({ src: newImageSrc })
    //   }
    //   // 此处信息发生了改变，应该考虑更新 cookie
    //   this.emit_change_event("");
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

  background-color: #f9fafb;    /* 轻柔背景色 */
  padding: 12px;
  border-radius: 8px;            /* 圆角 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.image-rank-row:nth-child(even) {
  background-color: #eef1f5;
}

.rank-name {
  display: flex;
  width: 100px;
  background-color: white;
  justify-content: center;
  align-items: center;
  min-height: 100px;

  border-radius: 12px;                 /* 圆角，避免尖角 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 柔和阴影 */
  transition: box-shadow 0.3s ease, transform 0.2s ease; /* 动态效果 */
}

.rank-name:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 悬浮时阴影增强 */
  transform: translateY(-3px);                /* 轻微上移效果 */
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
