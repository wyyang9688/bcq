<!--  -->
<template>
    <div class="courseDetailPage page">
        <tabs
            :hiddenSearch="true"
            @onChange="tabChange"
            ref="tabsRef"
            :tab="tab"
        />
        <div class="videoBox white">
            <video
                v-if="isReadVideo"
                class="video pg"
                :src="src"
                :initial-time="initialTime"
                :poster="getConfig().imgBasicUrl + pickCourseItem?.imageItemUrl"
                autoplay="true"
                loop="false"
                muted="false"
                direction="0"
                @play="play"
                @pause="pause"
                @ended="ended"
                @timeupdate="timeupdate"
                @waiting="waiting"
                @error="error"
                enable-danmu
                danmu-btn
                controls
            />
        </div>
        <div class="infoBox white">
            <div class="top flex">
                <div class="title flex">
                    <div class="t1 bglb">限时免费</div>
                    <div class="t2">|</div>
                    <div class="t3">{{ detailItme?.courseName }}</div>
                    <div class="t4">
                        🔥热度:{{ detailItme?.courseHeat || 0 }}k
                    </div>
                </div>
                <div class="btn" @click="downloadCitem">课件下载</div>
            </div>
            <div class="info">
                {{ detailItme?.items?.length }}课时｜{{
                    detailItme?.courseRemark ||
                    `适合初学者的图片生成教程，看完整个课程让你有一个质的提升！`
                }}
            </div>
            <div class="tools">
                <div class="title">
                    选集
                    <text style="font-size: 20rpx"
                        >(共{{ detailItme?.items?.length }})</text
                    >
                </div>
                <div class="tool">
                    <scroll-view
                        class="scroll-view_H"
                        scroll-x="true"
                        :scroll-left="0 * 45"
                    >
                        <div class="list flex">
                            <div
                                class="item pos"
                                v-for="(item, index) of clist"
                                :key="index"
                                @click="changeCourseNum(item)"
                            >
                                <div class="vip">vip</div>
                                <div
                                    class="num center"
                                    :class="
                                        pickCourseItem?.courseItemNum ==
                                        item.courseItemNum
                                            ? 'act'
                                            : ''
                                    "
                                >
                                    {{ item.courseItemNum }}
                                </div>
                            </div>
                        </div>
                    </scroll-view>
                </div>
            </div>
        </div>
        <div class="like" v-show="glist && glist.length">
            <div class="topTitle bold">猜你喜欢</div>
            <div class="listBox">
                <div class="list">
                    <div
                        class="item"
                        v-for="(item, index) of glist"
                        :key="index"
                        @click="refreshDetail(item)"
                    >
                        <div class="imgBox">
                            <image
                                class="pg resImg"
                                :src="getConfig().imgBasicUrl + item.imageUrl"
                                mode="scaleToFill"
                                lazy-load="false"
                            >
                            </image>
                        </div>
                        <div class="title flex hidden">
                            <div class="t1 bgly bold">限时免费</div>
                            <div class="t2">|</div>
                            <div class="t3 bold hidden">
                                {{ item.courseName }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import tabs from "@/components/tabs.vue";
    import { onLoad, onUnload } from "@dcloudio/uni-app";
    import { onReachBottom, onShow } from "@dcloudio/uni-app";
    import { toast } from "@/common/toast";
    import {
        courseService,
        type CItem,
        type CourseItem
    } from "@/pages/course/course-service";
    import { useUserStore } from "@/store/user-store";
    import { useRouter } from "@/common/route";
    import {
        publishService,
        type PromptSendParams
    } from "@/pages/publish/service";
    import { getConfig } from "@/data/config";
    const userStore = useUserStore();
    const service = courseService().service;
    const pservice = publishService().service;
    const tab = ref([
        // {
        //     name: "限免"
        // },
        // {
        //     name: "MJ",
        //     disabled: true
        // },
        // {
        //     name: "SD"
        // },
        // {
        //     name: "KIMI"
        // },
        // {
        //     name: "ChatGPT"
        // }
    ]);
    const src = computed(() => pickCourseItem.value?.courseItemUrl);
    // "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4"
    const play = () => {
        console.log("play");
    };
    const pause = () => {
        console.log("pause");
        uni.$u.debounce(recordWatchTime, 100);
    };
    const ended = () => {
        console.log("ended");
    };
    const timeDetail = ref({
        currentTime: 0,
        duration: 100
    });
    const timeupdate = (e: any) => {
        timeDetail.value = e.detail;
    };

    const waiting = () => {
        console.log("waiting");
    };
    const error = () => {
        console.log("error");
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
                }
            }
        } catch (error) {}
    };
    getOptions({ type: "courseType" });
    const itemId = ref("");
    const detailItme = ref<CourseItem>();
    const clist = ref<CItem[]>();
    const glist = ref<CourseItem[]>([]);
    const iDisplayLength = ref(10);
    const hasMore = ref(true);
    const total = ref(0);
    const getGuessList = async (type: string = "init") => {
        let params = {
            iDisplayStart: glist?.value?.length,
            iDisplayLength: iDisplayLength.value,
            hasCount: true,
            // tuckuid: userStore.userInfo.uid,
            course: {
                guessFlag: 1
            }
        };
        if (!hasMore.value && type != "init") {
            console.log("noMore");
            return;
        }
        const res = await service.getCourseList(params, params);
        console.log(res);
        if (res.code == 0) {
            let data = res.data.filter((v) => v.id != itemId.value) || [];
            if (type == "init") {
                total.value = res.size;
                glist.value = data;
            } else {
                glist.value = glist.value.concat(data);
                total.value = res.size;
            }

            if (res.size <= glist.value.length) {
                hasMore.value = false;
            } else {
                hasMore.value = true;
            }
        }
    };
    const getDetail = async (id: string) => {
        let params = {
            iDisplayStart: 0,
            iDisplayLength: 10,
            hasCount: true,
            // tuckuid: userStore.userInfo.uid,
            course: {
                id: id
            }
        };
        const res = await service.getCourseList(params, params);
        console.log(res);
        uni.hideLoading();
        if (res.code == 0 && res.data.length) {
            detailItme.value = res.data[0];
            setTimeout(() => {
                tabsRef.value.setTab({
                    id: detailItme.value?.courseType
                });
            }, 500);
            clist.value = detailItme.value.items.sort(
                (a, b) => a.courseItemNum - b.courseItemNum
            );
            if (clist.value.length) {
                let index = 0;
                if (defaultPickItemNum.value) {
                    clist.value.map((v, i) => {
                        if (v.courseItemNum == defaultPickItemNum.value) {
                            index = i;
                        }
                    });
                    pickCourseItem.value = clist.value[index];
                }

                try {
                    const resp = await getWatchTime(
                        defaultPickItemNum.value
                            ? clist.value[index]
                            : undefined
                    );
                } catch (error) {
                } finally {
                    isReadVideo.value = true;
                }

                console.log("cnum->", clist.value[index].courseItemNum);
            }
        }
    };
    const pickCourseItem = ref<CItem>();
    const initialTime = ref(0);
    const isReadVideo = ref(false);
    const changeCourseNum = async (item: CItem) => {
        isReadVideo.value = false;
        recordWatchTime(pickCourseItem.value);
        console.log(item);
        pickCourseItem.value = item;
        const res = await getWatchTime(pickCourseItem.value);
        isReadVideo.value = true;
        recordWatchTime(pickCourseItem.value);
    };
    const recordWatchTime = (
        item: CItem | undefined = pickCourseItem.value
    ) => {
        let params = {
            courseItemId: item?.id,
            viewDuration: timeDetail.value.currentTime,
            courseId: detailItme?.value?.id
        };
        const res = service.recordWatchTime(params);
    };
    const getWatchTime = async (item?: CItem) => {
        let params = {
            courseItemId: item?.id,
            courseId: detailItme?.value?.id
        };
        if (!params.courseItemId) {
            delete params.courseItemId;
        }
        const res = await service.getRecordWatchTime(params);
        initialTime.value = res?.data?.viewDuration || 0;
        if (!params.courseItemId && !res?.data && clist.value?.length) {
            pickCourseItem.value = clist.value[0];
        } else if (params.courseItemId && !res?.data && clist.value?.length) {
        } else {
            if (
                clist.value?.filter(
                    (v) =>
                        v.courseItemNum == res.data.courseLst[0].courseItemNum
                ).length
            ) {
                pickCourseItem.value = clist.value?.filter(
                    (v) =>
                        v.courseItemNum == res.data.courseLst[0].courseItemNum
                )[0];
            } else {
                console.warn("和记录信息不匹配");
                if (clist.value?.length) pickCourseItem.value = clist.value[0];
            }
        }

        return res;
    };
    const pickTabItem = ref();
    const tabChange = (item: any) => {
        console.log(item);
        pickTabItem.value = item;
        uni.setStorageSync("changeCourseTab", item);
        useRouter().tab({
            url: "/pages/course/course-index"
        });
    };
    const downloadCitem = () => {
        console.log("download");
        console.log(pickCourseItem.value);
        const downloadTask = uni.downloadFile({
            url: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4", //仅为示例，并非真实的资源
            success: (res) => {
                console.log(res);
                if (res.statusCode === 200) {
                    console.log("下载成功");
                    uni.saveVideoToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            console.log(res.errMsg);
                        },
                        fail: (fail) => {
                            toast(fail);
                        }
                    });
                    // uni.saveFile({
                    //     tempFilePath: res.tempFilePath,
                    //     success: function (res) {
                    //         var savedFilePath = res.savedFilePath;
                    //         console.log(res);
                    //         wx.openDocument({
                    //             filePath: savedFilePath,
                    //             // fileType: "mp4", //docx、zip、xlsx等
                    //             showMenu: true,
                    //             success: function (res) {
                    //                 console.log("打开文档成功");
                    //             },
                    //             fail: (err) => {
                    //                 console.log(err);
                    //             }
                    //         });
                    //     }
                    // });

                    // uni.shareFileMessage({
                    //     filePath: res.tempFilePath,
                    //     success(data) {
                    //         console.log("转发成功！！！", data);
                    //     },
                    //     // fileName: "自定义文件名字.xlsx",
                    //     fail(err) {
                    //         console.log(err);
                    //     }
                    // });
                }
            },
            fail: (err) => {
                console.log(err);
            }
        });

        downloadTask.onProgressUpdate((res) => {
            console.log("下载进度" + res.progress);
            console.log("已经下载的数据长度" + res.totalBytesWritten);
            console.log(
                "预期需要下载的数据总长度" + res.totalBytesExpectedToWrite
            );

            // 满足测试条件，取消下载任务。
            if (res.progress > 50) {
                // downloadTask.abort();
            }
        });
    };
    const tabsRef = ref();
    onUnload(() => {
        recordWatchTime();
    });
    const refreshDetail = (item: CourseItem) => {
        defaultPickItemNum.value = 0;
        itemId.value = item.id;
        isReadVideo.value = false;

        getDetail(itemId.value);
        getGuessList("init");
    };
    onReachBottom(() => {
        getGuessList("more");
    });
    const defaultPickItemNum = ref(0);
    onLoad((query: any) => {
        console.log(query);
        if (query.courseItemNum) {
            defaultPickItemNum.value = query.courseItemNum;
        }
        if (query.id) {
            itemId.value = query.id;
            getDetail(itemId.value);
        }
        getGuessList("init");
        if (query.tabIndex) {
            nextTick(() => {
                console.log("nextTick");
                setTimeout(() => {
                    tabsRef.value.setTab({
                        index: query.tabIndex
                    });
                }, 1200);
            });
        }
        if (query.tabId) {
            nextTick(() => {
                console.log("nextTick");
                setTimeout(() => {
                    tabsRef.value.setTab({
                        id: query.tabId
                    });
                }, 1200);
            });
        }
    });
    onMounted(() => {
        //
    });
