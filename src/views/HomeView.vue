<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <ImageRankZone :rankname=name1 />
    <ImageRankZone :rankname=name2 />
    <ImageRankZone :rankname=name1 :color=green />
    <ImageRankZone :rankname=name1 :color=red />
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
  data() {
    return {
      name1: 'red',
      name2: 'blue',
      red: 'red',
      blue:'blue',
      green: 'green'
    }
  }
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
