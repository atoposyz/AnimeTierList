<template>
  <div class="home">
    <SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />
    <template v-for="rankitem in ranklist" :key="rankitem.name">
      <ImageRankZone :rankname=rankitem.name :color=rankitem.color />
    </template>
    <SortableImageList @opensearchbox="handleopensearchbox" />
  </div>
</template>

<script>

import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankZone from '@/components/ImageRankZone.vue';
import SearchAnimeBox from '@/components/SearchAnimeBox.vue';

export default {
  components: {
    ImageRankZone,
    SortableImageList,
    SearchAnimeBox,
  },
  data() {
    return {
      ranklist: [
        { name: "老婆！！", color: "OrangeRed " },
        { name: "老婆！", color: "Orange" },
        { name: "老婆？", color: "GoldenRod" },
        { name: "朋友吧", color: "Gold" },
        { name: "一般", color: "Gray" },],
      ifsearch: false,
    }
  },
  methods: {
    handleopensearchbox() {
      this.ifsearch = true
    },
    handleclosesearchbox() {
      this.ifsearch = false
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
