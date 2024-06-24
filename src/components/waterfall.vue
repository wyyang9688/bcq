<!--  -->
<template>
    <div class="waterfallCom com">
        <div class="waterfall">
            <up-waterfall v-model="flowList" ref="uWaterfallRef">
                <template v-slot:left="{ leftList }">
                    <view
                        class="demo-warter"
                        @click="goToDetail(item)"
                        v-for="(item, index) in leftList"
                        :key="index"
                    >
                        <!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->

                        <div class="imgBox">
                            <image
                                @click.stop="clickImg(item)"
                                class="resImg w100"
                                :src="
                                    item.image ||
                                    getConfig().imgBasicUrl + item.imageId
                                "
                                mode="widthFix"
                            ></image>

                            <div
                                class="fcheckBox"
                                v-show="showModel == 1 && item.auditingSta != 1"
                            >
                                {{
                                    item.auditingSta == 0
                                        ? "待审核"
                                        : item.auditingSta == 1
                                          ? "参赛作品"
                                          : "未通过"
                                }}
                            </div>
                            <div class="ftitle" v-show="showModel == 1">
                                {{ item.title || item.promptTitle }}
                            </div>
                        </div>
                        <div class="infoBox" v-show="showModel == 0">
                            <div class="titleBox flex">
                                <div class="title grow hidden2">
                                    {{ item.title || item.promptTitle }}
                                </div>
                                <div
                                    class="rt flex"
                                    @click.stop="switchPick(item)"
                                >
                                    <div class="iconBox" v-show="item.isPick">
                                        <up-icon
                                            name="heart-fill"
                                            color="red"
                                            size="14"
                                        ></up-icon>
                                    </div>
                                    <div class="iconBox" v-show="!item.isPick">
                                        <up-icon
                                            name="heart-fill"
                                            color="#c2c2c2"
                                            size="14"
                                        ></up-icon>
                                    </div>
                                    <div class="num">
                                        {{ item.num || item.tuckCount || 0 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </view>
                </template>
                <template v-slot:right="{ rightList }">
                    <view
                        class="demo-warter"
                        v-for="(item, index) in rightList"
                        :key="index"
                    >
                        <div class="imgBox">
                            <image
                                @click.stop="clickImg(item)"
                                class="resImg w100"
                                :src="
                                    item.image ||
                                    getConfig().imgBasicUrl + item.imageId
                                "
                                mode="widthFix"
                            ></image>

                            <div
                                class="fcheckBox"
                                v-show="showModel == 1 && item.auditingSta != 1"
                            >
                                {{
                                    item.auditingSta == 0
                                        ? "待审核"
                                        : item.auditingSta == 1
                                          ? "参赛作品"
                                          : "未通过"
                                }}
                            </div>
                            <div class="ftitle" v-show="showModel == 1">
                                {{ item.title || item.promptTitle }}
                            </div>
                        </div>
                        <div class="infoBox" v-show="showModel == 0">
                            <div class="titleBox flex">
                                <div class="title grow hidden2">
                                    {{ item.title || item.promptTitle }}
                                </div>
                                <div
                                    class="rt flex"
                                    @click.stop="switchPick(item)"
                                >
                                    <div class="iconBox" v-show="item.isPick">
                                        <up-icon
                                            name="heart-fill"
                                            color="red"
                                            size="14"
                                        ></up-icon>
                                    </div>
                                    <div class="iconBox" v-show="!item.isPick">
                                        <up-icon
                                            name="heart-fill"
                                            color="#c2c2c2"
                                            size="14"
                                        ></up-icon>
                                    </div>
                                    <div class="num">
                                        {{ item.num || item.tuckCount || 0 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </view>
                </template>
            </up-waterfall>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getConfig } from "@/data/config";
    import type { PromptItem } from "@/pages/community/service";
    const props = withDefaults(
        defineProps<{ list: PromptItem[]; showModel: string | number }>(),
        { showModel: 0 }
    );
    const list = [
        // {
        //     num: 1,
        //     title: "北国风光，千里冰封，万里雪飘",
        //     shop: "李白杜甫白居易旗舰店",
        //     isPick: true,
        //     image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg"
        // },
        // {
        //     num: 2,
        //     title: "望长城内外，惟余莽莽",
        //     shop: "李白杜甫白居易旗舰店",
        //     image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg"
        // }
    ];
    const flowList = computed(() => props.list || []);
    // let flowList: any = ref([
    //     {
    //         num: 1,
    //         title: "北国风光，千里冰封，万里雪飘",
    //         shop: "李白杜甫白居易旗舰店",
    //         isPick: true,
    //         image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg"
    //     },
    //     {
    //         num: 2,
    //         title: "望长城内外，惟余莽莽",
    //         shop: "李白杜甫白居易旗舰店",
    //         image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg"
    //     }
    // ]);
    // const addRandomData = () => {
    //     for (let i = 0; i < list.length; i++) {
    //         let index = i;

    //         let item = JSON.parse(JSON.stringify(list[index]));
    //         item.id = uni.$u.guid();
    //         flowList.value.push(item);
    //     }
    //     console.log(flowList.value);
    // };
    const uWaterfallRef = ref();
    const remove = (id: string) => {
        // uWaterfallRef.value?.clear();
        console.log(id);
        uWaterfallRef.value?.remove(id);
    };
    const update = (id: string) => {
        uWaterfallRef.value?.modify(id, "num", 999);
    };
    const emits = defineEmits({
        like: (item: PromptItem) => true,
        detail: (item: PromptItem) => true
    });
    const switchPick = (item: any) => {
        // item.isPick = !item.isPick;
        // uWaterfallRef.value?.modify(item.id, "isPick", item.isPick);
        // if (item.isPick) {
        //     uWaterfallRef.value?.modify(item.id, "num", ++item.num);
        // } else {
        //     uWaterfallRef.value?.modify(item.id, "num", --item.num);
        // }
        if (!item.isPick) {
            emits("like", item);
        }
    };
    const clear = () => {
        console.log("waterfall clear");
        uWaterfallRef.value?.clear();
    };
    const reset = () => {
        clear();
    };
    // watch(
    //     props,
    //     (newValue, oldValue) => {
    //         console.log("props", newValue, oldValue);
    //     },
    //     { immediate: true, deep: true }
    // );
    onMounted(() => {
        // flowList.value = [];
    });
    const goToDetail = (item: AnyObject) => {
        console.log(item);
    };
    const clickImg = (item: PromptItem) => {
        console.log(item);
        if (item.promptType == "1") {
            console.log("detail");
            emits("detail", item);
        }
    };
    defineExpose({
        clear,
        reset
    });
</script>
<style lang="scss" scoped>
    .demo-warter {
        border-radius: 8px;
        margin: 10px 5px;
        background-color: #ffffff;
        // padding: 8px;
        position: relative;
    }
    .imgBox {
        border-radius: 27rpx 27rpx 0rpx 0rpx;
        overflow: hidden;
        position: relative;
        .resImg {
            // border-radius: 0rpx 0rpx 27rpx 27rpx;
        }
        .ftitle {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 1);
            height: 76rpx;
            line-height: 76rpx;
            border-radius: 0rpx 0rpx 27rpx 27rpx;
            color: #ffffff;
            padding: 0 20rpx;
            opacity: 0.5;
        }
        .fcheckBox {
            position: absolute;
            right: 20rpx;
            top: 20rpx;
            text-align: center;
            height: 36rpx;
            line-height: 36rpx;
            background: #0271fd;
            border-radius: 18rpx;
            opacity: 0.3;
            font-size: 18rpx;
            padding: 0 20rpx;
            color: #ffffff;
        }
    }
    .infoBox {
        .titleBox {
            padding: 20rpx 10rpx 20rpx 10rpx;
            flex-wrap: nowrap;
            .title {
                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                font-weight: 400;
                font-size: 25rpx;
                color: #070707;
                line-height: 29rpx;
                text-align: left;
                font-style: normal;
                text-overflow: ellipsis;
            }
            .rt {
                min-width: fit-content;
            }
            .num {
                height: 22rpx;
                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                font-weight: 400;
                font-size: 22rpx;
                color: #070707;
                line-height: 28rpx;
                text-align: left;
                font-style: normal;
            }
        }
    }
</style>
