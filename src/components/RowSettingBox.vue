<!-- src/components/RowSettingBox.vue -->
<template>
    <div class="search-anime-box ui-shadow">
        <div class="content-box">
            <!-- 第一行：颜色球 -->
            <div class="color-picker">
                <div class="color-ball" style="background-color: #FF5733;" @click="changeColor('#FF5733')">
                </div>
                <div class="color-ball" style="background-color: #FF6F00;" @click="changeColor('#FF6F00')">
                </div>
                <div class="color-ball" style="background-color: #FF8C00;" @click="changeColor('#FF8C00')">
                </div>
                <div class="color-ball" style="background-color: #FFB74D;" @click="changeColor('#FFB74D')">
                </div>
                <div class="color-ball" style="background-color: #FFEB3B;" @click="changeColor('#FFEB3B')">
                </div>
                <div class="color-ball" style="background-color: #4CAF50;" @click="changeColor('#4CAF50')">
                </div>
                <div class="color-ball" style="background-color: #2196F3;" @click="changeColor('#2196F3')">
                </div>
                <div class="color-ball" style="background-color: #9C27B0;" @click="changeColor('#9C27B0')">
                </div>
                <div class="color-ball" style="background-color: #3F51B5;" @click="changeColor('#3F51B5')">
                </div>
                <div class="color-ball" style="background-color: #673AB7;" @click="changeColor('#673AB7')">
                </div>
                <div class="color-ball" style="background-color: #000000;" @click="changeColor('#000000')">
                </div>
                <div class="color-ball" style="background-color: #B0BEC5;" @click="changeColor('#B0BEC5')">
                </div>
                <div class="color-ball" style="background-color: #FFFFFF;" @click="changeColor('#FFFFFF')">
                </div>
            </div>

            <div class="text-box">
                <input type="text" v-model="inputText" id="text-input" @input="updateText()">
            </div>

            <div class="button-row">
                <button @click="moveUp()">上移一行</button>
                <button @click="moveDown()">下移一行</button>
            </div>
            <div class="button-row">
                <button @click="addAbove()">上边加一行</button>
                <button @click="addBelow()">下边加一行</button>
            </div>
            <div class="button-row">
                <button @click="deleteRow()">删除本行</button>
                <button @click="clearRow()">清空本行</button>
            </div>

            <div class="foot">
                <a class="close ui-btn current" @click="closeSearchBox">关闭</a>
            </div>
        </div>

    </div>
</template>

<script>
import { store } from '@/utils/store.js'

export default {
    props: ['index'],
    data() {
        return {
            store,
            selectedColor: '#FF5733', // 默认颜色
            inputText: '',  // 延迟在 mounted 中初始化，避免在 data() 使用 this.index
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

        // 改变颜色（只传 color，内部使用 this.index）
        changeColor(color) {
            const idx = this.index;
            if (typeof idx === 'number' && store.ranklist && store.ranklist[idx]) {
                store.ranklist[idx].color = color;
                this.selectedColor = color;
                console.log(`当前选中颜色: ${color}`);
            }
        },

        // 更新输入框文本
        updateText() {
            const idx = this.index;
            if (typeof idx === 'number' && store.ranklist && store.ranklist[idx]) {
                store.ranklist[idx].name = this.inputText;
                console.log(`当前输入文字: ${this.inputText}`);
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
            console.log("trying addAbove");
            // persist current edits
            this.updateText();
            store.addAbove(this.index);
            // reopen settings for the newly inserted row (the new row sits at this.index)
            this.$emit('reopensetting', this.index);
        },
        addBelow() {
            // persist current edits
            this.updateText();
            store.addBelow(this.index);
            // reopen settings for the newly inserted row (it sits at this.index + 1)
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
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 40px 10px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.8)
}

.ui-shadow .content-box {
    background: #FFF;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    max-width: 520px;
    margin: 100px auto;
    min-width: 500px;

    padding: 20px;
    border-radius: 10px;           /* 圆角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* 柔和阴影 */
}

@media (max-width: 542px) {
    .ui-shadow .content-box {
        max-width: 392px
    }
}

.color-picker {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.color-ball {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #000;
}

.text-box {
    margin-bottom: 20px;
}

.text-box input {
    width: 80%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ced4da;     /* 浅灰色边框 */
    border-radius: 6px;            /* 圆角 */
    background-color: #f8f9fa;     /* 背景色 */
    color: #495057; 
}

.button-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;                     /* 按钮之间的间距 */
  margin-bottom: 15px;
}

.button-row button {
    width: 48%;
    padding: 10px;
    font-size: 16px;
    flex: 1;                       /* 按钮宽度均分 */
    padding: 10px;
    background-color: #b8bcce;     /* 按钮背景色 */
    color: white;                  /* 白色文字 */
    border: none;
    border-radius: 6px;            /* 圆角 */
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.button-row button:hover {
    background-color: #707777;     /* 鼠标悬停时按钮颜色变暗 */
    transform: translateY(-2px);   /* 轻微上移效果 */
}

.buttonrow button:focus {
  outline: none;                 /* 去除聚焦时的轮廓 */
}

.close {
    padding: 10px 20px;
    background-color: #ff5c5c;      /* 红色退出按钮 */
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.close:hover {
  background-color: #e04f4f;      /* 悬停时变色 */
}

.close:focus {
  outline: none;
}
</style>