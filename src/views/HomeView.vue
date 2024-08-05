<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    <ImageRankZone />
    
    <SortableImageList />
  </div>
</template>

<script>

import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankZone from '@/components/ImageRankZone.vue';

export default {
  components: {
    ImageRankZone,
    SortableImageList,
  },
};
</script>

<style scoped>
.home {
  display: block;
  gap: 20px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
}
</style>
