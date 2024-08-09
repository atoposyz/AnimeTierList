<!-- src/components/ImageListZone.vue -->
<template>
    <draggable v-model="images" :key="images" :options="{ animation: 200 }" class="image-list" group="anime" @change="on_drag_end">
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
    props: ['newimages', 'index'],//TODO
    data() {
        return {
            images: [
                // { src: '/1.jpg' },
                // { src: '/2.jpg' },
            ],
        };
    },  
    watch: {
        newimages(newvalue, oldvalue) {
            this.images = newvalue;
        }
    },
    methods: {
        emit_change_event(data) {
            this.$emit("change-event", data);
        },
        on_drag_end(data) { // 拖拽结束时，发射信号
            this.emit_change_event(data);
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
