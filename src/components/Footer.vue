<template>
    <footer class="footer">
        <div class="footer-links">
            <a href="https://atoposyz.github.io">返回主站</a>
            <a href="https://github.com/atoposyz/AnimeTierList" target="_blank" rel="noopener">GitHub</a>
            <a href="https://bgm.tv/" target="_blank" rel="noopener">Bangumi</a>
        </div>
        <div class="beian">
            <a href="https://icp.gov.moe/?keyword=20240313" target="_blank" rel="noopener">
                <img src="https://icp.gov.moe/favicon.ico" alt="">
                萌ICP备20240313号
            </a>
            <span>|</span>
            <a href="https://travel.moe/go.html" title="异次元之旅" target="_blank" rel="noopener">
                <img src="https://travel.moe/images/icon/icon64green.png" alt="">
                异次元之旅
            </a>
        </div>
        <div class="inspire">
            Inspired by <a href="https://tiermaker.com/" target="_blank" rel="noopener">TierMaker</a> &
            <a href="https://lab.magiconch.com/anime-grid/" target="_blank" rel="noopener">动画生涯个人喜好表</a>.
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
    display: grid;
    gap: 12px;
    max-width: 1120px;
    margin: 18px auto 0;
    padding: 20px 12px 8px;
    color: #667085;
    text-align: center;
    font-size: 13px;
}

.footer-links,
.beian {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.footer-links a {
    color: #236f86;
    font-weight: 800;
}

.beian a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.beian img {
    width: 20px;
    height: 20px;
}

.footer a {
    color: #236f86;
}

.footer a:hover {
    text-decoration: underline;
}
</style>
