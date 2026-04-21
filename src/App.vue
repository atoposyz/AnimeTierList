<template>
	<div class="app-root">
		<header class="site-header">
			<div class="container header-inner">
				<div>
					<p class="eyebrow">Anime Tier List</p>
					<h1>年度动画分级表</h1>
					<p class="subtitle">搜索番剧海报，拖拽到不同等级里，整理属于你的年度动画榜单。</p>
				</div>
				<div class="header-stats">
					<span>{{ rankedCount }} 已分级</span>
					<span>{{ waitingCount }} 待排序</span>
				</div>
			</div>
		</header>

		<main class="home" @mouseup="change_event_handler">
			<section class="toolbar" aria-label="工具栏">
				<div class="toolbar-copy">
					<strong>编辑面板</strong>
					<span>支持拖拽排序、导入导出、生成分享码与截图。</span>
				</div>

				<div class="opt">
					<div class="action-group" v-show="!ifimport && !ifsave">
						<button class="btn btn-soft" @click="writer">{{ writertitle }}</button>
						<button class="btn btn-danger-soft" @click="clearcontent">{{ cleartitle }}</button>
					</div>
					<div class="action-group">
						<button class="btn" @click="changesave" v-show="!ifimport">{{ savetitle }}</button>
						<button class="btn btn-secondary" @click="changeimport" v-show="!ifsave">{{ importtitle }}</button>
					</div>
					<div class="action-group expanded" v-show="ifsave">
						<button class="btn btn-soft" @click="save_data_into_cookie">{{ cache_title }}</button>
						<button class="btn btn-soft" @click="savejson">导出 JSON</button>
						<button class="btn btn-soft" @click="captureimg">导出图片</button>
						<button class="btn btn-soft" @click="openCodeShare">分享码</button>
					</div>
					<div class="action-group expanded" v-show="ifimport">
						<button class="btn btn-soft" @click="openCodeImport">导入分享码</button>
						<button class="btn btn-soft file">
							<input type="file" @change="handleFileUpload" accept=".json" />
							导入 JSON
						</button>
					</div>
				</div>
			</section>

			<div class="code-share-modal" v-show="ifcodeshare">
				<div class="modal-content">
					<div class="modal-header">
						<h2>分享当前榜单</h2>
						<button class="close-btn" @click="closeCodeShare" aria-label="关闭">×</button>
					</div>
					<div class="modal-body">
						<p class="modal-hint">复制下面的分享码发给朋友，对方在“导入分享码”中粘贴即可恢复榜单。</p>
						<textarea class="share-code-textarea" readonly :value="shareCode"></textarea>
						<button class="btn modal-action" @click="copyShareCode">复制分享码</button>
					</div>
				</div>
			</div>

			<div class="code-import-modal" v-show="ifcodeimport">
				<div class="modal-content">
					<div class="modal-header">
						<h2>导入分享码</h2>
						<button class="close-btn" @click="closeCodeImport" aria-label="关闭">×</button>
					</div>
					<div class="modal-body">
						<p class="modal-hint">粘贴别人分享的代码，导入后会替换当前榜单数据。</p>
						<textarea v-model="importCodeInput" class="import-code-textarea" placeholder="在这里粘贴分享码"></textarea>
						<button class="btn modal-action" @click="decodeCodeToData">导入数据</button>
					</div>
				</div>
			</div>

			<RowSettingBox v-if="ifsetting" :index="this.settingindex" @closesettingbox="handleclosesettingbox" @reopensetting="handlereopensetting" />
			<SearchAnimeBox v-if="ifsearch" @closesearchbox="handleclosesearchbox" />

			<div ref="imageRankTable" class="imageranktable">
				<div class="table-heading">
					<div>
						<p class="section-label">Tier Board</p>
						<h2>动画分组</h2>
					</div>
					<div class="writer" v-show="iwriter">
						<span>填表人</span>
						<input type="text" placeholder="写上你的名字" size="10rem" oninput="this.style.width = (this.value.length>18?this.value.length:10) + 'rem';">
					</div>
				</div>
				<template v-for="rankitem in store.ranklist" :key="rankitem.index">
					<ImageRankTable :index="rankitem.index" v-if="rankitem.index > 0"
						@opensettingbox="handleopensettingbox" />
				</template>
			</div>

			<section class="pool-panel">
				<div class="pool-heading">
					<div>
						<p class="section-label">Waiting Pool</p>
						<h2>待排序动画</h2>
					</div>
					<span>点击加号添加番剧，拖到上方分级行中。</span>
				</div>
				<SortableImageList ref="sortableImageList" @opensearchbox="handleopensearchbox" />
			</section>

			<div ref="combinedContainer" class="combined-container" style="display: none"></div>
		</main>
		<AppFooter />
	</div>
</template>

