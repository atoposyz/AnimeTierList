<template>
    <Teleport to="body">
    <div class="search-anime-box ui-shadow">
        <div class="content-box">
            <div class="box-header">
                <div>
                    <p>Bangumi Search</p>
                    <h2>添加动画</h2>
                </div>
                <button class="close-icon" @click="closeSearchBox" aria-label="关闭">×</button>
            </div>

            <form @submit.prevent="searchFromBangumi">
                <input v-model="message" placeholder="输入关键词，按回车搜索动画">
            </form>

            <div class="loading" v-if="loading">正在搜索...</div>

            <div class="anime-list" v-if="imageurls.length">
                <template v-for="(item, index) in imageurls" :key="index">
                    <button class="anime-item" :data-id="item.id" @click="selectanime(item.url)">
                        <img :src="item.url" crossOrigin="Anonymous" :alt="item.title">
                        <span>{{ item.title || '未命名动画' }}</span>
                    </button>
                </template>
            </div>

            <div class="empty-state" v-else-if="!loading">
                没有找到结果，换个关键词试试。
            </div>
        </div>
    </div>
    </Teleport>
</template>

<script>
import { store } from '@/utils/store.js'

const APIURL = `https://api.bgm.tv/search/subject/`
const CORSurl = `https://proxyz-tau.vercel.app/api/proxy-image?url=`;
const ImageURL = `https://api.bgm.tv/v0/subjects/`;

export default {
    data() {
        return {
            store,
            message: '',
            Caches: [],
            imageurls: [],
            loading: false,
        }
    },
    mounted() {
        this.Caches = [
            { id: 464376, name_cn: "败犬女主太多了！" },
            { id: 389156, name_cn: "地。关于地球的运动" },
            { id: 431767, name_cn: "GIRLS BAND CRY" },
            { id: 395378, name_cn: "迷宫饭" },
            { id: 372010, name_cn: "狼与香辛料 行商邂逅贤狼" },
            { id: 404809, name_cn: "末日列车去哪里？" },
            { id: 429644, name_cn: "名侦探柯南：百万美元的五棱星" },
            { id: 448478, name_cn: "失忆投捕" }
        ]
        this.resetAnimeList(this.Caches)
    },
    methods: {
        async get(url) {
            if (this.Caches[url]) return this.Caches[url];
            document.documentElement.setAttribute('data-no-touch', true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error('fetch error', response.status, response.statusText);
                    return null;
                }
                const data = await response.json();
                this.Caches[url] = data;
                return data;
            } catch (err) {
                console.error('network error:', err);
                return null;
            } finally {
                document.documentElement.setAttribute('data-no-touch', false);
            }
        },

        async searchFromBangumiByKeyword(keyword) {
            let url = `${APIURL}`;
            if (keyword) url = url + `${encodeURIComponent(keyword)}?type=2&responseGroup=small&max_results=8`;
            this.loading = true;
            const animes = await this.get(url);
            this.loading = false;
            if (!animes || !animes.list) {
                this.resetAnimeList([]);
                return;
            }
            this.resetAnimeList(animes.list);
        },

        searchFromBangumi() {
            const keyword = this.message.trim();
            this.searchFromBangumiByKeyword(keyword);
        },

        resetAnimeList(animes) {
            this.imageurls = animes.map(anime => {
                const raw = `${ImageURL}${anime.id}/image?type=common`;
                const url = `${CORSurl}${encodeURIComponent(raw)}`;

                return {
                    id: anime.id,
                    url: url,
                    title: anime.name_cn || anime.name || '未命名动画'
                };
            })
        },

        selectanime(animeurl) {
            store.AddNewAnime(animeurl)
            this.$emit('closesearchbox');
        },

        closeSearchBox() {
            this.$emit('closesearchbox');
        }
    }
}
</script>

<style scoped>
.ui-shadow {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    overflow: hidden;
    background: rgba(15, 23, 42, 0.62);
    backdrop-filter: blur(8px);
    z-index: 9999;
}

.content-box {
    width: min(680px, 100%);
    max-height: calc(100dvh - 32px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0;
    padding: 18px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
}

.box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
}

.box-header p {
    margin: 0 0 4px;
    color: #2b7286;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
}

.box-header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 22px;
    font-weight: 800;
}

.close-icon {
    width: 34px;
    height: 34px;
    border: 1px solid rgba(31, 41, 55, 0.08);
    border-radius: 8px;
    background: #f8fafc;
    color: #475467;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
}

form {
    margin-bottom: 14px;
}

form input {
    box-sizing: border-box;
    width: 100%;
    padding: 13px 14px;
    border: 1px solid rgba(31, 41, 55, 0.14);
    border-radius: 10px;
    background: #f8fafc;
    color: #1f2937;
    font: inherit;
    font-size: 16px;
    outline: none;
}

form input:focus {
    border-color: rgba(35, 111, 134, 0.42);
    box-shadow: 0 0 0 4px rgba(35, 111, 134, 0.10);
}

.anime-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
    gap: 12px;
    overflow: auto;
    padding-right: 4px;
}

.anime-item {
    display: grid;
    gap: 8px;
    padding: 8px;
    border: 1px solid rgba(31, 41, 55, 0.08);
    border-radius: 10px;
    background: #ffffff;
    color: #1f2937;
    text-align: left;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.anime-item:hover {
    transform: translateY(-3px);
    border-color: rgba(35, 111, 134, 0.28);
    box-shadow: 0 14px 28px rgba(31, 41, 55, 0.12);
}

.anime-item img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    display: block;
    border-radius: 7px;
    background: #e5e7eb;
}

.anime-item span {
    min-height: 40px;
    color: #344054;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.loading,
.empty-state {
    padding: 28px;
    border: 1px dashed rgba(31, 41, 55, 0.14);
    border-radius: 10px;
    background: #f8fafc;
    color: #667085;
    text-align: center;
}

@media (max-width: 460px) {
    .anime-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
