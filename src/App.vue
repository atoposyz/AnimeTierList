<template>
	<div class="home" @mouseup="change_event_handler">
		<div class="opt">
			<div class="in-output">
				<button @click="changesave" v-show="!ifimport">{{ savetitle }}</button>
				<button @click="changeimport" v-show="!ifsave">{{ importtitle }}</button>
			</div>
			<div class="save-as" v-show="ifsave">
				<button @click="save_data_into_cookie">{{ cache_title }}</button>
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

		<div ref="imageRankTable" id="imageRankTable" class="imageranktable">
			<template v-for="rankitem in ranklist" :key="rankitem.name">
				<ImageRankTable :rankname="rankitem.name" :color="rankitem.color" :imgurl="rankitem.urls"/>
			</template>
		</div>

		<div>
			<SortableImageList ref="sortableImageList" id="sortableImageList" @opensearchbox="handleopensearchbox"/>
		</div>
		

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
import Cookies from 'js-cookie'

export default {
	components: {
		ImageRankTable,
		SortableImageList,
		SearchAnimeBox,
		AppFooter,
	},
	data() {
		return {
			empty_ranklist: [],
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
			cache_title: '网页缓存',
			importtitle: "导入",
			importjson: [],
		}
	},
	mounted() {
		this.empty_ranklist = JSON.parse(JSON.stringify(this.ranklist)); // 记录初始值
		this.load_data_from_cookie();                                    // 初始化时：试图从 cookie 加载上次的历史信息
	},
	methods: {
		change_event_handler() {
			
		},
		clear_ranklist() { // 清空整个 ranklist
			this.ranklist = JSON.parse(JSON.stringify(this.empty_ranklist));
		},
		set_cookie(name, value) {
			Cookies.set(name, value, { expires: 30 }); // 30 天后过期
		},
		get_cookie(name) {
			return Cookies.get(name); // 获取指定名称的 cookie
		},
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
		save_data_into_cookie(flag=true) {
			this.set_cookie("save", this.get_json_presentation());
			this.set_cookie("sort", this.get_sortable_data());
			console.log("saving data into cookie."); // 初始化时可能会遇到很多次更新，不过应该不影响功能
			if(flag) {
				alert("已保存！");
			}
		},
		load_main_data() {
			const json_string = this.get_cookie("save");
			if(json_string == null || json_string == "") {  // 当前没有可用 json
				this.save_data_into_cookie(false);               // 存一个进去
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadjson(json_object);
			console.log("load main data from cookie.");
		},
		load_sort_data() {
			const json_string = this.get_cookie("sort");
			if(json_string == null || json_string == "") {  // 当前没有可用 json
				this.save_data_into_cookie(false);               // 存一个进去
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadsortjson(json_object);
			console.log("load sort data from cookie.");
		},
		load_data_from_cookie() {
			this.load_main_data();
			this.load_sort_data();
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
		get_json_presentation() {
			const element = document.getElementById("imageRankTable");
			const rows = element.querySelectorAll(".image-rank-row")
			const data = Array.from(rows).map(item => {
				return {
					rowname: item.querySelector(".label").innerHTML,
					rowurl: Array.from(item.querySelectorAll("img")).map(imgitem => {
						return { src: imgitem.src };
					})
				}
			})
			const json = JSON.stringify(data, null, 2); // this is a string
			return json;
		},
		get_sortable_data() { // 获得排序缓冲区的数据
			const element = document.getElementById("sortableImageList");
			const items = element.querySelectorAll(".image-item");
			const data = Array.from(items).map(imgitem => {
				const content = imgitem.innerHTML;
				const regex = /src\s*=\s*(\'|\")[^\s]*(\'|\")/ig;
				const match = regex.exec(content)[0];
				const regex2 = /(\'|\")[^\s]*(\'|\")/ig
				const match2 = regex2.exec(match)[0];
				const real_src = match2.substring(1, match2.length - 1);
				return {src: real_src};
			});
			const json = JSON.stringify(data, null, 2); // this is a string
			return json;
		},
		savejson() {
			const json = JSON.stringify({
				save: JSON.parse(this.get_json_presentation()),
				sort: JSON.parse(this.get_sortable_data())
			}, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'items.json';
			a.click();
			URL.revokeObjectURL(url);
			this.changesave();
		},
		loadjson(json_object) {
			this.importjson = json_object; 
			for (var i = 0; i < json_object.length; i++) {
				this.ranklist[i].name = json_object[i].rowname;
				this.ranklist[i].urls = json_object[i].rowurl;
			}
		},
		loadsortjson(json_object) {
			const element = this.$refs.sortableImageList;
			element.images = [];
			for(var i = 0; i < json_object.length; i += 1) {
				const url = json_object[i].src;
				element.handleData(url);
			}
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
							const json_file = JSON.parse(e.target.result);
							this.loadjson(json_file.save); // Parse JSON data
							this.loadsortjson(json_file.sort);
							this.changeimport();
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
