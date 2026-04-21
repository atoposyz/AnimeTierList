<template>
  <div class="sortable-image-list">
    <ImageListZone ref="imageListZone" class="pool-list" :index="0" @change-event="emit_change_event" />
    <button class="add-image" @click="addImage" aria-label="添加动画">
      <span>+</span>
    </button>
  </div>
</template>

<script>
import ImageListZone from './ImageListZone.vue';

export default {
  components: {
    ImageListZone,
  },
  methods: {
    emit_change_event(data) {
      this.$emit("change-event", data);
    },
    addImage() {
      this.$emit('opensearchbox');
    },
  },
};
</script>

<style scoped>
.sortable-image-list {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 104px;
  gap: 12px;
  min-height: 120px;
}

.pool-list {
  min-width: 0;
}

.add-image {
  width: 104px;
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(35, 111, 134, 0.28);
  border-radius: 10px;
  background: #f2fafb;
  color: #236f86;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}

.add-image span {
  font-size: 34px;
  font-weight: 600;
  line-height: 1;
}

.add-image:hover {
  transform: translateY(-2px);
  background: #e3f4f6;
  box-shadow: 0 12px 24px rgba(35, 111, 134, 0.13);
}

@media (max-width: 680px) {
  .sortable-image-list {
    grid-template-columns: minmax(240px, 1fr) 88px;
    min-width: 350px;
  }

  .add-image {
    width: 88px;
    min-height: 88px;
  }
}
</style>
