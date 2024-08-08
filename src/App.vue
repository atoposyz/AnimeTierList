<template>
  <div class="home">
    <div class="opt">
      <div class="in-output">
        <button @click="changesave">{{ savetitle }}</button>
        <button>导入</button>
      </div>
      <div class="save-as" v-show="ifsave">
        <button>save as json</button>
        <button @click="captureimg">save as image</button>
      </div>
      <div class="zhanweifu" v-show="!ifsave">
        <button style="border: 0; background-color: rgba(0, 0, 0, 0);"></button>
      </div>
    </div>
    <SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />
    <div ref="imageRankTable" class="imageranktable">
      <template v-for="rankitem in ranklist" :key="rankitem.name">
        <ImageRankTable :rankname=rankitem.name :color=rankitem.color />
      </template>
    </div>
    <SortableImageList @opensearchbox="handleopensearchbox" />
    <div ref="combinedContainer" class="combined-container" style="display: none;"></div>
  </div>
  <AppFooter />
</template>

<script>

import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankTable from '@/components/ImageRankTable.vue';
import SearchAnimeBox from '@/components/SearchAnimeBox.vue';
import AppFooter from './components/Footer.vue';
import html2canvas from 'html2canvas';

export default {
  components: {
    ImageRankTable,
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
    captureimg() {
      const element = this.$refs.imageRankTable;
      html2canvas(element, {
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'ImageRankTable.png';
        link.click();
      })
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
  margin-top: 50px;
}

.opt {
  margin-bottom: 20px;
  text-align: right;
  margin-right: 5px;
}

.imageranktable {
  margin-top: 50px;
}
</style>
