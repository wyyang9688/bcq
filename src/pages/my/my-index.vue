<template>
    <div class="myPage page tabbarPage">
        <div class="userBox white pos">
            <div class="toolBox flex">
                <div class="help">
                    <image
                        class="resImg"
                        :src="'/static/image/help.png'"
                        mode="scaleToFill"
                        lazy-load="false"
                    >
                    </image>
                </div>
                <div class="exit" @click.stop="loginOut">
                    <image
                        class="resImg"
                        :src="'/static/image/exit.png'"
                        mode="scaleToFill"
                        lazy-load="false"
                    >
                    </image>
                </div>
            </div>
            <div class="headerBox">
                <div class="imgBox">
                    <!-- #ifdef MP-WEIXIN -->
                    <button
                        class="clearBtn"
                        open-type="chooseAvatar"
                        @chooseavatar="onChooseAvatar"
                    >
                        <image
                            class="avatar pg resImg"
                            v-if="avatarUrl"
                            :src="avatarUrl"
                        ></image>
                        <image
                            v-else
                            class="pg resImg"
                            :src="userStore?.userInfo?.accInfo?.headImg"
                            mode="scaleToFill"
                            lazy-load="false"
                        >
                        </image>
                    </button>
                    <!-- #endif -->
                    <!-- #ifdef MP-ALIPAY -->
                    <button
                        class="clearBtn"
                        open-type="getAuthorize"
                        scope="userInfo"
                        @getAuthorize="getOpenUserInfo"
                        @error="handleAuthError"
                    >
                        <image
                            class="avatar pg resImg"
                            v-if="avatarUrl"
                            :src="avatarUrl"
                        ></image>
                        <image
                            v-else
                            class="pg resImg"
                            :src="userStore?.userInfo?.accInfo?.headImg"
                            mode="scaleToFill"
                            lazy-load="false"
                        >
                        </image>
                    </button>

                    <!-- #endif -->
                </div>
                <div class="nameBox">
                    <div class="name" @click="openPop">
                        {{ userStore?.userInfo?.accInfo?.name || "用户昵称" }}
                    </div>
                    <div class="vip">
                        <image
                            class="resImg"
                            src="/static/image/vip.png"
                            mode="scaleToFill"
                            lazy-load="false"
                        >
                        </image>
                    </div>
                </div>
            </div>
            <div class="show fr">
                <div class="item">
                    <div class="label">关注</div>
                    <div class="val fm">10000</div>
                </div>
                <div class="item">
                    <div class="label">粉丝</div>
                    <div class="val fm">10000</div>
                </div>
                <div class="item">
                    <div class="label">作品</div>
                    <div class="val fm">10000</div>
                </div>
            </div>
        </div>
        <div class="tabBox white">
            <tabs
                ref="tabsRef"
                @onChange="tabChange"
                :hiddenSearch="true"
                :notTop="true"
                :tab="tab"
            />
        </div>
        <div class="wBox" v-show="pickTabItem.val == '0'">
            <waterfall
                :showModel="1"
                ref="waterRef"
                @like="like"
                :list="list"
            />
        </div>
        <div class="wBox" v-show="pickTabItem.val == '1'">
            <waterfall ref="waterRef2" @like="like" :list="list2" />
        </div>

        <div class="myModal" v-if="nicknamePopVisible">
            <div class="outBox">
                <div class="innerBox">
                    <div class="close">
                        <up-icon
                            name="close"
                            @click="nicknamePopVisible = false"
                            color="#333"
                            size="20"
                        ></up-icon>
                    </div>
                    <div class="cBox">
                        <div class="title">修改昵称</div>
                        <div class="row">
                            <input
                                v-model="nickname"
                                type="nickname"
                                class="myInput"
                                placeholder="请输入昵称"
                            />
                        </div>
                        <div class="btn">
                            <button
                                class="sbtn"
                                form-type="submit"
                                @click="submitNickName"
                            >
                                提交
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <tabbar />
    </div>
</template>

