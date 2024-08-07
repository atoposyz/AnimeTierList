<!-- src/components/ImageListZone.vue -->
<template>
    <draggable v-model="images" :options="{ animation: 200 }" class="image-list" group="anime">
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
    data() {
        return {
            images: [
                { src: '/1.jpg' },
                { src: '/2.jpg' },
            ],
        };
    },
    methods: {

    },
};
</script>

<style scoped>
.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
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