<script>
import SortableImageList from '@/components/SortableImageList.vue';
import ImageRankTable from '@/components/ImageRankTable.vue';
import RowSettingBox from './components/RowSettingBox.vue';
import SearchAnimeBox from '@/components/SearchAnimeBox.vue';
import AppFooter from './components/Footer.vue';
import Cookies from 'js-cookie';
import { store } from '@/utils/store.js'
import { toPng } from 'html-to-image';
import LZString from "lz-string";

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
			writertitle: "显示填表人",
			savetitle: '保存 / 导出',
			cache_title: '保存到本地',
			importtitle: "导入",
			cleartitle: '清空分级',
			settingindex: 1,
			shareCode: '',
			importCodeInput: '',
		}
	},
	computed: {
		waitingCount() {
			return this.store.ranklist[0]?.urls?.length || 0;
		},
		rankedCount() {
			return this.store.ranklist.slice(1).reduce((sum, item) => sum + (item.urls?.length || 0), 0);
		},
	},
	mounted() {
		this.load_data_from_cookie();
	},
	methods: {
		change_event_handler() {},
		handlereopensetting(index) {
			this.settingindex = index;
			this.ifsetting = true;
		},
		add_new_image_into_sorted(new_anime_image_url) {
			this.sortable_images_urls.push({
				src: new_anime_image_url
			});
		},
		clear_ranklist() {
			store.ClearRankList();
		},
		set_cookie(name, value) {
			Cookies.set(name, value, { expires: 30 });
		},
		get_cookie(name) {
			return Cookies.get(name);
		},
		handleopensettingbox(index) {
			this.settingindex = index;
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
			this.writertitle = this.iwriter ? "隐藏填表人" : "显示填表人";
		},
		clearcontent() {
			store.ClearRankList();
		},
		changesave() {
			this.ifsave = !this.ifsave;
			this.savetitle = this.ifsave ? '收起保存' : '保存 / 导出';
		},
		changeimport() {
			this.ifimport = !this.ifimport;
			this.importtitle = this.ifimport ? "收起导入" : "导入";
		},
		save_data_into_cookie(flag = true) {
			this.set_local("rank", JSON.stringify(store.ranklist));
			this.set_local("sortable", JSON.stringify(store.sortablelist));
			this.load_data_from_cookie();

			if (flag) {
				alert("已保存到本地！");
			}
		},

		set_local(key, value) {
			try {
				localStorage.setItem(key, value);
			} catch (e) {
				console.error('localStorage 写入失败:', e);
				alert('本地存储失败，可能是空间不足或浏览器限制。');
			}
		},

		get_local(key) {
			try {
				return localStorage.getItem(key);
			} catch (e) {
				console.error('localStorage 读取失败:', e);
				return null;
			}
		},

		load_main_data_from_cookie() {
			const json_string = this.get_local("rank");
			if (json_string == null || json_string == "") {
				this.save_data_into_cookie(false);
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadjson(json_object);
		},
		load_sort_data_from_cookie() {
			const json_string = this.get_local("sortable");
			if (json_string == null || json_string == "") {
				this.save_data_into_cookie(false);
				return;
			}
			const json_object = JSON.parse(json_string);
			this.loadsortjson(json_object);
		},
		load_data_from_cookie() {
			this.load_main_data_from_cookie();
			this.load_sort_data_from_cookie();
		},
		clear_local_cache() {
			localStorage.removeItem("rank");
			localStorage.removeItem("sortable");
			alert("本地缓存已清空。");
		},
		async captureimg() {
			const element = this.$refs.imageRankTable;
			if (!element) return;

			if (document.fonts && document.fonts.ready) {
				await document.fonts.ready;
			}

			const clone = element.cloneNode(true);
			const container = document.createElement('div');
			Object.assign(container.style, {
				position: 'fixed',
				top: '-10000px',
				left: '-10000px',
				width: element.offsetWidth + 'px',
				height: element.offsetHeight + 'px',
				zIndex: '-1',
				background: '#ffffff',
			});
			container.appendChild(clone);
			document.body.appendChild(container);

			try {
				clone.querySelectorAll('div.settings').forEach(div => div.style.display = 'none');
				clone.querySelectorAll('.writer input').forEach(input => {
					input.setAttribute('value', input.value);
				});

				const images = clone.querySelectorAll('img');
				const tasks = Array.from(images).map(async (img) => {
					const src = img.src;
					if (!src || src.startsWith('data:')) return;

					try {
						img.removeAttribute('srcset');
						img.setAttribute('loading', 'eager');

						const response = await fetch(src + (src.includes('?') ? '&' : '?') + 't=' + Date.now(), {
							cache: 'no-cache',
							mode: 'cors'
						});

						const blob = await response.blob();

						const base64Url = await new Promise((resolve, reject) => {
							const reader = new FileReader();
							reader.onloadend = () => resolve(reader.result);
							reader.onerror = reject;
							reader.readAsDataURL(blob);
						});

						img.src = base64Url;
					} catch (err) {
						console.warn('图片转为 Base64 失败，将尝试使用原链接:', src, err);
					}
				});

				await Promise.all(tasks);

				const dataUrl = await toPng(clone, {
					backgroundColor: '#ffffff',
					pixelRatio: window.devicePixelRatio,
					skipAutoScale: true,
					cacheBust: true,
				});

				const link = document.createElement('a');
				link.href = dataUrl;
				link.download = `年度动画分级_${Date.now()}.png`;
				link.click();
			} catch (e) {
				console.error('导出图片失败:', e);
				alert('导出失败：请检查网络，或确认图片服务允许跨域访问。');
			} finally {
				document.body.removeChild(container);
				this.changesave();
			}
		},

		savejson() {
			const json = store.DumpJson();
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'anime-tier-list.json';
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
		importnew() {},
		handleFileUpload(event) {
			const file = event.target.files[0];
			if (file) {
				if (file.type === 'application/json') {
					const reader = new FileReader();

					reader.onload = (e) => {
						try {
							const json_file = JSON.parse(e.target.result);
							this.loadjson(json_file.rank);
							this.loadsortjson(json_file.sortable);
							this.changeimport();
						} catch (error) {
							console.error('Error parsing JSON:', error);
							alert('JSON 解析失败，请检查文件内容。');
						}
					};

					reader.onerror = (error) => {
						console.error('Error reading file:', error);
					};

					reader.readAsText(file);
				} else {
					alert('请上传有效的 JSON 文件。');
				}
			}
		},
		encodeDataToCode() {
			try {
				const data = {
					rank: store.ranklist,
					sortable: store.sortablelist,
				};
				const jsonStr = JSON.stringify(data);
				const code = LZString.compressToEncodedURIComponent(jsonStr);

				this.shareCode = code;
				this.ifcodeshare = true;
			} catch (error) {
				console.error("编码失败:", error);
				alert("编码失败，请重试。");
			}
		},

		decodeCodeToData() {
			try {
				const input = this.importCodeInput.trim();
				if (!input) {
					alert("请粘贴有效的分享码。");
					return;
				}

				const jsonStr = LZString.decompressFromEncodedURIComponent(input);
				if (!jsonStr) throw new Error("decompress failed");

				const data = JSON.parse(jsonStr);
				this.loadjson(data.rank);
				this.loadsortjson(data.sortable);

				alert("导入成功！");
				this.importCodeInput = "";
				this.ifcodeimport = false;
				this.changeimport();
			} catch (error) {
				console.error("解码失败:", error);
				alert("分享码无效或已损坏，请检查后重试。");
			}
		},
		copyShareCode() {
			this.ifcodeshare = false;
			navigator.clipboard.writeText(this.shareCode).then(() => {
				alert('分享码已复制到剪贴板！');
			}).catch(err => {
				console.error('复制失败:', err);
				alert('复制失败，请手动复制。');
			});
		},
		openCodeShare() {
			this.encodeDataToCode();
		},
		openCodeImport() {
			this.importCodeInput = '';
			this.ifcodeimport = true;
		},
		closeCodeImport() {
			this.ifcodeimport = false;
			this.importCodeInput = '';
		},
		closeCodeShare() {
			this.ifcodeshare = false;
			this.shareCode = '';
		},
	}
};
</script>

<style scoped>
.app-root {
	min-height: 100vh;
	padding-bottom: 32px;
	background:
		radial-gradient(circle at top left, rgba(255, 139, 97, 0.18), transparent 32rem),
		linear-gradient(135deg, #f7f9fc 0%, #eef4f8 45%, #fbfbf7 100%);
}

.site-header {
	padding: 38px 0 18px;
}

.header-inner {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 24px;
}

.eyebrow,
.section-label {
	margin: 0 0 6px;
	color: #2b7286;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0;
	text-transform: uppercase;
}

.site-header h1 {
	margin: 0;
	color: #1f2937;
	font-size: clamp(32px, 6vw, 58px);
	font-weight: 800;
	line-height: 1.04;
}

.subtitle {
	max-width: 560px;
	margin: 12px 0 0;
	color: #5c6674;
	font-size: 16px;
}

.header-stats {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	justify-content: flex-end;
}

.header-stats span {
	display: inline-flex;
	align-items: center;
	min-height: 34px;
	padding: 0 12px;
	border: 1px solid rgba(31, 41, 55, 0.08);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.72);
	color: #3f4b5a;
	font-size: 13px;
	font-weight: 700;
	backdrop-filter: blur(10px);
}

.home {
	max-width: 1120px;
	margin: 0 auto;
	padding: 22px;
	background: rgba(255, 255, 255, 0.78);
	border: 1px solid rgba(31, 41, 55, 0.08);
	border-radius: 18px;
	box-shadow: 0 24px 70px rgba(31, 41, 55, 0.12);
	backdrop-filter: blur(16px);
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18px;
	margin-bottom: 20px;
	padding: 14px;
	border: 1px solid rgba(31, 41, 55, 0.08);
	border-radius: 12px;
	background: #ffffff;
}

.toolbar-copy {
	display: grid;
	gap: 2px;
	color: #667085;
	font-size: 13px;
}

.toolbar-copy strong {
	color: #1f2937;
	font-size: 16px;
	font-weight: 800;
}

.opt,
.action-group {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
	flex-wrap: wrap;
}

.expanded {
	flex-basis: 100%;
}

.btn {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 38px;
	border: 1px solid transparent;
	border-radius: 8px;
	padding: 0 14px;
	background: #236f86;
	color: white;
	font-size: 14px;
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	box-shadow: 0 8px 18px rgba(35, 111, 134, 0.18);
	transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}

.btn:hover {
	transform: translateY(-2px);
	background: #19596d;
	box-shadow: 0 12px 24px rgba(35, 111, 134, 0.22);
}

.btn-soft {
	border-color: rgba(35, 111, 134, 0.16);
	background: #eef7f8;
	color: #19596d;
	box-shadow: none;
}

.btn-soft:hover {
	background: #dff0f2;
	box-shadow: none;
}

.btn-secondary {
	background: #46556a;
	box-shadow: 0 8px 18px rgba(70, 85, 106, 0.18);
}

.btn-secondary:hover {
	background: #334155;
}

.btn-danger-soft {
	border-color: rgba(194, 65, 12, 0.18);
	background: #fff3ed;
	color: #9a3412;
	box-shadow: none;
}

.btn-danger-soft:hover {
	background: #ffe8dc;
	box-shadow: none;
}

.file {
	overflow: hidden;
}

.file input {
	position: absolute;
	inset: 0;
	font-size: 100px;
	opacity: 0;
	cursor: pointer;
}

.imageranktable,
.pool-panel {
	background: #ffffff;
	border: 1px solid rgba(31, 41, 55, 0.08);
	border-radius: 14px;
	padding: 16px;
}

.table-heading,
.pool-heading {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 14px;
}

.table-heading h2,
.pool-heading h2 {
	margin: 0;
	color: #1f2937;
	font-size: 24px;
	font-weight: 800;
}

.pool-panel {
	margin-top: 18px;
}

.pool-heading span {
	color: #667085;
	font-size: 13px;
}

.writer {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
	color: #667085;
	font-size: 14px;
}

.writer input {
	min-width: 9rem;
	border: 1px solid rgba(31, 41, 55, 0.12);
	background: #f8fafc;
	padding: 8px 10px;
	border-radius: 8px;
	outline: none;
	font-size: 14px;
}

.code-share-modal,
.code-import-modal {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	background: rgba(15, 23, 42, 0.54);
	backdrop-filter: blur(8px);
	z-index: 999;
}

.modal-content {
	width: min(520px, 100%);
	padding: 22px;
	border-radius: 14px;
	background: white;
	box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-bottom: 14px;
}

.modal-header h2 {
	margin: 0;
	color: #1f2937;
	font-size: 20px;
	font-weight: 800;
}

.close-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	border: 1px solid rgba(31, 41, 55, 0.08);
	border-radius: 8px;
	background: #f8fafc;
	color: #475467;
	font-size: 22px;
	line-height: 1;
	cursor: pointer;
	box-shadow: none;
}

.close-btn:hover {
	transform: none;
	background: #eef2f6;
	box-shadow: none;
}

.modal-hint {
	margin: 0 0 12px;
	color: #667085;
	font-size: 14px;
}

.share-code-textarea,
.import-code-textarea {
	box-sizing: border-box;
	width: 100%;
	min-height: 132px;
	padding: 12px;
	border: 1px solid rgba(31, 41, 55, 0.12);
	border-radius: 10px;
	background: #f8fafc;
	color: #1f2937;
	font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	font-size: 12px;
	resize: vertical;
}

.modal-action {
	width: 100%;
	margin-top: 12px;
}

@media (max-width: 760px) {
	.site-header {
		padding-top: 24px;
	}

	.header-inner,
	.toolbar,
	.table-heading,
	.pool-heading {
		align-items: stretch;
		flex-direction: column;
	}

	.header-stats,
	.opt,
	.action-group {
		justify-content: flex-start;
	}

	.home {
		padding: 12px;
		border-radius: 14px;
	}

	.imageranktable,
	.pool-panel {
		padding: 12px;
		overflow-x: auto;
	}

	.btn {
		flex: 1 1 auto;
	}
}
</style>
