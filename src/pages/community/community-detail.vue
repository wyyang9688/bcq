<!--  -->
<template>
    <div class="communityDetailPage page">
        <tabs
            @onChange="tabChange"
            @onSearch="onSearch"
            ref="tabsRef"
            :tab="tab"
        />
        <div class="detailBox">
            <detail @like="like" :item="detailItme" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import tabs from "@/components/tabs.vue";
    import detail from "@/components/imgdetail.vue";
    import { useRouter } from "@/common/route";
    import { onLoad } from "@dcloudio/uni-app";
    import { toast } from "@/common/toast";
    import { useUserStore } from "@/store/user-store";
    import { communityService, type PromptItem } from "./service";
    const service = communityService().service;
    const userStore = useUserStore();
    const { push, replace, back } = useRouter();
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
        console.log(item);
        pickTabItem.value = item;
        uni.setStorageSync("changeCommunityTab", item);
        useRouter().tab({
            url: "/pages/community/community-index"
        });
    };
    const tabsRef = ref();
    const onSearch = (item: { name: string }) => {
        console.log("search");
        console.log(item);
        push({
            url: "/pages/community/search"
        });
    };
    const itemId = ref("");
    const detailItme = ref<PromptItem>();
    const getDetail = async (id: string) => {
        const res = await service.getPromptList({
            iDisplayStart: 0,
            iDisplayLength: 10,
            auditingSta: 1,
            promptId: id,
            hasCount: true,
            tuckuid: userStore.userInfo.uid
        });
        console.log(res);
        uni.hideLoading();
        if (res.code == 0 && res.data.length) {
            detailItme.value = res.data[0];
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
    onLoad((query: any) => {
        console.log(query);
        if (query.id) {
            itemId.value = query.id;
            getDetail(itemId.value);
        }
        if (query.tabIndex) {
            nextTick(() => {
                console.log("nextTick");
                setTimeout(() => {
                    tabsRef.value.setTab({
                        index: query.tabIndex
                    });
                }, 500);
            });
        }
    });
    onMounted(() => {
        //
        // setTimeout(() => {
        //     tabsRef.value.setTab({
        //         index: 1
        //     });
        // }, 2000);
    });
</script>
<style lang="scss" scoped></style>
