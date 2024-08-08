<template>
	<div class="home">
		<div class="opt">
			<div class="in-output">
				<button @click="changesave" v-show="!ifimport">{{ savetitle }}</button>
				<button @click="changeimport" v-show="!ifsave">{{ importtitle }}</button>
			</div>
			<div class="save-as" v-show="ifsave">
				<button @click="savejson">json</button>
				<button @click="captureimg">image</button>
			</div>
			<div class="importopt" v-show="ifimport">
				<button>代码</button>
				<button class="file"><input type="file" @change="handleFileUpload" accept=".json" />json</button>
			</div>
			<div class="zhanweifu" v-show="!ifsave & !ifimport">
				<button style="border: 0; background-color: rgba(0, 0, 0, 0)"></button>
			</div>
		</div>

		<SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />

		<div ref="imageRankTable" class="imageranktable">
			<template v-for="rankitem in ranklist" :key="rankitem.name">
				<ImageRankTable :rankname="rankitem.name" :color="rankitem.color" :imgurl="rankitem.urls" />
			</template>
		</div>

		<SortableImageList @opensearchbox="handleopensearchbox" />

		<div ref="combinedContainer" class="combined-container" style="display: none"></div>
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
				{ name: "老婆！！", color: "OrangeRed ", urls: [] },
				{ name: "老婆！", color: "Orange", urls: [] },
				{ name: "老婆？", color: "GoldenRod", urls: [] },
				{ name: "朋友吧", color: "Gold", urls: [] },
				{ name: "一般", color: "Gray", urls: [] },
			],
			ifsearch: false,
			ifsave: false,
			ifimport: false,
			savetitle: '保存',
			importtitle: "导入",
			importjson: [],
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
		changeimport() {
			this.ifimport = !this.ifimport
			if (this.ifimport) {
				this.importtitle = "取消"
			} else {
				this.importtitle = "导入"
			}
		},
		captureimg() {
			const element = this.$refs.imageRankTable;
			html2canvas(element, { useCORS: true }).then(canvas => {
				const link = document.createElement('a');
				link.href = canvas.toDataURL('image/png');
				link.download = 'ImageRankTable.png';
				link.click();
			});
			this.changesave();
		},
		savejson() {
			const element = this.$refs.imageRankTable;
			const rows = element.querySelectorAll(".image-rank-row")
			const data = Array.from(rows).map(item => {
				return {
					rowname: item.querySelector(".label").innerHTML,
					rowurl: Array.from(item.querySelectorAll("img")).map(imgitem => {
						return { src: imgitem.src }
					})
				}
			})
			const json = JSON.stringify(data, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'items.json';
			a.click();
			URL.revokeObjectURL(url);
			this.changesave();
		},
		loadjson() {
			// this.ranklist = []
			for (var i = 0; i < this.importjson.length; i++) {
				this.ranklist[i].name = this.importjson[i].rowname;
				this.ranklist[i].urls = this.importjson[i].rowurl;
			}
			this.changeimport();
		},
		importnew() {

		},
		handleFileUpload(event) {
			const file = event.target.files[0]; // Get the first selected file
			if (file) {
				if (file.type === 'application/json') {
					const reader = new FileReader();

					reader.onload = (e) => {
						try {
							this.importjson = JSON.parse(e.target.result); // Parse JSON data
							this.loadjson();
						} catch (error) {
							console.error('Error parsing JSON:', error);
						}
					};

					reader.onerror = (error) => {
						console.error('Error reading file:', error);
					};

					reader.readAsText(file); // Read file content as text
				} else {
					alert('Please upload a valid JSON file.');
				}
			}
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

button {
	position: relative;
	display: inline-block;
	background: #d0eeff;
	border: 1px solid #99d3f5;
	border-radius: 4px;
	padding: 4px 12px;
	overflow: hidden;
	color: #1e88c7;
	text-decoration: none;
	text-indent: 0;
	line-height: 20px;
}

.file input {
	position: absolute;
	font-size: 100px;
	right: 0;
	top: 0;
	opacity: 0;
}

.file:hover {
	background: #aadffd;
	border-color: #78c3f3;
	color: #004974;
	text-decoration: none;
}
</style>
