<!-- src/components/SearchAnimeBox.vue -->
<template>
    <div class="search-anime-box ui-shadow">
        <div class="content-box">
            <!-- 第一行：10个颜色球 -->
            <div class="color-picker">
                <div class="color-ball" style="background-color: #FF5733;" onclick="changeColor(index, '#FF5733')">
                </div>
                <div class="color-ball" style="background-color: #FF6F00;" onclick="changeColor(index, '#FF6F00')">
                </div>
                <div class="color-ball" style="background-color: #FF8C00;" onclick="changeColor(index, '#FF8C00')">
                </div>
                <div class="color-ball" style="background-color: #FFB74D;" onclick="changeColor(index, '#FFB74D')">
                </div>
                <div class="color-ball" style="background-color: #FFEB3B;" onclick="changeColor(index, '#FFEB3B')">
                </div>
                <div class="color-ball" style="background-color: #4CAF50;" onclick="changeColor(index, '#4CAF50')">
                </div>
                <div class="color-ball" style="background-color: #2196F3;" onclick="changeColor(index, '#2196F3')">
                </div>
                <div class="color-ball" style="background-color: #9C27B0;" onclick="changeColor(index, '#9C27B0')">
                </div>
                <div class="color-ball" style="background-color: #3F51B5;" onclick="changeColor(index, '#3F51B5')">
                </div>
                <div class="color-ball" style="background-color: #673AB7;" onclick="changeColor(index, '#673AB7')">
                </div>
                <div class="color-ball" style="background-color: #000000;" onclick="changeColor(index, '#000000')">
                </div>
                <div class="color-ball" style="background-color: #B0BEC5;" onclick="changeColor(index, '#B0BEC5')">
                </div>
                <div class="color-ball" style="background-color: #FFFFFF;" onclick="changeColor(index, '#FFFFFF')">
                </div>
            </div>

            <!-- 第二行：文本框 -->
            <div class="text-box">
                <input type="text" id="text-input" :value="store.ranklist[index].name" oninput="updateText()">
            </div>

            <!-- 第三行和第四行：四个按钮 -->
            <div class="button-row">
                <button onclick="resetSettings()">删除本行</button>
                <button onclick="saveSettings()">清空本行</button>
            </div>
            <div class="button-row">
                <button onclick="applySettings()">上边加一行</button>
                <button onclick="cancelSettings()">下边加一行</button>
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
            inputText: '',  // 默认文本
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
        changeColor(color) {
            selectedColor = color;
            document.body.style.backgroundColor = selectedColor; // 改变页面背景颜色
            console.log(`当前选中颜色: ${color}`);
        },

        // 更新输入框文本
        updateText() {
            inputText = document.getElementById('text-input').value;
            console.log(`当前输入文字: ${inputText}`);
        },

        // 重置设置
        resetSettings() {
            selectedColor = '#FF5733';  // 重置颜色
            inputText = '';             // 清空文本框
            document.body.style.backgroundColor = selectedColor;  // 重置背景颜色
            document.getElementById('text-input').value = '';     // 清空输入框
            console.log('设置已重置');
        },

        // 保存设置
        saveSettings() {
            console.log(`已保存设置：颜色 - ${selectedColor}, 文字 - ${inputText}`);
        },

        // 应用设置
        applySettings() {
            alert(`设置已应用：颜色 - ${selectedColor}, 文字 - ${inputText}`);
        },

        // 取消设置
        cancelSettings() {
            resetSettings();  // 取消即重置设置
            console.log('设置已取消');
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