<!-- src/components/SortableImageList.vue -->
<template>
  <div class="sortable-image-list">
    <ImageListZone ref="imageListZone" :index="0" @change-event="emit_change_event"/>
    <div class="add-image" @click="addImage">
      <span>+</span>
    </div>
  </div>
</template>

<script>
import ImageListZone from './ImageListZone.vue';

export default {
  components: {
    ImageListZone,
  },
  data() {
    return {
    };
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
  margin-top: 10px;
  min-height: 120px;
  display: flex;
  gap: 10px;
  min-width: 400px;
}

.add-image {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(16,24,40,0.08);
  cursor: pointer;
  background-color: rgba(15, 30, 50, 0.03);
  margin: auto 10px auto auto;
  border-radius: 10px;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.add-image span {
  font-size: 28px;
  color: var(--muted);
}

.add-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(18, 115, 241, 0.08);
  background: linear-gradient(180deg, rgba(79,156,224,0.12), rgba(79,156,224,0.06));
  color: var(--primary-600);
}
</style>