</script>
<style lang="scss" scoped>
    .page {
        .videoBox {
            .video {
                width: 100%;
                height: 424rpx;
            }
        }
        .infoBox {
            padding: 0 25rpx;
            padding-bottom: 25rpx;
            .top {
                padding-top: 19rpx;
                .btn {
                    width: 116rpx;
                    height: 40rpx;
                    text-align: center;
                    line-height: 40rpx;
                    background: #74b1fe;
                    border-radius: 20rpx;
                    font-family: AlibabaPuHuiTiR;
                    font-size: 22rpx;
                    color: #ffffff;
                    font-style: normal;
                    margin-left: 70rpx;
                }
                .title {
                    height: 38rpx;
                    font-family: AlibabaPuHuiTiM;
                    font-size: 38rpx;
                    color: #333333;
                    line-height: 38rpx;
                    text-align: left;
                    font-style: normal;
                    font-weight: bold;
                    .t2 {
                        margin: 0 10rpx;
                        overflow: hidden;
                    }
                    .t4 {
                        height: 25rpx;
                        font-family: AppleColorEmoji;
                        font-size: 18rpx;
                        color: #333333;
                        line-height: 25rpx;
                        text-align: left;
                        font-style: normal;
                        line-height: 45rpx;
                        font-weight: normal;
                        margin-left: 20rpx;
                    }
                }
            }
            .info {
                font-family: AlibabaPuHuiTiR;
                font-size: 29rpx;
                color: #333333;
                line-height: 36rpx;
                text-align: left;
                font-style: normal;
                margin: 20rpx 0;
            }
            .tools {
                .title {
                    height: 29rpx;
                    font-family: AlibabaPuHuiTiM;
                    font-size: 29rpx;
                    color: #333333;
                    line-height: 29rpx;
                    text-align: left;
                    font-style: normal;
                    font-weight: bold;
                    text {
                        font-weight: normal;
                    }
                }
                .tool {
                    margin-top: 20rpx;
                    .list {
                        width: fit-content;
                        flex-wrap: nowrap;
                        .item {
                            width: 91rpx;
                            height: 91rpx;
                            line-height: 91rpx;
                            background: #f0f7ff;
                            border-radius: 11rpx;
                            color: #333333;
                            font-weight: bold;
                            margin-right: 20rpx;
                        }
                        .vip {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 42rpx;
                            height: 24rpx;
                            text-align: center;
                            background: linear-gradient(
                                131deg,
                                #ffdea6 0%,
                                #ffc84f 100%
                            );
                            border-radius: 0rpx 11rpx 0rpx 11rpx;
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 18rpx;
                            color: #604a00;
                            line-height: 24rpx;
                            font-style: normal;
                        }
                        .act {
                            color: #0a76fc;
                        }
                    }
                }
            }
        }
        .like {
            padding: 0 27rpx;
            .topTitle {
                height: 40rpx;
                font-family: AlibabaPuHuiTiM;
                font-size: 29rpx;
                color: #000000;
                line-height: 40rpx;
                text-align: left;
                font-style: normal;
                margin: 20rpx 0;
            }
            .listBox {
                .list {
                    justify-content: space-between;
                    display: flex;
                    flex-wrap: wrap;
                    .item {
                        width: 335rpx;
                        overflow: hidden;
                        // margin-bottom: 27rpx;
                        .imgBox {
                            width: 335rpx;
                            height: 196rpx;
                            border-radius: 14rpx;
                            overflow: hidden;
                        }
                        .title {
                            height: 25rpx;
                            font-family: AlibabaPuHuiTiR;
                            font-size: 25rpx;
                            color: #000000;
                            line-height: 25rpx;
                            text-align: left;
                            font-style: normal;
                            white-space: nowrap;
                            flex-wrap: nowrap;
                            margin: 20rpx 0;
                            .t2 {
                                margin: 0 10rpx;
                                overflow: hidden;
                            }
                            .t4 {
                                height: 25rpx;
                                font-family: AppleColorEmoji;
                                font-size: 18rpx;
                                color: #333333;
                                line-height: 25rpx;
                                text-align: left;
                                font-style: normal;
                                line-height: 45rpx;
                                font-weight: normal;
                                margin-left: 20rpx;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
