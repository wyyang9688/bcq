<!--  -->
<template>
    <div class="searchPage page">
        <div class="searchBox">
            <div class="search">
                <up-input
                    placeholder="请输入搜索内容"
                    v-model="kw"
                    @change="searchChange"
                    :placeholderStyle="{
                        width: '228rpx',
                        height: '40rpx',
                        fontFamily: 'AlibabaPuHuiTiR',
                        fontSize: '29rpx',
                        color: 'rgba(153, 153, 153,0.38)',
                        textAlign: 'left',
                        fontStyle: 'normal'
                    }"
                    customStyle="border:none;width: 699rpx;padding-left:20rpx;
height: 80rpx;
background: #FFFFFF;
box-shadow: 0rpx 5rpx 11rpx 0rpx rgba(0,0,0,0.05);
border-radius: 47rpx;"
                    suffixIcon="search"
                    suffixIconStyle="color: #0271FD;font-size:40rpx;font-weight:bold;"
                ></up-input>
            </div>
        </div>
        <div class="tagtitle">文字类提示词类别：</div>
        <tag
            ref="tagRef"
            @showTypeChange="showTypeChange"
            @tagChange="tagChange"
            :hide-rt="true"
            :tags="tags"
        />
        <div class="tagtitle">图片类提示词类别：</div>
        <tag
            ref="tagRef"
            @showTypeChange="showTypeChange"
            @tagChange="tagChange"
            :hide-rt="true"
            :tags="tags1"
        />
        <div>
            <waterfall
                ref="waterRef"
                @detail="goToDetail"
                @like="like"
                :list="list"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import tag from "@/components/tags.vue";
    import type { Tag } from "@/components/tags.vue";
    import waterfall from "@/components/waterfall.vue";
    import { communityService } from "@/pages/community/service";
    import type { PromptItem } from "./service";
    import { toast } from "@/common/toast";
    import { useUserStore } from "@/store/user-store";
    import {
        publishService,
        type PromptSendParams
    } from "@/pages/publish/service";
    import { useRouter } from "@/common/route";
    const { push, replace, back } = useRouter();
    const service = communityService().service;
    const pservice = publishService().service;
    const userStore = useUserStore();
    const tags = ref<any[]>([]);
    const tags1 = ref<any[]>([]);
    const getOptions = async (
        type: number,
        params: {
            type: "modelName" | "modelType" | "modelLable";
            promptType?: string | number;
        }
    ) => {
        try {
            const res = await pservice.getOptions(params);
            console.log(res);
            if (res.code == 0) {
                if (type == 0) {
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
    getOptions(0, { type: "modelLable", promptType: 0 });
    getOptions(1, { type: "modelLable", promptType: 1 });
    const showTypeChange = (type: string) => {
        console.log("showTypeChange", type);
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
    const tagChange = (tags: Tag[]) => {
        console.log(tags);
        getPropmtList("init");
    };
    const kw = ref("");
    const tagRef = ref<{ switchType: () => void; showType: string }>();
    const list = ref<PromptItem[]>([]);

    const iDisplayLength = ref(10);
    const hasMore = ref(true);
    const total = ref(0);
    const waterRef = ref();
    const goToDetail = (item: any) => {
        console.log(item);
        push({
            url:
                "/pages/community/community-detail?id=" +
                item.id +
                "&tabIndex=" +
                item.promptType
        });
    };
    const getPropmtList = async (type: string = "init") => {
        console.log(kw.value);
        try {
            if (!hasMore.value && type != "init") {
                console.log("noMore");
                return;
            }

            if (type == "init") {
                list.value = [];
                waterRef.value.reset();
            }
            let promptLabel =
                tags.value
                    .filter((v) => v.isPick)
                    .map((v) => v.name)
                    .join(",") || "";
            let tagstr1 = tags1.value
                .filter((v) => v.isPick)
                .map((v) => v.name)
                .join(",");
            if (tagstr1) {
                promptLabel = promptLabel
                    ? promptLabel + "," + tagstr1
                    : tagstr1;
            }
            if (kw.value) {
                promptLabel = promptLabel
                    ? promptLabel + "," + kw.value
                    : kw.value || "";
            }
            const res = await service.getPromptList({
                iDisplayStart: list.value.length,
                iDisplayLength: iDisplayLength.value,
                auditingSta: 1,
                // promptType: pickTabItem.value.val,
                hasCount: true,
                tuckuid: userStore.userInfo.uid,
                promptLabel: promptLabel || undefined
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
            uni.hideLoading();
        }
    };
    const searchChange = () => {
        uni.$u.debounce(getPropmtList, 500);
    };
</script>
<style lang="scss" scoped>
    .searchPage {
        padding: 0 25rpx;
        padding-top: 20rpx;
        .searchBox {
        }
    }
    .tagtitle {
        margin-top: 30rpx;
        font-weight: bold;
        height: 29rpx;
        font-family: AlibabaPuHuiTiM;
        font-size: 29rpx;
        color: #333333;
        line-height: 29rpx;
        text-align: left;
        font-style: normal;
    }
    ::v-deep .input-placeholder {
        opacity: 0.38;
    }
</style>
