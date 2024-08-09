<!-- src/components/ImageListZone.vue -->
<template>
    <draggable v-model="images" :options="{ animation: 200 }" class="image-list" group="anime" @change="on_drag_end">
        <template #item="{ element }">
            <div class="image-item">
                <img :src="element.src" alt="">
            </div>
        </template>
    </draggable>
</template>


<script>
import draggable from 'vuedraggable';

export default {
    components: {
        draggable,
    },
    props: ['newimage', 'newimages', 'index'],//TODO
    data() {
        return {
            images: [
                // { src: '/1.jpg' },
                // { src: '/2.jpg' },
            ],
        };
    },  
    mounted() {
        this.$bus.on('loadUrlList', this.handleData);
    },
    beforeUnmount() {
        this.$bus.off('loadUrlList', this.handleData);
    },
    watch: {
        newimage(newurl) {
            this.addurl(newurl);
        },
        newimages(newurls) {
            this.images = newurls;
        }
    },
    methods: {
        handleData(msg_obj) {
            const json_object = JSON.parse(msg_obj);
            if(this.index == json_object.index) {
                this.images = json_object.url;
            }
        },
        emit_change_event(data) {
            this.$emit("change-event", data);
        },
        on_drag_end(data) { // 拖拽结束时，发射信号
            this.emit_change_event(data);
        },
        addurl(url) {
            this.images.push({ src: url })
            console.log('get new url!');
        }
    },
};
</script>

<style scoped>
.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    width: 100%;
}

.image-item {
    max-height: 120px;
    width: auto;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-item img {
    max-height: 120px;
    width: auto;
    align-items: center;
    justify-content: center;
    object-fit: cover;
}
</style>
