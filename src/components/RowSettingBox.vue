<!-- src/components/SearchAnimeBox.vue -->
<template>
    <div class="search-anime-box ui-shadow">
        <div class="content-box">
            <!-- 第一行：10个颜色球 -->
            <div class="color-picker">
                <div class="color-ball" style="background-color: #FF5733;" @click="changeColor(index, '#FF5733')">
                </div>
                <div class="color-ball" style="background-color: #FF6F00;" @click="changeColor(index, '#FF6F00')">
                </div>
                <div class="color-ball" style="background-color: #FF8C00;" @click="changeColor(index, '#FF8C00')">
                </div>
                <div class="color-ball" style="background-color: #FFB74D;" @click="changeColor(index, '#FFB74D')">
                </div>
                <div class="color-ball" style="background-color: #FFEB3B;" @click="changeColor(index, '#FFEB3B')">
                </div>
                <div class="color-ball" style="background-color: #4CAF50;" @click="changeColor(index, '#4CAF50')">
                </div>
                <div class="color-ball" style="background-color: #2196F3;" @click="changeColor(index, '#2196F3')">
                </div>
                <div class="color-ball" style="background-color: #9C27B0;" @click="changeColor(index, '#9C27B0')">
                </div>
                <div class="color-ball" style="background-color: #3F51B5;" @click="changeColor(index, '#3F51B5')">
                </div>
                <div class="color-ball" style="background-color: #673AB7;" @click="changeColor(index, '#673AB7')">
                </div>
                <div class="color-ball" style="background-color: #000000;" @click="changeColor(index, '#000000')">
                </div>
                <div class="color-ball" style="background-color: #B0BEC5;" @click="changeColor(index, '#B0BEC5')">
                </div>
                <div class="color-ball" style="background-color: #FFFFFF;" @click="changeColor(index, '#FFFFFF')">
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
                <a class="close ui-btn current" @click="closeSearchBox">关闭设置</a>
            </div>
        </div>


    </div>
</template>

<script>
import { store } from '@/utils/store.js'

export default {
    data() {
        return {
            store,
            selectedColor: '#FF5733', // 默认颜色
            inputText: store.ranklist[this.index].name,  // 默认文本
        }
    },
    props: ['index'],
    mounted() {

    },
    methods: {
        closeSearchBox() {
            this.$emit('closesettingbox');
        },


        // 改变颜色
        changeColor(index, color) {
            store.ranklist[index].color = color;
            console.log(`当前选中颜色: ${color}`);
        },

        // 更新输入框文本
        updateText() {
            store.ranklist[this.index].name = this.inputText;
            console.log(`当前输入文字: ${this.inputText}`);
        },

        moveUp() {
            if(this.index > 1) {
                store.moveUp(this.index);
            }
            this.closeSearchBox();
        },
        moveDown() {
            if(this.index < store.ranklist.length - 1) {
                store.moveDown(this.index);
            }
            this.closeSearchBox();
        },
        addAbove() {
            console.log("trying addAbove");
            store.addAbove(this.index);
            this.closeSearchBox();
        },
        addBelow() {
            store.addBelow(this.index);
            this.closeSearchBox();
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
    padding: 10px;
    border-radius: 8px;
    min-width: 500px;
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
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.button-row button {
    width: 48%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    transition: background-color 0.3s;
}

.button-row button:hover {
    background-color: #45a049;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>