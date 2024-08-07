<template>
  <div class="home">
    <div class="in-output">
      <button @click="changesave">{{ savetitle }}</button>
      <button>导入</button>
    </div>
    <div class="save-as" v-if="ifsave">
      <button>save as json</button>
      <button>save as image</button>
    </div>
    <SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />
    <template v-for="rankitem in ranklist" :key="rankitem.name">
      <ImageRankZone :rankname=rankitem.name :color=rankitem.color />
    </template>
    <SortableImageList @opensearchbox="handleopensearchbox" />
  </div>
  <AppFooter />
</template>

<script>

import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankZone from '@/components/ImageRankTable.vue';
import SearchAnimeBox from '@/components/SearchAnimeBox.vue';
import AppFooter from './components/Footer.vue';

export default {
  components: {
    ImageRankZone,
    SortableImageList,
    SearchAnimeBox,
    AppFooter,
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
      ifsave: false,
      savetitle: '保存',
    }
  },
  methods: {
    handleopensearchbox() {
      this.ifsearch = true
    },
    handleclosesearchbox() {
      this.ifsearch = false
    },
    updatesavetitle() {
      if (this.ifsave) {
        this.savetitle = '取消'
      } else {
        this.savetitle = '保存'
      }
    },
    changesave() {
      this.ifsave = !this.ifsave
      this.updatesavetitle()
    },
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
