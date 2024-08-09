<!-- src/components/SortableImageList.vue -->
<template>
  <div class="sortable-image-list">
    <ImageListZone ref="imageListZone" :newimage="newimageurl" @change-evnt="emit_change_event"/>
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
      newimageurl: '',
      images: [
        // { src: '/1.jpg' },
        // { src: '/2.jpg' },
      ],
    };
  },
  mounted() {
    this.$bus.on('dataSent', this.handleData);
  },
  beforeUnmount() {
    this.$bus.off('dataSent', this.handleData);
  },
  methods: {
    emit_change_event(data) {
      this.$emit("change-event", data);
    },
    clear() { // 清空一行内容
      this.images = [];
      console.log("clear sort image list.");
    },
    handleData(url) {
      console.log("successfully received!");
      this.images.push({ src: url });
      this.$refs.imageListZone.addurl(url);
      this.emit_change_event("");
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
  border: 2px dashed #ccc;
  cursor: pointer;
  background-color: #f0f0f0;
  margin: auto 10px auto auto;
}

.add-image span {
  font-size: 24px;
  color: #ccc;
}
</style>