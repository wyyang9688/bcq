<!--  -->
<template>
    <div class="imgDetailPage page">
        <div class="adBox center">
            <div class="ad vcenter m10">原创绘画 | 清明节海报创新大赛</div>
        </div>
        <div><imgdetail /></div>
    </div>
</template>

<script setup lang="ts">
    import imgdetail from "@/components/imgdetail.vue";
    const src = ref("../../static/image/logoBg.png");
    onMounted(() => {
        //
    });
</script>
<style lang="scss" scoped>
    .page {
        .ad {
            width: 697rpx;
            height: 72rpx;
            background: #bbd9ff;
            border-radius: 51rpx;
            font-family: AlibabaPuHuiTiM;
            font-size: 29rpx;
            color: #333333;
            line-height: 72rpx;
            font-weight: bold;
        }
        .detailBox {
            width: 100%;
            .detail {
                position: relative;
                .imgBox {
                    .resImg {
                        width: 100%;
                    }
                }
            }
            .tool {
                position: absolute;
                z-index: 10;
                top: 36rpx;
                width: 100%;
                left: 0;
                padding: 0 25rpx;
                display: flex;
                justify-content: space-between;
                .tag {
                    width: 167rpx;
                    height: 58rpx;
                    background: rgba(0, 0, 0, 0.55);
                    border-radius: 29rpx;
                    color: #fff;
                    display: flex;
                    line-height: 58rpx;
                    justify-content: center;
                    .text {
                        font-size: 30rpx;
                    }
                }
            }
            .fInfo {
                background-color: rgba(0, 0, 0, 0.35);
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 0 25rpx;
                padding-bottom: 30rpx;
                .topLine {
                    margin-top: 14rpx;
                    height: 55rpx;
                    display: flex;
                    justify-content: space-between;
                    .headerBox {
                        display: flex;
                        .imgBox {
                            width: 54rpx;
                            height: 54rpx;
                            border-radius: 50%;
                            background-color: #fff;
                        }
                        .name {
                            margin-left: 10rpx;
                            height: 25rpx;
                            font-family: AlibabaPuHuiTiM;
                            font-size: 29rpx;
                            color: #ffffff;
                            line-height: 54rpx;
                            text-align: left;
                            font-style: normal;
                        }
                    }
                    .copy {
                        text-align: center;
                        width: 150rpx;
                        height: 54rpx;
                        background: rgba(2, 113, 253, 0.55);
                        border-radius: 27rpx;
                        color: #fff;
                        font-family: AlibabaPuHuiTiM;
                        font-size: 25rpx;
                        color: #ffffff;
                        line-height: 55rpx;
                        font-style: normal;
                    }
                }
                .row {
                    margin-top: 18rpx;
                    color: #fff;
                    display: flex;
                    flex-wrap: wrap;
                    .label {
                        min-width: 230rpx;
                        height: 25rpx;
                        font-family: AlibabaPuHuiTiM;
                        font-size: 25rpx;
                        color: #ffffff;
                        line-height: 30rpx;
                        text-align: left;
                        font-style: normal;
                    }
                    .val {
                        min-height: 25rpx;
                        font-family: AlibabaPuHuiTr, AlibabaPuHuiTi;
                        font-weight: 400;
                        font-size: 25rpx;
                        color: #ffffff;
                        line-height: 30rpx;
                        text-align: left;
                        width: 400rpx;
                    }
                }
            }
        }
    }
</style>
