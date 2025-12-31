<template>
	<div class="home" @mouseup="change_event_handler">
		<div class="opt">
			<div class="in-output">
				<button @click="writer" v-show="!ifimport && !ifsave">{{ writertitle }}</button>
				<button @click="clearcontent" v-show="!ifimport && !ifsave">{{ cleartitle }}</button>
				<button @click="changesave" v-show="!ifimport">{{ savetitle }}</button>
				<button @click="changeimport" v-show="!ifsave">{{ importtitle }}</button>
			</div>
			<div class="save-as" v-show="ifsave">
				<button @click="save_data_into_cookie">{{ cache_title }}</button>
				<button @click="savejson">json</button>
				<button @click="captureimg">image</button>
				<button @click="openCodeShare">代码</button>
			</div>
			<div class="importopt" v-show="ifimport">
				<button @click="openCodeImport">代码</button>
				<button class="file"><input type="file" @change="handleFileUpload" accept=".json" />json</button>
			</div>
			<div class="zhanweifu" v-show="!ifsave & !ifimport">
				<button style="border: 0; padding: 0; background-color: rgba(0, 0, 0, 0)"></button>
			</div>
		</div>

		<!-- 代码分享模态框 -->
		<div class="code-share-modal" v-show="ifcodeshare">
			<div class="modal-content">
				<div class="modal-header">
					<h2>分享代码</h2>
					<button class="close-btn" @click="closeCodeShare">✕</button>
				</div>
				<div class="modal-body">
					<p class="modal-hint">复制下面的代码分享给朋友，他们粘贴到"代码导入"就能恢复你的数据</p>
					<textarea class="share-code-textarea" readonly :value="shareCode"></textarea>
					<button class="copy-btn" @click="copyShareCode">复制代码</button>
				</div>
			</div>
		</div>

		<!-- 代码导入弹窗 -->
		<div class="code-import-modal" v-show="ifcodeimport">
			<div class="modal-content-import">
				<div class="modal-header">
					<h3>导入代码</h3>
					<button class="close-btn" @click="closeCodeImport">✕</button>
				</div>
				<div class="modal-body-import">
					<p>粘贴别人分享的代码：</p>
					<textarea v-model="importCodeInput" class="import-code-textarea" placeholder="粘贴分享代码"></textarea>
					<button class="import-btn" @click="decodeCodeToData">导入数据</button>
				</div>
			</div>
		</div>

		<RowSettingBox v-if="ifsetting" :index="this.settingindex" @closesettingbox="handleclosesettingbox" @reopensetting="handlereopensetting" />
		<SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />

		<div ref="imageRankTable" class="imageranktable">
			<div class="tabletitle center">
				年度动画分组
			</div>
			<div class="writer" v-show="iwriter">
				<span>填表人：</span>
				<input type="text" placeholder="写上你的名字" size="10rem" oninput="this.style.width = (this.value.length>18?this.value.length:10) + 'rem';">
			</div>
			<template v-for="rankitem in store.ranklist" :key="rankitem.index">
				<ImageRankTable :index="rankitem.index" v-if="rankitem.index > 0"
					@opensettingbox="handleopensettingbox" />
			</template>
		</div>

		<div>
			<SortableImageList ref="sortableImageList" @opensearchbox="handleopensearchbox" />
		</div>
		<div ref="combinedContainer" class="combined-container" style="display: none"></div>
	</div>
	<AppFooter />
</template>

<script>
import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankTable from '@/components/ImageRankTable.vue';
import RowSettingBox from './components/RowSettingBox.vue';
import SearchAnimeBox from '@/components/SearchAnimeBox.vue';
import AppFooter from './components/Footer.vue';
import Cookies from 'js-cookie';
import { store } from '@/utils/store.js'
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

