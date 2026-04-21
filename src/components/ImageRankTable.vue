<!-- src/components/SortableImageList.vue -->
<template>
  <div class="image-rank-row">
    <div class="rank-name" :style="{ 'background-color': store.ranklist[index].color }" contenteditable="true" @input="onNameInput($event)">
      {{ store.ranklist[index].name }}
    </div>
    <ImageListZone class="image-list" :index="index" :key="index" @change-event="emit_change_event"/>
    <div class="settings" @click="opensettingbox(index)">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>
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
    ,
    onNameInput(e) {
      const text = (e.target && e.target.innerText) ? e.target.innerText.trim() : '';
      if (typeof this.index === 'number' && this.store && this.store.ranklist && this.store.ranklist[this.index]) {
        this.store.ranklist[this.index].name = text;
      }
    }
  }
}
</script>

<style scoped>
.image-rank-row {
  min-height: 120px;
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  min-width: 400px;
  background-color: var(--card-bg);    /* 卡片背景 */
  padding: 14px;
  border-radius: calc(var(--radius) - 4px);            /* 圆角 */
  box-shadow: 0 6px 18px rgba(20,30,50,0.06);
}

.image-rank-row:nth-child(even) {
  background-color: rgba(15, 30, 50, 0.02);
}

.rank-name {
  display: flex;
  width: 120px;
  background-color: var(--card-bg);
  justify-content: center;
  align-items: center;
  min-height: 100px;
  border-radius: 10px;
  position: relative; /* 使伪元素绝对定位不影响内容流 */
  transition: box-shadow 0.25s ease, transform 0.18s ease;
}

.rank-name:hover {
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.08);
  transform: translateY(-4px);
}

.rank-name::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px; /* 距离底部一定高度，避免影响垂直居中 */
  height: 6px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  pointer-events: none;
}

.label {
  text-align: center;
  margin: 0 auto;
  font-size: 15px;
  font-weight: 600;
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
  align-items: center;
  cursor: pointer;
  color: var(--muted);
}

.image-rank-row .settings:hover {
  color: var(--primary-600);
  transform: translateY(-2px);
}
</style>
