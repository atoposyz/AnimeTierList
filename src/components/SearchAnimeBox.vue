<!-- src/components/SearchAnimeBox.vue -->
<template>
    <div class="search-anime-box ui-shadow">
        <div class="content-box">
            <form @submit.prevent="searchFromBangumi">
                <input v-model="message" placeholder="输入关键词、回车查找动画">
            </form>
            <div class="anime-list" v-if="imageurls.length">
                <template v-for="(item, index) in imageurls" :key="index">
                    <div class="anime-item" :data-id="item.id" @click="selectanime(item.url)">
                        <img :src="item.url" crossOrigin="Anonymous">
                        <h3>{{ item.title }}</h3>
                    </div>
                </template>
            </div>
            <div class="foot">
                <a class="close ui-btn current" @click="closeSearchBox">关闭选框</a>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '@/utils/store.js'
// const APIURL = `https://lab.magiconch.com/api/bangumi/`;
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
            {
                "id": 464376,
                "name_cn": "败犬女主太多了！"
            },
            {
                "id": 389156,
                "name_cn": "地。-关于地球的运动-"
            },
            {
                "id": 431767,
                "name_cn": "GIRLS BAND CRY"
            },
            {
                "id": 395378,
                "name_cn": "迷宫饭"
            },
            {
                "id": 372010,
                "name_cn": "狼与香辛料 行商邂逅贤狼"
            },
            {
                "id": 404809,
                "name_cn": "末日列车去哪里？"
            },
            {
                "id": 429644,
                "name_cn": "名侦探柯南：百万美元的五棱星"
            },
            {
                "id": 448478,
                "name_cn": "失忆投捕"
            }
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
            const keyword = this.message;
            this.searchFromBangumiByKeyword(keyword);
        },

        resetAnimeList(animes) {
            this.imageurls = animes.map(anime => {
                // var url = CORSurl + ImageURL + anime.id + '/image?type=common'
                const raw = `${ImageURL}${anime.id}/image?type=common`;
                const url = `${CORSurl}${encodeURIComponent(raw)}`;

                return {
                    id: anime.id,
                    url: url,
                    title: anime.name_cn
                };
            })
        },

        selectanime(animeurl) {
            store.AddNewAnime(animeurl)
            // this.$bus.emit('dataSent', animeurl);
            // console.log("successfully sent!")
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
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 40px 10px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
}

.ui-shadow .content-box {
    background: #FFF;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    max-width: 520px;
    margin: 0 auto;
    border-radius: 8px;
}

@media (max-width: 542px) {
    .ui-shadow .content-box {
        max-width: 392px
    }
}

.search-anime-box form {
    padding: 8px 8px 0
}

.search-anime-box form input {
    font: inherit;
    font-size: 18px;
    outline: none;
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    margin: 0;
    border: 2px solid #444;
    border-radius: 4px
}

.search-anime-box form input:focus {
    border-color: #222
}

.search-anime-box .foot {
    padding: 8px
}

.search-anime-box .foot .ui-btn {
    margin-top: 8px
}

.anime-list {
    pointer-events: none;
    padding: 4px;
    max-width: 512px;
    overflow: hidden;
}

.anime-list .anime-item {
    float: left;
    width: 120px;
    padding: 4px;
    text-align: left;
    cursor: pointer;
    pointer-events: auto;
}

.anime-list .anime-item>* {
    pointer-events: none
}

.anime-list .anime-item img {
    height: 160px;
    width: 120px;
    object-fit: cover;
    display: block;
    border-radius: 2px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    background: #222
}

.anime-list .anime-item h3 {
    margin: 4px 0;
    font-size: 14px;
    line-height: 16px;
    height: 32px;
    overflow: hidden;
    word-break: break-all
}

@media (max-width: 412px) {
    .anime-list .anime-item {
        width: calc((100vw - 20px - 8px) / 3 - 8px)
    }

    .anime-list .anime-item img {
        height: calc((100vw - 20px - 8px) / 3 / 3 * 4 - 8px);
        width: calc((100vw - 20px - 8px) / 3 - 8px)
    }
}
</style>