<script setup lang="ts">
    import { http, ajax } from "@/http/http";
    import tabbar from "@/components/tabbar.vue";
    import tabs from "@/components/tabs.vue";
    import tag from "@/components/tags.vue";
    import type { Tag } from "@/components/tags.vue";
    import { useRouter } from "@/common/route";
    import { communityService } from "@/pages/community/service";
    import { onReachBottom } from "@dcloudio/uni-app";
    import { useUserStore } from "@/store/user-store";
    import { toast } from "@/common/toast";
    import {
        publishService,
        type PromptSendParams
    } from "@/pages/publish/service";
    import waterfall from "@/components/waterfall.vue";
    import utils from "@/utils/utils";
    import { getConfig } from "@/data/config";
    import { myService } from "./service";
    const mservice = myService().service;
    const pservice = publishService().service;
    const userStore = useUserStore();
    const service = communityService().service;
    const { push, replace, back } = useRouter();
    const tabsRef = ref();
    const tab = ref([
        {
            name: "我的发布",
            val: "0"
        },
        {
            name: "我的喜欢",
            disabled: false,
            val: "1"
        }
    ]);
    const list = ref<any[]>([
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
    const list2 = ref<any[]>([]);

    const iDisplayLength = ref(10);
    const hasMore = ref(true);
    const hasMore2 = ref(true);
    const total = ref(0);
    const total2 = ref(0);
    const waterRef = ref();
    const waterRef2 = ref();
    const pickTabItem = ref(tab.value[0]);
    const tabChange = (item: any) => {
        pickTabItem.value = item;
        if (
            (item.val == "1" && list2.value.length == 0) ||
            (item.val == "0" && list.value.length == 0)
        ) {
            getPropmtList("init");
        }
    };
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
                waterRef2.value.reset();
            }
            if (type == "init" && pickTabItem.value.val == "0") {
                list.value = [];
                waterRef.value.reset();
            }
            let res;
            if (pickTabItem.value.val == "0") {
                const res2 = await service.getPromptList({
                    iDisplayStart:
                        pickTabItem.value.val == "0"
                            ? list.value.length
                            : list2.value.length,
                    iDisplayLength: iDisplayLength.value,
                    // auditingSta: 1,
                    // promptType: pickTabItem.value.val,
                    // tuckFlag: pickTabItem.value.val == "1" ? true : undefined,
                    hasCount: true,
                    tuckuid: userStore.userInfo.uid,
                    uid: userStore.userInfo.uid
                });
                res = res2;
            } else {
                const res3 = await service.getUserLikeList({
                    iDisplayStart:
                        pickTabItem.value.val == "0"
                            ? list.value.length
                            : list2.value.length,
                    iDisplayLength: iDisplayLength.value,
                    uid: userStore.userInfo.uid,
                    hasCount: true,
                    tuckuid: userStore.userInfo.uid
                });
                res = res3;
            }
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
    const avatarUrl = ref("");
    const onChooseAvatar = async (e: any) => {
        console.log(e);

        uni.showLoading({
            title: "图片上传中..."
        });
        try {
            const res = await http.upload<{
                code: Number;
                data: string;
            }>("/prompt/api/fileUpload", e.detail.avatarUrl);
            console.log(res);
            if (res.code == 0) {
                avatarUrl.value = getConfig().imgBasicUrl + res.data;
                mservice.updateImg({
                    uid: userStore.userInfo.uid,
                    headImg: avatarUrl.value
                });
                userStore.update_user_info("headImg", avatarUrl.value);
            } else {
                console.warn(res);
            }
        } catch (error) {
            uni.hideLoading();
            console.warn(error);
        }
    };
    const nicknamePopVisible = ref(false);
    const nickname = ref("");
    const openPop = () => {
        nicknamePopVisible.value = true;
    };
    const submitNickName = async () => {
        console.log(nickname.value);
        if (!nickname.value) {
            toast("昵称不合法，请重新填写");
            return;
        }
        nicknamePopVisible.value = false;
        const res = await mservice.updateImg({
            uid: userStore.userInfo.uid,
            name: nickname.value
        });
        if (res.code == 0) {
            toast("修改成功");
            userStore.update_user_info("name", avatarUrl.value);
        }
    };
    // #ifdef MP-ALIPAY
    const handleAuthError = (e: any) => {
        console.log(e);
    };
    const getOpenUserInfo = () => {
        uni.getUserInfo({
            success: async (res: any) => {
                console.log(res);
                const resp = await mservice.updateImg({
                    uid: userStore.userInfo.uid,
                    name: res.nickName,
                    headImg: res.avatar
                });
                if (resp.code == 0) {
                    uni.hideLoading();
                    avatarUrl.value = res.avatar;
                    userStore.update_user_info("headImg", avatarUrl.value);
                }
            },
            fail: (err) => {
                console.log(err);
            }
        });
    };
    // #endif

    onReachBottom(() => {
        getPropmtList("more");
    });
    onMounted(() => {
        // tabsRef.value.setTab({ index: 2 });
        getPropmtList("init");
        // nextTick(() => {
        //     if (tabsRef.value) {
        //         tabsRef?.value.setTab({ index: 1 });
        //     }
        // });
    });
    const loginOut = () => {
        uni.reLaunch({ url: "/pages/login/login" });
    };
</script>

<style lang="scss" scoped>
    .page {
        .userBox {
            padding-top: 43rpx;
            padding-bottom: 108rpx;
            .toolBox {
                justify-content: space-between;
                padding: 0 54rpx;
                width: 100%;
                position: absolute;
                top: 43rpx;
                .help {
                    width: 38rpx;
                    height: 38rpx;
                }
                .exit {
                    width: 38rpx;
                    height: 38rpx;
                }
            }
            .headerBox {
                .imgBox {
                    text-align: center;

                    width: 100%;
                    display: flex;
                    justify-content: center;
                    .clearBtn {
                        border-radius: 50%;
                        width: 150rpx;
                        height: 150rpx;
                    }
                    .resImg {
                        width: 150rpx;
                        height: 150rpx;
                        border-radius: 50%;
                    }
                }
            }
            .nameBox {
                display: flex;
                margin-top: 30rpx;
                margin-bottom: 30rpx;
                justify-content: center;
                .name {
                    height: 25rpx;
                    font-family: AlibabaPuHuiTiM;
                    font-size: 33rpx;
                    color: #333333;
                    line-height: 25rpx;
                    text-align: left;
                    font-style: normal;
                }
                .vip {
                    position: relative;
                    top: -22rpx;
                    width: 150rpx;
                    height: 75rpx;
                    // background: linear-gradient(
                    //     270deg,
                    //     #f6af49 0%,
                    //     #c18854 100%
                    // );
                    // box-shadow: 0rpx 4rpx 7rpx 0rpx rgba(58, 49, 5, 0.22);
                    border-radius: 16rpx;
                }
            }
            .show {
                margin-top: -40rpx;

                width: 100%;
                padding: 0 135rpx;
                display: flex;
                justify-content: center;
                .item {
                    display: flex;
                    width: 200rpx;
                    height: 25rpx;
                    font-family: AlibabaPuHuiTiR;
                    font-size: 25rpx;
                    color: #999999;
                    line-height: 25rpx;
                    text-align: left;
                    font-style: normal;
                    .label {
                        margin-right: 10rpx;
                    }
                    .val {
                        color: #333333;
                        // font-weight: bold;
                    }
                }
            }
        }
        .wBox {
            padding: 21rpx 27rpx;
        }
    }
    .myModal {
        .outBox {
            padding: 40rpx;
            position: absolute;
            top: 20vh;
            display: flex;
            justify-content: center;
            width: 100%;
            .innerBox {
                background-color: #fff;
                padding: 40rpx;
                border-radius: 13rpx;
                // width: 100%;
                position: relative;
                .close {
                    right: 10px;
                    top: 10px;
                    position: absolute;
                    opacity: 0.75;
                }
                .cBox {
                    .title {
                        text-align: center;
                    }
                    .row {
                        margin: 10px 0;
                        margin-top: 20px;
                        .myInput {
                            border: 1px solid #dbdbdb;
                            height: 60rpx;
                            line-height: 60rpx;
                            padding-left: 20rpx;
                        }
                    }
                    .btn {
                        .sbtn {
                            height: 60rpx;
                            line-height: 60rpx;
                            background-color: #0271fd;
                            color: #fff;
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
</style>
