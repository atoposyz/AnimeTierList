<template>
    <Teleport to="body">
    <div class="row-setting-box ui-shadow">
        <div class="content-box">
            <div class="box-header">
                <div>
                    <p>Row Settings</p>
                    <h2>编辑分级行</h2>
                </div>
                <button class="close-icon" @click="closeSearchBox" aria-label="关闭">×</button>
            </div>

            <label class="field">
                <span>分级名称</span>
                <input type="text" v-model="inputText" id="text-input" @input="updateText()" placeholder="例如：年度最爱">
            </label>

            <div class="field">
                <span>标签颜色</span>
                <div class="color-picker">
                    <button v-for="color in colors" :key="color" class="color-ball" :class="{ active: selectedColor === color }" :style="{ backgroundColor: color }" @click="changeColor(color)" :aria-label="`选择颜色 ${color}`"></button>
                </div>
            </div>

            <div class="button-grid">
                <button @click="moveUp()">上移一行</button>
                <button @click="moveDown()">下移一行</button>
                <button @click="addAbove()">上方加一行</button>
                <button @click="addBelow()">下方加一行</button>
                <button class="danger" @click="deleteRow()">删除本行</button>
                <button class="warning" @click="clearRow()">清空本行</button>
            </div>
        </div>
    </div>
    </Teleport>
</template>

<script>
import { store } from '@/utils/store.js'

export default {
    props: ['index'],
    data() {
        return {
            store,
            selectedColor: '#FF5733',
            inputText: '',
            colors: [
                '#FF6B4A',
                '#FF9F1C',
                '#FFD166',
                '#7BC96F',
                '#2EC4B6',
                '#3A86FF',
                '#6D5DFB',
                '#B5179E',
                '#8D99AE',
                '#111827',
                '#F8FAFC',
            ],
        }
    },
    mounted() {
        const idx = this.index;
        if (typeof idx === 'number' && store.ranklist && store.ranklist[idx]) {
            this.inputText = store.ranklist[idx].name || '';
            this.selectedColor = store.ranklist[idx].color || this.selectedColor;
        }
    },
    watch: {
        index(newIdx) {
            if (typeof newIdx === 'number' && store.ranklist && store.ranklist[newIdx]) {
                this.inputText = store.ranklist[newIdx].name || '';
                this.selectedColor = store.ranklist[newIdx].color || this.selectedColor;
            } else {
                this.inputText = '';
            }
        }
    },
    methods: {
        closeSearchBox() {
            this.$emit('closesettingbox');
        },

        changeColor(color) {
            const idx = this.index;
            if (typeof idx === 'number' && store.ranklist && store.ranklist[idx]) {
                store.ranklist[idx].color = color;
                this.selectedColor = color;
            }
        },

        updateText() {
            const idx = this.index;
            if (typeof idx === 'number' && store.ranklist && store.ranklist[idx]) {
                store.ranklist[idx].name = this.inputText;
            }
        },

        moveUp() {
            this.updateText();
            if (this.index > 1) {
                store.moveUp(this.index);
            }
            this.closeSearchBox();
        },
        moveDown() {
            this.updateText();
            if (this.index < store.ranklist.length - 1) {
                store.moveDown(this.index);
            }
            this.closeSearchBox();
        },
        addAbove() {
            this.updateText();
            store.addAbove(this.index);
            this.$emit('reopensetting', this.index);
        },
        addBelow() {
            this.updateText();
            store.addBelow(this.index);
            this.$emit('reopensetting', this.index + 1);
        },
        deleteRow() {
            store.deleteRow(this.index);
            this.closeSearchBox();
        },
        clearRow() {
            store.clearRow(this.index);
            this.closeSearchBox();
        },
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
    width: min(520px, 100%);
    max-height: calc(100dvh - 32px);
    box-sizing: border-box;
    overflow: auto;
    margin: 0;
    padding: 20px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
}

.box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
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

.field {
    display: grid;
    gap: 8px;
    margin-bottom: 18px;
}

.field span {
    color: #344054;
    font-size: 14px;
    font-weight: 800;
}

.field input {
    box-sizing: border-box;
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(31, 41, 55, 0.14);
    border-radius: 10px;
    background: #f8fafc;
    color: #1f2937;
    font: inherit;
    outline: none;
}

.field input:focus {
    border-color: rgba(35, 111, 134, 0.42);
    box-shadow: 0 0 0 4px rgba(35, 111, 134, 0.10);
}

.color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.color-ball {
    width: 34px;
    height: 34px;
    border: 2px solid rgba(31, 41, 55, 0.12);
    border-radius: 999px;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.48);
    transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}

.color-ball:hover,
.color-ball.active {
    transform: translateY(-2px);
    border-color: #236f86;
    box-shadow:
        inset 0 0 0 2px rgba(255, 255, 255, 0.58),
        0 8px 18px rgba(31, 41, 55, 0.14);
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.button-grid button {
    min-height: 42px;
    border: 1px solid rgba(35, 111, 134, 0.16);
    border-radius: 8px;
    background: #eef7f8;
    color: #19596d;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease;
}

.button-grid button:hover {
    transform: translateY(-2px);
    background: #dff0f2;
}

.button-grid .danger {
    border-color: rgba(185, 28, 28, 0.18);
    background: #fff1f2;
    color: #991b1b;
}

.button-grid .danger:hover {
    background: #ffe4e6;
}

.button-grid .warning {
    border-color: rgba(194, 65, 12, 0.18);
    background: #fff7ed;
    color: #9a3412;
}

.button-grid .warning:hover {
    background: #ffedd5;
}

@media (max-width: 460px) {
    .content-box {
        width: 100%;
    }

    .button-grid {
        grid-template-columns: 1fr;
    }
}
</style>
