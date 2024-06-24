<template>
    <div class="communityPage tabbarPage page bg1">
        <tabs
            @onChange="tabChange"
            @onSearch="onSearch"
            ref="tabsRef"
            :tab="tab"
        />
        <div class="content">
            <!-- <div class="tagsBox">
                <div class="wtags" style="">
                    <div
                        class="wtag"
                        style="margin-right: 18rpx; margin-bottom: 10rpx"
                        v-for="(item, index) of tags"
                        :key="index"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <div class="rt">
                    <div class="iconBox">
                        <up-icon
                            name="list-dot"
                            color="#999999"
                            size="28"
                        ></up-icon>
                    </div>
                </div>
            </div> -->
            <div class="tagBox" v-show="pickTabItem.val == '0'">
                <tag
                    ref="tagRef"
                    @showTypeChange="showTypeChange"
                    @tagChange="tagChange"
                    :tags="tags"
                    :msg="{
                        pickTabItem: { ...pickTabItem, val: 0 }
                    }"
                />
            </div>
            <div class="tagBox" v-show="pickTabItem.val == '1'">
                <tag
                    ref="tagRef1"
                    @showTypeChange="showTypeChange"
                    @tagChange="tagChange"
                    :tags="tags1"
                    :msg="{
                        pickTabItem: { ...pickTabItem, val: 1 }
                    }"
                />
            </div>

            <div class="listBox">
                <!-- 文生文 -->
                <div class="list" v-show="pickTabItem.val == '0'">
                    <div
                        class="item"
                        v-for="(item, index) of list"
                        :key="index"
                    >
                        <div class="itemText white">
                            <div class="itemTitle flex">
                                <div class="lf grow">
                                    {{ item.promptTitle }}
                                </div>
                                <div class="rt">
                                    <div class="btn center cp" @click="copy">
                                        一键复制
                                    </div>
                                </div>
                            </div>
                            <div class="itemStitle">
                                {{ item.promptLabel }}
                            </div>
                            <div class="itemContent hidden">
                                {{ item.promptWord }}
                            </div>
                            <div class="dv"></div>
                            <div class="tools">
                                <div class="lf flex">
                                    <div class="imgBox">🔥</div>
                                    <div class="text">
                                        {{ utils.hn(item.heatCount) }}
                                    </div>
                                </div>
                                <div class="rt flex" @click="like(item)">
                                    <div class="imgBox">
                                        <up-icon
                                            :name="
                                                item.isPick
                                                    ? 'heart-fill'
                                                    : 'heart'
                                            "
                                            :color="
                                                item.isPick ? 'red' : '#333'
                                            "
                                            size="16"
                                        ></up-icon>
                                    </div>
                                    <div class="text">{{ item.tuckCount }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 纹身图 -->
                <div class="list" v-show="pickTabItem.val == '1'">
                    <div
                        class="item"
                        v-show="showType == 'img'"
                        v-for="(item, index) of list2"
                        :key="index"
                        @detail="goToDetail"
                    >
                        <div class="itemImg white">
                            <div class="imgBox">
                                <image
                                    class="resImg w100"
                                    :src="
                                        getConfig().imgBasicUrl + item.imageId
                                    "
                                    mode="widthFix"
                                ></image>
                            </div>
                            <div class="infoBox">
                                <div class="top flex">
                                    <div class="headBox flex">
                                        <div class="head">
                                            <image
                                                class="resImg"
                                                :src="
                                                    userStore?.userInfo?.accInfo
                                                        ?.headImg
                                                "
                                                mode="scaleToFill"
                                            ></image>
                                        </div>
                                        <div class="username">
                                            {{
                                                userStore?.userInfo?.accInfo
                                                    ?.name
                                            }}
                                        </div>
                                    </div>
                                    <div class="rt">
                                        <div
                                            class="btn center cp"
                                            @click="copy"
                                        >
                                            一键复制
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin-top: 40rpx">
                                    <div class="label">使用模型</div>
                                    <div class="val">
                                        {{ item.promptModelName }}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="label">参考图</div>
                                    <div class="val">有</div>
                                </div>
                                <div class="row">
                                    <div class="label">描述语</div>
                                    <div class="val">
                                        {{ item.promptWord }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class=""
                        style="margin-top: -20rpx"
                        v-show="showType == 'list'"
                    >
                        <waterfall
                            ref="waterRef"
                            @detail="goToDetail"
                            @like="like"
                            :list="list2"
                        />
                    </div>
                </div>
            </div>
        </div>
        <tabbar />
    </div>
</template>

<script setup lang="ts">
    import tabbar from "@/components/tabbar.vue";
    import tabs from "@/components/tabs.vue";
    import tag from "@/components/tags.vue";
    import type { Tag } from "@/components/tags.vue";
    import { useRouter } from "@/common/route";
    import { communityService } from "./service";
    import { onReachBottom, onShow } from "@dcloudio/uni-app";
    import { useUserStore } from "@/store/user-store";
    import { toast } from "@/common/toast";
    import {
        publishService,
        type PromptSendParams
    } from "@/pages/publish/service";
    import waterfall from "@/components/waterfall.vue";
    import utils from "@/utils/utils";
    import { getConfig } from "@/data/config";
    const pservice = publishService().service;
    const userStore = useUserStore();
    const service = communityService().service;
    const { push, replace, back } = useRouter();
    const imgSrc = ref("https://cdn.uviewui.com/uview/goods/1.jpg");
    const onSearch = (item: { name: string }) => {
        console.log("search");
        console.log(item);
        push({
            url: "/pages/community/search"
        });
    };
    const copy = () => {
        uni.setClipboardData({
            data: "hello",
            showToast: true,
            success: function () {
                console.log("success");
            }
        });
    };
    const tagRef = ref();
    const tagRef1 = ref();
    const tab = reactive([
        // {
        //     name: "全部",
        //     val: ""
        // },
        {
            name: "文生文",
            val: "0"
        },
        {
            name: "文生图",
            val: "1"
        }
    ]);

    const pickTabItem = ref(tab[1]);
    const tabChange = (item: any) => {
        pickTabItem.value = item;
        if (
            (item.val == "1" && list2.value.length == 0) ||
            (item.val == "0" && list.value.length == 0)
        ) {
            getPropmtList("init");
            getOptions({
                type: "modelLable",
                promptType: pickTabItem.value.val
            });
        }
    };
    const tabsRef = ref();

    const tags = ref<any[]>([]);
    const tags1 = ref<any[]>([]);
    const getOptions = async (params: {
        type: "modelName" | "modelType" | "modelLable" | "courseType";
        promptType?: string | number;
    }) => {
        try {
            const res = await pservice.getOptions(params);
            console.log(res);
            if (res.code == 0) {
                if (pickTabItem.value.val == "0") {
                    tags.value = res.data.map((v: AnyObject) => {
                        return {
                            ...v,
                            name: v.configTitle,
                            val: v.id
                        };
                    });
                } else {
                    tags1.value = res.data.map((v: AnyObject) => {
                        return {
                            ...v,
                            name: v.configTitle,
                            val: v.id
                        };
                    });
                }
            }
        } catch (error) {}
    };
    getOptions({ type: "modelLable", promptType: pickTabItem.value.val });
    const showType = ref<"list" | "img">("list");
    const showTypeChange = (type: "list" | "img") => {
        console.log("showTypeChange", type);
        showType.value = type;
    };
    const tagChange = (tags: Tag[]) => {
        console.log(tags);
        getPropmtList("init");
    };
    const list = ref<any[]>([]);
    const list2 = ref<any[]>([
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
    ]);

    const iDisplayLength = ref(10);
    const hasMore = ref(true);
    const hasMore2 = ref(true);
    const total = ref(0);
    const total2 = ref(0);
    const waterRef = ref();
    const getPropmtList = async (type: string) => {
        try {
            if (
                !hasMore.value &&
                pickTabItem.value.val == "0" &&
                type != "init"
            ) {
                console.log("noMore");
                return;
            }
            if (
                !hasMore2.value &&
                pickTabItem.value.val == "1" &&
                type != "init"
            ) {
                console.log("noMore");
                return;
            }
            if (type == "init" && pickTabItem.value.val == "1") {
                list2.value = [];
                waterRef.value.reset();
            }

            const res = await service.getPromptList({
                iDisplayStart:
                    pickTabItem.value.val == "0"
                        ? list.value.length
                        : list2.value.length,
                iDisplayLength: iDisplayLength.value,
                auditingSta: 1,
                promptType: pickTabItem.value.val,
                hasCount: true,
                tuckuid: userStore.userInfo.uid,
                promptLabel:
                    pickTabItem.value.val == "0"
                        ? tags.value
                              .filter((v) => v.isPick)
                              .map((v) => v.name)
                              .join(",") || undefined
                        : tags1.value
                              .filter((v) => v.isPick)
                              .map((v) => v.name)
                              .join(",") || undefined
            });
            uni.hideLoading();
            if (res.code == 0) {
                res.data = res.data.map((v) => {
                    return {
                        ...v,
                        isPick: v.tuckFlag || false
                    };
                });
                if (type == "init") {
                    if (pickTabItem.value.val == "0") {
                        total.value = res.size;
                        list.value = res.data || [];
                    } else {
                        list2.value = res.data || [];
                        total2.value = res.size;
                    }
                } else {
                    if (pickTabItem.value.val == "0") {
                        list.value = list.value.concat(res.data);
                        total.value = res.size;
                    } else {
                        list2.value = list2.value.concat(res.data);
                        total2.value = res.size;
                    }
                }
                if (pickTabItem.value.val == "0") {
                    if (res.size <= list.value.length) {
                        hasMore.value = false;
                    } else {
                        hasMore.value = true;
                    }
                } else {
                    if (res.size <= list2.value.length) {
                        hasMore2.value = false;
                    } else {
                        hasMore2.value = true;
                    }
                }
            }
        } catch (error) {
            uni.hideLoading();
        }
    };
    const like = async (item: any) => {
        if (item.isPick) {
            return;
        }
        const res = await service.likePrompt({
            promptId: item.id,
            uid: userStore.userInfo.uid
        });
        if (res.code == 0) {
            item.isPick = true;
            item.tuckCount = item.tuckCount || 0;
            item.tuckCount++;
        } else {
            toast(res.msg || "");
        }
    };
    const goToDetail = (item: any) => {
        console.log(item);
        push({
            url:
                "/pages/community/community-detail?id=" +
                item.id +
                "&tabIndex=" +
                pickTabItem.value.val
        });
    };
    onReachBottom(() => {
        console.log("more");
        getPropmtList("more");
    });
    onMounted(() => {
        tabsRef.value.setTab({ index: 1 });
        getPropmtList("init");
    });
    onShow((options) => {
        console.log("communityindex onShow");
        let changeCommunityTab = uni.getStorageSync("changeCommunityTab");
        if (changeCommunityTab) {
            if (changeCommunityTab.val != pickTabItem.value.val) {
                pickTabItem.value = changeCommunityTab;
                tabsRef.value?.setTab({ val: changeCommunityTab.val });
                getPropmtList("init");
            }
            uni.removeStorageSync("changeCommunityTab");
        }
        console.log(changeCommunityTab);
    });
</script>
<style lang="scss">
    .communityPage {
        .content {
            padding: 0 20rpx;

            .tagsBox {
                display: flex;
                margin: 28rpx 0 18rpx 0;
                .wtags {
                    flex-grow: 1;
                }
            }
            .listBox {
                .list {
                    .item {
                        border-radius: 27rpx;
                        overflow: hidden;
                        & + .item {
                            margin-top: 16rpx;
                        }
                    }
                    .itemImg {
                        .imgBox {
                        }
                        .infoBox {
                            padding: 0 54rpx;
                            margin-top: 23rpx;
                            .top {
                                justify-content: space-between;
                                .headBox {
                                    .head {
                                        width: 55rpx;
                                        height: 55rpx;
                                        border-radius: 50%;
                                        overflow: hidden;
                                    }
                                    .username {
                                        line-height: 55rpx;
                                        font-size: 29rpx;
                                        color: #333333;
                                        margin-left: 10rpx;
                                    }
                                }
                                .rt {
                                    .btn {
                                        width: 150rpx;
                                        height: 54rpx;
                                        background: #0271fd;
                                        border-radius: 27rpx;
                                        opacity: 0.55;
                                        font-family: AlibabaPuHuiTiM;
                                        font-size: 25rpx;
                                        color: #ffffff;
                                        line-height: 54rpx;
                                        font-style: normal;
                                    }
                                }
                            }
                            .row {
                                margin-top: 20rpx;
                                display: flex;
                                justify-content: space-between;
                                .label {
                                    font-family: AlibabaPuHuiTiM;
                                    font-size: 25rpx;
                                    color: #333333;
                                    text-align: left;
                                    font-style: normal;
                                    min-width: 100rpx;
                                    line-height: 26rpx;
                                    font-weight: bold;
                                    margin-right: 60rpx;
                                }
                                .val {
                                    line-height: 26rpx;
                                    flex-grow: 1;
                                    text-align: left;
                                    font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                                    font-weight: 400;
                                    font-size: 25rpx;
                                    color: #666666;
                                    text-align: left;
                                    font-style: normal;
                                }
                            }
                        }
                    }
                    .itemText {
                        padding: 20rpx;
                        .itemTitle {
                            .lf {
                                height: 53rpx;
                                font-family: AlibabaPuHuiTiM;
                                font-size: 38rpx;
                                color: #82b9fe;
                                line-height: 53rpx;
                                text-align: left;
                                font-style: normal;
                            }
                            .rt {
                                .btn {
                                    width: 150rpx;
                                    height: 54rpx;
                                    background: #0271fd;
                                    border-radius: 27rpx;
                                    opacity: 0.55;
                                    font-family: AlibabaPuHuiTiM;
                                    font-size: 25rpx;
                                    color: #ffffff;
                                    line-height: 54rpx;
                                    font-style: normal;
                                }
                            }
                        }
                        .itemStitle {
                            margin: 15rpx 0;
                            height: 36rpx;
                            font-family: AppleColorEmoji;
                            font-size: 25rpx;
                            color: #333333;
                            line-height: 42rpx;
                            text-align: left;
                            font-style: normal;
                            font-weight: bold;
                        }
                        .itemContent {
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 25rpx;
                            color: #333333;
                            line-height: 36rpx;
                            text-align: left;
                            font-style: normal;
                            max-height: 280rpx;
                        }
                        .dv {
                            margin: 20rpx 0;
                            height: 2rpx;
                            border: 2rpx solid #000000;
                            opacity: 0.05;
                        }
                        .tools {
                            display: flex;
                            justify-content: space-between;
                            .lf,
                            .rt {
                                height: 33rpx;
                                font-family: AlibabaPuHuiTiM;
                                font-size: 29rpx;
                                color: #666666;
                                line-height: 33rpx;
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
