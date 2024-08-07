<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="beian">
                    <a href="https://icp.gov.moe/?keyword=20240313" target="_blank">萌ICP备20240313号</a>
                </div>
                <div class="inspire">
                    Inspired by <a href="https://tiermaker.com/">TierMaker</a> & <a
                        href="https://lab.magiconch.com/anime-grid/">动画生涯个人喜好表</a>.
                </div>
                <div class="footer-copyright">
                    <a href="https://github.com/atoposyz/AnimeTierList" target="_blank">GitHub</a>
                    &nbsp;
                    <span>动画信息来自 <a href="https://bgm.tv/" target="_blank">番组计划</a></span>
                </div>
            </div>
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