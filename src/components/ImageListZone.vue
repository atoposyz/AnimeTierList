<template>
    <draggable v-model="store.ranklist[index].urls" :key="index" :options="{ animation: 200 }" class="image-list" group="anime" @change="on_drag_end">
        <template #item="{ element }">
            <div class="image-item">
                <img :src="element.src" alt="anime image" crossorigin="anonymous" loading="lazy">
            </div>
        </template>
    </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import { store } from '@/utils/store.js';

export default {
    components: {
        draggable,
    },
    props: ['index'],
    data() {
        return {
            store,
        };
    },
    methods: {
        emit_change_event(data) {
            this.$emit("change-event", data);
        },
        on_drag_end(data) {
            this.emit_change_event(data);
        }
    },
};
</script>

<style scoped>
.image-list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
    width: 100%;
    min-height: 100px;
    padding: 2px;
}

.image-list:empty {
    border: 1px dashed rgba(31, 41, 55, 0.12);
    border-radius: 8px;
    background: repeating-linear-gradient(
        -45deg,
        rgba(35, 111, 134, 0.035),
        rgba(35, 111, 134, 0.035) 8px,
        rgba(35, 111, 134, 0.06) 8px,
        rgba(35, 111, 134, 0.06) 16px
    );
}

.image-item {
    width: 74px;
    height: 102px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    background: #e5e7eb;
    box-shadow: 0 8px 18px rgba(31, 41, 55, 0.10);
    cursor: grab;
    transition: box-shadow 0.18s ease, transform 0.18s ease;
}

.image-item:hover {
    box-shadow: 0 12px 24px rgba(31, 41, 55, 0.16);
    transform: translateY(-3px);
}

.image-item:active {
    cursor: grabbing;
}

.image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (max-width: 680px) {
    .image-item {
        width: 62px;
        height: 88px;
    }
}
</style>
