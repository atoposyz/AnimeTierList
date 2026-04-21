<template>
  <div class="image-rank-row">
    <div
      class="rank-name"
      :style="{ 'background-color': store.ranklist[index].color }"
      contenteditable="true"
      spellcheck="false"
      @input="onNameInput($event)"
    >
      {{ store.ranklist[index].name }}
    </div>
    <ImageListZone class="image-list" :index="index" :key="index" @change-event="emit_change_event" />
    <button class="settings" @click="opensettingbox(index)" aria-label="编辑当前分级">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>
    </button>
  </div>
</template>

<script>
import ImageListZone from './ImageListZone.vue';
import { store } from '@/utils/store.js'

export default {
  components: {
    ImageListZone,
  },
  props: ['index'],
  data() {
    return {
      store,
    }
  },
  methods: {
    emit_change_event(data) {
      this.$emit("change-event", data);
    },
    opensettingbox(index) {
      this.$emit("opensettingbox", index);
    },
    onNameInput(e) {
      const text = (e.target && e.target.innerText) ? e.target.innerText.trim() : '';
      if (typeof this.index === 'number' && this.store && this.store.ranklist && this.store.ranklist[this.index]) {
        this.store.ranklist[this.index].name = text;
      }
    }
  }
}
</script>

<style scoped>
.image-rank-row {
  display: grid;
  grid-template-columns: 132px minmax(260px, 1fr) 42px;
  gap: 10px;
  min-height: 122px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid rgba(31, 41, 55, 0.08);
  border-radius: 10px;
  background: #fbfcfd;
  box-shadow: 0 8px 20px rgba(31, 41, 55, 0.05);
}

.image-rank-row:nth-child(even) {
  background: #f7fafb;
}

.rank-name {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 10px;
  border-radius: 8px;
  color: #111827;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  word-break: break-word;
  outline: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.rank-name:hover,
.rank-name:focus {
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.58),
    0 10px 20px rgba(31, 41, 55, 0.08);
}

.image-list {
  min-width: 0;
}

.settings {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  width: 42px;
  border: 1px solid rgba(31, 41, 55, 0.08);
  border-radius: 8px;
  background: #ffffff;
  color: #667085;
  cursor: pointer;
  transition: color 0.16s ease, background 0.16s ease, transform 0.16s ease;
}

.settings:hover {
  color: #236f86;
  background: #eef7f8;
  transform: translateY(-1px);
}

@media (max-width: 680px) {
  .image-rank-row {
    grid-template-columns: 90px minmax(220px, 1fr) 38px;
    min-width: 430px;
  }

  .rank-name {
    font-size: 15px;
  }
}
</style>
