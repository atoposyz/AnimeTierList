// store.js
import { reactive } from 'vue'
import { compileScript } from 'vue/compiler-sfc';

export const store = reactive({
    ranklist: [
        { index: 0, urls: [] },
        { index: 1, name: "年度最爱", color: "OrangeRed ", urls: [] },
        { index: 2, name: "很喜欢", color: "Orange", urls: [] },
        { index: 3, name: "喜欢", color: "GoldenRod", urls: [] },
        { index: 4, name: "一般喜欢", color: "Gold", urls: [] },
        { index: 5, name: "不怎么喜欢", color: "Gray", urls: [] },
    ],
    sortablelist: [

    ],
    ClearRankList() {
        for (let i = 1; i < this.ranklist.length; i++) {
            for (let j = 0; j < this.ranklist[i].urls.length; j++) {
                this.ranklist[0].urls.push(this.ranklist[i].urls[j]);
            }
            this.ranklist[i].urls = [];
        }
    },
    ClearAllList() {
        for (let i = 0; i < this.ranklist.length; i++) {
            this.ranklist[i].urls = [];
        }
        this.sortablelist = [];
    },
    LoadRankList(jsonobj) {
        console.log(jsonobj)
        const importjson = JSON.parse(JSON.stringify(jsonobj));
        if (importjson.length) {
            for (var i = 0; i < importjson.length; i++) {
                this.ranklist[i].name = importjson[i].name;
                // this.ranklist[i].color = importjson[i].color;
                this.ranklist[i].urls = importjson[i].urls;
            }
        }
    },
    LoadSortableList(jsonobj) {
        console.log(jsonobj)
        this.sortablelist = [];
        for (var i = 0; i < jsonobj.length; i += 1) {
            const url = jsonobj[i].src;
            this.sortablelist.push({
                src: url
            });
        }
    },
    AddNewAnime(src) {
        //this.sortablelist.push({ src: src });
        this.ranklist[0].urls.push({ src: src });
    },
    getRankListJson() {
        const json1 = JSON.stringify(this.ranklist.map(item => {
                return {
                    index: item.index,
                    name: item.name,
                    color: item.color,
                    urls: item.urls.map(url => {
                        return {
                            src: url.src
                        };
                    })
                };
            }), null, 2);
        return json1;
    },
    getSortableListJson() {
        const json2 = JSON.stringify(this.sortablelist.map(item => {
            return {
                src: item.src
            }
        }), null, 2);
        return json2;
    },
    DumpJson() {


        return JSON.stringify({ rank: JSON.parse(this.getRankListJson()), sortable: JSON.parse(this.getSortableListJson()) }, null, 2)
    },
})