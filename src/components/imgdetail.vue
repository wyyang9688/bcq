<!--  -->
<template>
    <div class="imgDetailCom page">
        <!-- <div class="adBox center">
            <div class="ad vcenter m10">原创绘画 | 清明节海报创新大赛</div>
        </div> -->
        <div class="detailBox m10">
            <div class="detail">
                <div class="imgBox">
                    <image
                        v-if="item?.imageId"
                        class="resImg"
                        :src="getConfig().imgBasicUrl + item?.imageId"
                        mode="widthFix"
                        lazy-load="false"
                    >
                    </image>
                </div>
                <div class="tool">
                    <div class="start tag" @click="emitLike(item)">
                        <div class="iconBox vcenter" v-show="item?.isPick">
                            <up-icon
                                name="heart-fill"
                                color="red"
                                size="14"
                            ></up-icon>
                        </div>
                        <div class="iconBox vcenter" v-show="!item?.isPick">
                            <up-icon
                                name="heart-fill"
                                color="#c2c2c2"
                                size="14"
                            ></up-icon>
                        </div>
                        <div class="text ml10">{{ item?.tuckCount || 0 }}</div>
                    </div>
                    <div class="del tag">
                        <div class="icon vcenter">
                            <up-icon
                                name="trash"
                                color="#fff"
                                size="18"
                            ></up-icon>
                        </div>
                        <div class="text">删除</div>
                    </div>
                </div>
                <div class="fInfo">
                    <div class="topLine">
                        <div class="headerBox">
                            <div class="imgBox">
                                <image
                                    v-if="item?.imageId"
                                    class="resImg"
                                    :src="item?.accInfo?.headImg"
                                    mode="widthFix"
                                    lazy-load="false"
                                >
                                </image>
                            </div>
                            <div class="name">
                                {{ item?.accInfo?.name || "" }}
                            </div>
                        </div>
                        <div class="copyBox">
                            <div class="copy" @click="copyAndRe(item)">
                                一键复制
                            </div>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 27rpx">
                        <div class="label">基础模型</div>
                        <div class="val">{{ item?.promptModelName }}</div>
                    </div>
                    <div class="row">
                        <div class="label">模型标签</div>
                        <div class="val">{{ item?.promptLabel }}</div>
                    </div>
                    <div class="row">
                        <div class="label">参考图</div>
                        <div class="val">有</div>
                    </div>
                    <div class="row">
                        <div class="label">提示词</div>
                        <div class="val hidden3">
                            {{ item?.promptWord }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { PromptItem } from "@/pages/community/service";
    import { useUserStore } from "@/store/user-store";
    import { getConfig } from "@/data/config";
    import { communityService } from "@/pages/community/service";
    const service = communityService().service;
    const userStore = useUserStore();
    const src = ref("../static/image/logoBg.png");
    const props = defineProps<{
        item: PromptItem;
    }>();
    const emits = defineEmits({
        like: (item: PromptItem) => true,
        detail: (item: PromptItem) => true
    });
    const emitLike = (item: PromptItem) => {
        if (!item.isPick) {
            emits("like", item);
        }
    };
    const copyAndRe = (item: PromptItem) => {
        console.log(item);
        uni.setClipboardData({
            data: item.promptWord,
            showToast: true,
            success: function () {
                console.log("success");
                service.likePrompt({
                    promptId: item.id,
                    uid: userStore.userInfo.uid,
                    actType: 0
                });
            }
        });
    };
    onMounted(() => {
        //
        console.log(props.item);
        // setTimeout(() => {
        //     console.log(props.item);
        // }, 5000);
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
                    .iconBox {
                        line-height: 29rpx;
                    }
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
                            overflow: hidden;
                            border-radius: 50%;
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
