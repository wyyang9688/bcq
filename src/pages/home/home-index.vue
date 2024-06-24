<template>
    <view class="homePage tabbarPage">
       
        <div class="topTitle">AI提示词助手</div>
        <div class="swiperBox">
            <up-swiper
                class="swiper"
                :list="swiperList"
                indicator
                indicatorMode="dot"
                circular
            ></up-swiper>
        </div>
        <div class="tjkc sec">
            <div class="mtitle">
                <div class="title">推荐课程</div>
                <div
                    class="rt"
                    @click="goToCourseDetail(lastCourse.course)"
                    v-if="lastCourse?.course"
                >
                    <div class="lastCourse">
                        上次观看到 '{{ lastCourse.course.courseName }}' 第
                        {{ lastCourse.courseLst[0]?.courseItemNum }}课
                    </div>
                    <up-icon
                        size="25rpx"
                        color="#82b9fe"
                        name="arrow-right"
                    ></up-icon>
                </div>
                <div class="rt" v-else>
                    查看全部
                    <up-icon
                        size="25rpx"
                        color="#acb0b7"
                        name="arrow-right"
                    ></up-icon>
                </div>
            </div>
            <div class="sBox">
                <up-scroll-list :indicator="false">
                    <view
                        class="item"
                        v-for="(item, index) in courseList"
                        :key="index"
                    >
                        <div class="imgBox">
                            <image
                                class="resImg"
                                :src="getConfig().imgBasicUrl + item.imageUrl"
                            ></image>
                        </div>
                        <div class="titleBox">
                            <div class="title" :class="item.class || 'bgly'">
                                {{ item.stitle }}
                            </div>
                            <div class="dv">|</div>
                            <div class="info">{{ item.courseName }}</div>
                        </div>
                    </view>
                </up-scroll-list>
            </div>
        </div>
        <div class="rmhd sec">
            <div class="mtitle">
                <div class="title">热门活动</div>
                <div class="rt">
                    查看全部
                    <up-icon
                        size="25rpx"
                        color="#acb0b7"
                        name="arrow-right"
                    ></up-icon>
                </div>
            </div>
            <div class="sBox">
                <up-scroll-list :indicator="false">
                    <view
                        class="item"
                        v-for="(item, index) in slist"
                        :key="index"
                    >
                        <div class="imgBox">
                            <image
                                class="resImg"
                                mode="heightFix"
                                :src="item.thumb"
                            ></image>
                        </div>
                    </view>
                </up-scroll-list>
            </div>
        </div>
        <div class="rmhd sec">
            <div class="mtitle">
                <div class="title">热门提示词</div>
                <div class="rt">
                    查看全部
                    <up-icon
                        size="25rpx"
                        color="#acb0b7"
                        name="arrow-right"
                    ></up-icon>
                </div>
            </div>
            <div class="lBox">
                <div class="list">
                    <div
                        class="item"
                        v-for="(item, index) of promptList"
                        :key="index"
                    >
                        <div class="item" v-if="item.promptType == '1'">
                            <image
                                :src="getConfig().imgBasicUrl + item.imageId"
                                class="resImg"
                                mode="scaleToFill"
                            ></image>
                            <div class="lay">
                                <div class="title">{{ item.promptTitle }}</div>
                                <div class="stitle hidden2">
                                    {{ item.promptLabel }}
                                </div>
                            </div>
                        </div>
                        <div class="item" v-else>
                            <div class="textBox">
                                <div class="title">{{ item.promptTitle }}</div>
                                <div class="stitle">
                                    {{ item.promptWord }}
                                </div>
                                <div class="info">
                                    {{ item.promptLabel }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="item">
                        <image
                            :src="imgSrc"
                            class="resImg"
                            mode="scaleToFill"
                        ></image>
                        <div class="lay">
                            <div class="title">MJk卡通人物</div>
                            <div class="stitle hidden2">
                                杰作，品质最佳，一位长发少女，屹立在书房，阳光傻到肩膀上
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="textBox">
                            <div class="title">小红书风格</div>
                            <div class="stitle">
                                将文本改写成类似小红书的 Emoji 风格。
                            </div>
                            <div class="info">
                                Please edit the following passage using the
                                Emoji style, which is
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <tabbar />
    </view>
</template>

<script setup lang="ts">
    import tabbar from "@/components/tabbar.vue";
    import type BaseData from "@/http/http";
    import { onLoad, onUnload } from "@dcloudio/uni-app";
    import { onReachBottom, onShow } from "@dcloudio/uni-app";
    import { toast } from "@/common/toast";
    import {
        courseService,
        type CItem,
        type CourseItem
    } from "@/pages/course/course-service";
    import {
        communityService,
        type PromptItem
    } from "@/pages/community/service";
    import { useUserStore } from "@/store/user-store";
    import { useRouter } from "@/common/route";
    import { getConfig } from "@/data/config";
    const userStore = useUserStore();
    const cservice = courseService().service;
    const cmService = communityService().service;
    interface Config {
        BASE_URL: string;
    }
    import { http, ajax } from "@/http/http";
    const swiperList = ref([
        "https://cdn.uviewui.com/uview/swiper/swiper3.png",
        "https://cdn.uviewui.com/uview/swiper/swiper2.png",
        "https://cdn.uviewui.com/uview/swiper/swiper1.png"
    ]);
    const imgSrc = ref("https://cdn.uviewui.com/uview/goods/1.jpg");
    const slist = ref([
        {
            thumb: "https://cdn.uviewui.com/uview/goods/1.jpg",
            title: "限时免费",
            info: "SD基础使用教程"
        },
        {
            thumb: "https://cdn.uviewui.com/uview/goods/2.jpg",
            title: "限时免费",
            info: "SD基础使用教程"
        },
        {
            thumb: "https://cdn.uviewui.com/uview/goods/3.jpg",
            title: "MIDJOURME",
            info: "SD基础使用教程",
            class: "bglb"
        }
    ]);
    // #ifdef  MP-ALIPAY
    console.log("MP-WEIXIN");
    // #endif
    console.log(http);
    const lastCourse = ref<{ course: CourseItem; courseLst: CItem[] }>();
    const getLastCourse = async () => {
        const res = await cservice.getRecordWatchTime({});
        if (res.data) {
            lastCourse.value = res.data;
        }
    };
    const goToCourseDetail = (item: CourseItem) => {
        const { push, replace, back } = useRouter();
        push({
            url:
                "/pages/course/course-detail?id=" +
                item.id +
                "&tabId=" +
                item.courseType
        });
    };
    const iDisplayLength = ref(10);
    const courseList = ref<(CourseItem & { class: string; stitle: string })[]>(
        []
    );
    const getCourseList = async () => {
        try {
            const res = await cservice.getCourseList({
                iDisplayStart: 0,
                iDisplayLength: iDisplayLength.value,
                hasCount: true,
                course: {
                    hotFlag: 1
                }
            });
            if (res.code == 0) {
                courseList.value = res.data.map((v) => {
                    return {
                        ...v,
                        class: "bglb",
                        stitle: "限时免费"
                    };
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const promptList = ref<PromptItem[]>([]);
    const getPromptList = async () => {
        try {
            let params = {
                iDisplayStart: 0,
                iDisplayLength: iDisplayLength.value,
                hasCount: true,
                tuckuid: userStore.userInfo.uid,
                auditingSta: 1
            };
            const res = await cmService.getPromptList(params);
            if (res.code == 0) {
                promptList.value = res.data;
            }
        } catch (error) {}
    };
    onShow(() => {
        getLastCourse();
        getCourseList();
        getPromptList();
    });
    const config: Config | undefined = inject("$config");
    console.log(config!.BASE_URL);
</script>

<style lang="scss">
    .homePage {
        .dv {
            margin: 0 10rpx;
        }
        background-color: #f6f6f6;
        padding-left: 27rpx;
        padding-right: 27rpx;
        min-height: 100vh;
        .topTitle {
            height: 49rpx;
            font-family: AlibabaPuHuiTiM;
            font-size: 36rpx;
            color: #333333;
            line-height: 49rpx;
            text-align: left;
            font-weight: bold;
        }
        .swiperBox {
            margin-top: 36rpx;
        }
        .sec {
            margin-top: 20rpx;
        }
        .tjkc {
            margin-top: 36rpx;
            .lastCourse {
                font-family: SourceHanSansSC, SourceHanSansSC;
                font-weight: 400;
                font-size: 25rpx;
                color: #82b9fe;
                text-align: left;
                font-style: normal;
                text-decoration-line: underline;
            }
            .sBox {
                margin-top: 18rpx;
                .item {
                    width: 266rpx;
                    height: 200rpx;

                    margin-right: 20rpx;
                    .imgBox {
                        border-radius: 14rpx;
                        overflow: hidden;
                        height: 155rpx;
                        background: #d8d8d8;
                    }
                    .titleBox {
                        display: flex;
                        margin-top: 16rpx;
                        width: 266rpx;
                        height: 25rpx;
                        font-family: AlibabaPuHuiTiR;
                        font-size: 25rpx;
                        color: #000000;
                        line-height: 25rpx;
                        text-align: left;
                        font-style: normal;
                        white-space: nowrap;
                        .title {
                            font-weight: bold;
                        }
                        .info {
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
        .rmhd {
            .sBox {
                margin-top: 18rpx;
                .item {
                    height: 130rpx;

                    margin-right: 20rpx;
                    .imgBox {
                        border-radius: 14rpx;
                        overflow: hidden;
                        height: 130rpx;
                        background: #d8d8d8;
                    }
                    .titleBox {
                        display: flex;
                        margin-top: 16rpx;
                        width: 266rpx;
                        height: 25rpx;
                        font-family: AlibabaPuHuiTiR;
                        font-size: 25rpx;
                        color: #000000;
                        line-height: 25rpx;
                        text-align: left;
                        font-style: normal;
                        white-space: nowrap;
                        .title {
                            font-weight: bold;
                        }
                        .info {
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
            .lBox {
                margin-top: 18rpx;
                .list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    .item {
                        width: 335rpx;
                        height: 340rpx;
                        border-radius: 18rpx;
                        overflow: hidden;
                        position: relative;
                        margin-bottom: 25rpx;
                        background-color: #fff;
                        .textBox {
                            padding: 25rpx;
                            .title {
                                height: 40rpx;
                                font-family: AlibabaPuHuiTiM;
                                font-size: 29rpx;
                                color: #82b9fe;
                                line-height: 40rpx;
                                text-align: left;
                                font-style: normal;
                                font-weight: bold;
                            }
                            .stitle {
                                margin-top: 14rpx;
                                margin-bottom: 32rpx;
                                height: 58rpx;
                                font-family: AppleColorEmoji;
                                font-size: 25rpx;
                                color: #333333;
                                line-height: 29rpx;
                                text-align: left;
                                font-style: normal;
                                font-weight: bold;
                            }
                            .info {
                                height: 118rpx;
                                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                                font-weight: 400;
                                font-size: 22rpx;
                                color: #333333;
                                line-height: 31rpx;
                                text-align: left;
                                font-style: normal;
                            }
                        }
                        .lay {
                            position: absolute;

                            left: 0;
                            bottom: 0;
                            width: 100%;
                            padding: 20rpx;
                            color: #fff;
                            background-color: rgba(0, 0, 0, 0.5);
                            .title {
                                height: 25rpx;
                                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                                font-weight: 400;
                                font-size: 29rpx;
                                color: #ffffff;
                                line-height: 25rpx;
                                text-align: left;
                                font-style: normal;
                            }
                            .stitle {
                                margin-top: 10rpx;
                                font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                                font-weight: 400;
                                font-size: 22rpx;
                                color: #ffffff;
                                line-height: 31rpx;
                                text-align: left;
                                font-style: normal;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