export default {
	components: {
		ImageRankTable,
		SortableImageList,
		SearchAnimeBox,
		AppFooter,
		RowSettingBox,
	},
	data() {
		return {
			store,
			iwriter: false,
			ifsetting: false,
			ifsearch: false,
			ifsave: false,
			ifimport: false,
			ifcodeshare: false,
			ifcodeimport: false,
			writertitle: "填表人OFF",
			savetitle: '保存',
			cache_title: '网页缓存',
			importtitle: "导入",
			cleartitle: '清空',
			settingindex: 1,
			shareCode: '',
			importCodeInput: '',
		}
	},
	mounted() {
		// this.empty_ranklist = JSON.parse(JSON.stringify(this.ranklist)); // 记录初始值
		this.load_data_from_cookie();                                    // 初始化时：试图从 cookie 加载上次的历史信息
	},
	beforeUnmount() {
	},
	methods: {
		change_event_handler() {

		},
		handlereopensetting(index) {
			// reopen settings for given index
			this.settingindex = index;
			this.ifsetting = true;
		},
		add_new_image_into_sorted(new_anime_image_url) {
			this.sortable_images_urls.push({
				src: new_anime_image_url
			});
		},
		clear_ranklist() { // 清空整个 ranklist
			store.ClearRankList();
		},
		set_cookie(name, value) {
			Cookies.set(name, value, { expires: 30 }); // 30 天后过期
		},
		get_cookie(name) {
			return Cookies.get(name); // 获取指定名称的 cookie
		},
		handleopensettingbox(index) {
			this.settingindex = index;
			console.log("receive trying opensettingbox No." + this.settingindex);
			this.ifsetting = true;
		},
		handleclosesettingbox() {
			this.ifsetting = false;
		},
		handleopensearchbox() {
			this.ifsearch = true;
		},
		handleclosesearchbox() {
			this.ifsearch = false;
		},
		writer() {
			this.iwriter = !this.iwriter;
			if(this.iwriter) {
				this.writertitle = "填表人ON";
			} else {
				this.writertitle = "填表人OFF";
			}
		},
		clearcontent() {
			store.ClearRankList();
		},
		changesave() {
			this.ifsave = !this.ifsave;
			if (this.ifsave) {
				this.savetitle = '取消';
			} else {
				this.savetitle = '保存';
			}
		},
		changeimport() {
			this.ifimport = !this.ifimport;
			if (this.ifimport) {
				this.importtitle = "取消";
			} else {
				this.importtitle = "导入";
			}
		},
		save_data_into_cookie(flag = true) {
			this.set_cookie("rank", JSON.stringify(store.ranklist, null, 2));
			this.set_cookie("sortable", JSON.stringify(store.sortablelist, null, 2));
			console.log("saving data into cookie.");
			if (flag) {
				alert("已保存！");
			}
		},
		load_main_data_from_cookie() {
			const json_string = this.get_cookie("rank");
			if (json_string == null || json_string == "") {  // 当前没有可用 json
				this.save_data_into_cookie(false);           // 存一个进去
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadjson(json_object);
			console.log("load main data from cookie.");
		},
		load_sort_data_from_cookie() {
			const json_string = this.get_cookie("sortable");
			if (json_string == null || json_string == "") {  // 当前没有可用 json
				this.save_data_into_cookie(false);           // 存一个进去
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadsortjson(json_object);
			console.log("load sort data from cookie.");
		},
		load_data_from_cookie() {
			this.load_main_data_from_cookie();
			this.load_sort_data_from_cookie();
		},
		captureimg() {
			const element = this.$refs.imageRankTable;
			// 克隆整个元素，保留原始网页不受影响
			var settingsDivs = element.querySelectorAll('div.settings'); // 查找所有 class 为 settings 的 div
			settingsDivs.forEach(div => div.style.display = "none"); // 删除每一个找到的 div
			// settingsDivs = element.querySelectorAll("image-rank-row");
			// settingsDivs.forEach(div => div.style.boxShadow = "");
			// settingsDivs = element.querySelectorAll("rank-name");
			// settingsDivs.forEach(div => div.style.boxShadow = "");
			html2canvas(element, { useCORS: true }).then(canvas => {
				const link = document.createElement('a');
				link.href = canvas.toDataURL('image/png');
				link.download = 'ImageRankTable.png';
				link.click();
			});
			settingsDivs = element.querySelectorAll('div.settings');
			settingsDivs.forEach(div => div.style.display = "flex");
			// settingsDivs = element.querySelectorAll("image-rank-row");
			// settingsDivs.forEach(div => div.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)");
			// settingsDivs = element.querySelectorAll("rank-name");
			// settingsDivs.forEach(div => div.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)");
			this.changesave();
		},
		savejson() {
			const json = store.DumpJson();
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
			store.LoadRankList(json_object);
		},
		
		loadsortjson(json_object) {
			store.LoadSortableList(json_object);
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
							this.loadjson(json_file.rank); // Parse JSON data
							this.loadsortjson(json_file.sortable);
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
		// 编码数据为分享代码
		encodeDataToCode() {
			try {
				const data = {
					rank: store.ranklist,
					sortable: store.sortablelist,
				};
				const jsonStr = JSON.stringify(data);
				// 使用 Base64 编码
				const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
				this.shareCode = encoded;
				this.ifcodeshare = true;
			} catch (error) {
				console.error('编码失败:', error);
				alert('编码失败，请重试');
			}
		},
		// 从分享代码导入数据
		decodeCodeToData() {
			try {
				if (!this.importCodeInput.trim()) {
					alert('请粘贴有效的代码');
					return;
				}
				const decoded = decodeURIComponent(escape(atob(this.importCodeInput.trim())));
				const data = JSON.parse(decoded);
				this.loadjson(data.rank);
				this.loadsortjson(data.sortable);
				alert('导入成功！');
				this.importCodeInput = '';
				this.ifcodeimport = false;
				this.changeimport();
			} catch (error) {
				console.error('解码失败:', error);
				alert('代码无效或已损坏，请检查后重试');
			}
		},
		// 复制分享代码到剪贴板
		copyShareCode() {
			this.ifcodeshare = false;
			navigator.clipboard.writeText(this.shareCode).then(() => {
				alert('代码已复制到剪贴板！');
			}).catch(err => {
				console.error('复制失败:', err);
				alert('复制失败，请手动复制');
			});
		},
		// 打开分享代码界面
		openCodeShare() {
			this.encodeDataToCode();
		},
		// 打开导入代码界面
		openCodeImport() {
			this.importCodeInput = '';
			this.ifcodeimport = true;
		},
		// 关闭导入代码界面
		closeCodeImport() {
			this.ifcodeimport = false;
			this.importCodeInput = '';
		},
		// 关闭分享代码界面
		closeCodeShare() {
			this.ifcodeshare = false;
			this.shareCode = '';
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
	margin-top: 40px;
	padding: 28px;
	background-color: var(--card-bg);
	border-radius: var(--radius);
	box-shadow: 0 8px 30px rgba(15, 30, 50, 0.08);
	border: 1px solid rgba(16,24,40,0.04);
}

.opt {
	margin-bottom: 18px;
	text-align: right;
	margin-right: 5px;
}

.writer{
	margin-right: 5px;
	margin-bottom: 15px;
	margin-left: auto;
	display: flex;
	justify-content: flex-end;
	font-size: 15px;
	color: var(--muted);
}

.writer input {
	width: auto;
	min-width: 5px;
	border: none;
	background: transparent;
	padding: 6px 8px;
	outline: none;
	font-size: 15px;
}

.imageranktable {
	margin-top: 30px;
	padding: 8px 0;
}

.tabletitle {
	font-size: 28px;
	font-weight: 600;
	margin-bottom: 12px;
	color: var(--primary-600);
}
.tablefooter{
	font-size: 12px;
	color: var(--muted);
}
.center {
	display: flex;
	justify-content: center;
}

button {
	position: relative;
	display: inline-block;
	background: linear-gradient(180deg, var(--primary) 0%, var(--primary-600) 100%);
	border: none;
	color: white;
	border-radius: 8px;
	padding: 8px 14px;
	overflow: hidden;
	text-decoration: none;
	line-height: 20px;
	font-size: 14px;
	cursor: pointer;
	box-shadow: 0 6px 18px rgba(47, 128, 237, 0.12);
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

button:hover {
	transform: translateY(-3px);
	box-shadow: 0 10px 24px rgba(47, 128, 237, 0.16);
}

.file input {
	position: absolute;
	font-size: 100px;
	right: 0;
	top: 0;
	opacity: 0;
}


/* 代码分享模态框样式 */
.code-share-modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	background: white;
	border-radius: 12px;
	padding: 24px;
	max-width: 500px;
	width: 90%;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.modal-header h2 {
	font-size: 20px;
	margin: 0;
	color: var(--primary-600);
}

.close-btn {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: var(--muted);
	padding: 0;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	transition: background 0.2s ease;
}

.close-btn:hover {
	background: rgba(0, 0, 0, 0.05);
	transform: none;
	box-shadow: none;
}

.modal-body {
	text-align: center;
}

.modal-hint {
	font-size: 14px;
	color: var(--muted);
	margin-bottom: 12px;
}

.share-code-textarea {
	width: 100%;
	height: 120px;
	padding: 12px;
	border: 1px solid rgba(16, 24, 40, 0.1);
	border-radius: 8px;
	font-family: monospace;
	font-size: 12px;
	resize: none;
	margin-bottom: 12px;
}

.copy-btn {
	width: 100%;
	padding: 10px;
	background: var(--primary);
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.copy-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(79, 156, 224, 0.2);
}

/* 代码导入模态框样式 */
.code-import-modal {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 998;
}

.modal-content-import {
	background: white;
	border-radius: 12px;
	padding: 24px;
	max-width: 500px;
	width: 90%;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-body-import {
	text-align: left;
}

.modal-body-import p {
	margin-bottom: 12px;
	font-size: 14px;
	color: var(--muted);
}

.import-code-textarea {
	width: 100%;
	height: 120px;
	padding: 12px;
	border: 1px solid rgba(16, 24, 40, 0.1);
	border-radius: 8px;
	font-family: monospace;
	font-size: 12px;
	resize: none;
	margin-bottom: 12px;
}

.import-btn {
	width: 100%;
	padding: 10px;
	background: var(--primary);
	color: white;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 14px;
	transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.import-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(79, 156, 224, 0.2);
}
</style>
