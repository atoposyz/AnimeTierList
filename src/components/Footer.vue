<template>
    <footer class = "footer">
        <!-- 自定义页脚内容 -->
        <div class="beian center" m="y-2">
            <a href="https://icp.gov.moe/?keyword=20240313" target="_blank" rel="noopener"
                style="display: flex; padding-right: 5px;">
                <img style="width:24px;height:24px;margin-bottom:-8px" src="https://icp.gov.moe/favicon.ico">
                萌ICP备20240313号
            </a>
            |
            <a style="text-decoration:none;color:#55bb8a; display: flex; padding-left: 5px;"
                href="https://travel.moe/go.html" title="异次元之旅-跃迁-我们一起去萌站成员的星球旅行吧！" target="_blank">
                <img src="https://travel.moe/images/icon/icon64green.png" style="width:24px;height:24px">
                异次元之旅
            </a>
        </div>
        <div class="inspire center">
            <span>Inspired by <a href="https://tiermaker.com/">TierMaker</a> & <a
                href="https://lab.magiconch.com/anime-grid/">动画生涯个人喜好表</a>.</span>
        </div>
        <div class="footer-copyright center">
            <span><a href="https://github.com/atoposyz/AnimeTierList" target="_blank">GitHub</a>
             动画信息来自 <a href="https://bgm.tv/" target="_blank">番组计划</a></span>
        </div>
        <div class = "center">
            <a href="https://atoposyz.github.io"> 返回主站</a>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'AppFooter'
};
</script>

<style scoped>
.footer {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
    margin-top: 50px;
}

.center {
    display: flex;
    justify-content: center;
}

.footer .container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.footer-content {
    max-width: 1200px;
    width: 100%;
}

.footer-copyright {
    margin-top: 0;
    font-size: 0.9em;
}
</style>