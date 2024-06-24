<!-- 发布页面 -->
<template>
    <div class="coursePage page tabbarPage">
        <tabs
            :hiddenSearch="true"
            :tab="tab"
            ref="tabsRef"
            @onChange="tabChange"
        />
        <div class="listBox">
            <div class="list">
                <div
                    class="item white"
                    v-for="(item, index) of list"
                    :key="index"
                >
                    <div class="title flex">
                        <div class="t1 bglb">限时免费</div>
                        <div class="t2">|</div>
                        <div class="t3">{{ item.courseName }}</div>
                        <div class="t4">🔥热度:{{ item.courseHeat || 0 }}k</div>
                    </div>
                    <div class="info">
                        {{ item.items?.length }}课时｜{{
                            item.courseRemark ||
                            `适合初学者的图片生成教程，看完整个课程让你有一个质的提升！`
                        }}
                    </div>
                    <div class="show flex" @click="goToDetail(item)">
                        <div class="imgBox">
                            <image
                                class="resImg"
                                :src="getConfig().imgBasicUrl + item.imageUrl"
                                mode="scaleToFill"
                                lazy-load="false"
                            >
                            </image>
                        </div>
                        <div class="btnBox flex">
                            <div class="icon">
                                <up-icon
                                    name="play-circle"
                                    color="#fff"
                                    size="20"
                                ></up-icon>
                            </div>
                            <div class="text">开始学习</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tabbar />
    </div>
</template>

<script setup lang="ts">
    import tabs from "@/components/tabs.vue";
    import tabbar from "@/components/tabbar.vue";
    import { useRouter } from "@/common/route";
    import { onReachBottom, onShow } from "@dcloudio/uni-app";
    import { useUserStore } from "@/store/user-store";
    import { toast } from "@/common/toast";

    import {
        courseService,
        type CourseItem
    } from "@/pages/course/course-service";
    import {
        publishService,
        type PromptSendParams
    } from "@/pages/publish/service";

    import { getConfig } from "@/data/config";
    const service = courseService().service;
    const userStore = useUserStore();
    const pservice = publishService().service;
    const { push, replace, back } = useRouter();
    const goToDetail = (item: CourseItem) => {
        push({
            url:
                "/pages/course/course-detail?id=" +
                item.id +
                "&tabIndex=" +
                pickTabItem.value.index
        });
    };
    const tab = ref([
        // {
        //     name: "限免"
        // },
        // {
        //     name: "MJ"
        // }
    ]);
    const list = ref<CourseItem[]>([]);
    const iDisplayLength = ref(10);
    const hasMore = ref(true);
    const total = ref(0);
    const getList = async (type: string) => {
        console.log(type);

        try {
            if (!hasMore.value && type != "init") {
                console.log("noMore");
                return;
            }
            const res = await service.getCourseList({
                iDisplayStart: type == "init" ? 0 : list.value.length,
                iDisplayLength: iDisplayLength.value,
                hasCount: true,
                // tuckuid: userStore.userInfo.uid,
                course: {
                    courseType: pickTabItem.value?.id
                }
            });
            uni.hideLoading();
            if (res.code == 0) {
                res.data = res.data.map((v) => {
                    return {
                        ...v
                    };
                });
                if (type == "init") {
                    total.value = res.size;
                    list.value = res.data || [];
                } else {
                    list.value = list.value.concat(res.data);
                    total.value = res.size;
                }

                if (res.size <= list.value.length) {
                    hasMore.value = false;
                } else {
                    hasMore.value = true;
                }
            }
        } catch (error) {
            console.log(error);
            uni.hideLoading();
        }
    };

    const getOptions = async (params: {
        type: "modelName" | "modelType" | "modelLable" | "courseType";
        promptType?: string | number;
    }) => {
        try {
            const res = await pservice.getOptions(params);
            console.log(res);
            if (res.code == 0) {
                tab.value = res.data.map((v: AnyObject) => {
                    return {
                        ...v,
                        name: v.configTitle,
                        val: v.id
                    };
                });
                if (tab.value.length) {
                    pickTabItem.value = tab.value[0];
                    getList("init");
                }
            }
        } catch (error) {}
    };
    getOptions({ type: "courseType" });
    const pickTabItem = ref();
    const tabsRef = ref();
    const tabChange = (item: any) => {
        console.log("tabChange");
        console.log(item);
        if (item.id == pickTabItem.value?.id && list.value.length) {
            return;
        }
        pickTabItem.value = item;
        getList("init");
    };
    onShow((options) => {
        console.log("changeCourseTab onShow");
        let changeTab = uni.getStorageSync("changeCourseTab");
        if (changeTab) {
            if (changeTab.val != pickTabItem.value.val) {
                pickTabItem.value = changeTab;
                setTimeout(() => {
                    tabsRef.value?.setTab({ val: changeTab.val });
                }, 500);
                getList("init");
            }
            uni.removeStorageSync("changeCourseTab");
        }
        console.log(changeTab);
    });
    onReachBottom(() => {
        getList("more");
    });
    onMounted(() => {});
</script>
<style lang="scss" scoped>
    .page {
        .listBox {
            .list {
                padding: 25rpx;
                .item {
                    border-radius: 27rpx;
                    padding: 30rpx;
                    margin-bottom: 28rpx;
                    .title {
                        height: 38rpx;
                        font-family: AlibabaPuHuiTiM;
                        font-size: 38rpx;
                        color: #333333;
                        line-height: 38rpx;
                        text-align: left;
                        font-style: normal;
                        font-weight: bold;
                        .t1 {
                            font-family: AlibabaPuHuiTiM;
                        }
                        .t2 {
                            margin: 0 10rpx;
                            overflow: hidden;
                        }
                        .t4 {
                            height: 25rpx;
                            font-family: AppleColorEmoji;
                            font-size: 18rpx;
                            color: #333333;
                            text-align: left;
                            font-style: normal;
                            line-height: 45rpx;
                            font-weight: normal;
                            margin-left: 20rpx;
                        }
                    }
                    .info {
                        height: 72rpx;
                        font-family: AlibabaPuHuiTiR;
                        font-size: 29rpx;
                        color: #333333;
                        line-height: 36rpx;
                        text-align: left;
                        font-style: normal;
                        margin: 20rpx 0;
                    }
                    .show {
                        .imgBox {
                            width: 318rpx;
                            height: 180rpx;
                            border-radius: 27rpx;
                            overflow: hidden;
                            // background-color: gray;
                        }
                        .btnBox {
                            margin-left: 123rpx;
                            margin-top: 123rpx;
                            width: 194rpx;
                            height: 58rpx;
                            background: #0a76fd;
                            border-radius: 29rpx;
                            color: #fff;
                            line-height: 58rpx;
                            padding: 0 10rpx;
                            .icon {
                                padding-top: 10rpx;
                            }
                            .text {
                                font-size: 29rpx;
                                margin-left: 10rpx;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
