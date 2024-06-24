<template>
    <div class="tabbarBox">
        <up-tabbar
            style="z-index: 500"
            :value="tabbarIndex"
            @change="changeTabbar"
            :fixed="true"
            :placeholder="false"
            :safeAreaInsetBottom="false"
        >
            <up-tabbar-item
                v-for="(item, index) in list"
                :key="index"
                :text="item.text"
                :icon="item.icon"
                @click="clickTabbar(item, index)"
            ></up-tabbar-item>
        </up-tabbar>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from "@/common/route";
    import { useComStore } from "@/store/com-store";
    import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
    const props = withDefaults(
        defineProps<{
            index?: number;
        }>(),
        { index: 0 }
    );
    const com = useComStore();

    uni.hideTabBar();
    const { push, replace, back, tab } = useRouter();
    interface Tabbar {
        text: string;
        icon: string;
        to: string;
        type?: string;
    }
    const list: Tabbar[] = [
        {
            text: "首页",
            icon: "home",
            to: "/pages/home/home-index"
        },
        {
            text: "社区",
            icon: "photo",
            to: "/pages/community/community-index"
        },
        {
            text: "发布",
            icon: "plus",
            to: "/pages/publish/publish-index",
            type: "push"
        },
        {
            text: "课程",
            icon: "play-right",
            to: "/pages/course/course-index"
        },
        {
            text: "我的",
            icon: "account",
            to: "/pages/my/my-index"
        }
    ];
    const tabbarIndex = computed((): number => com.tabbarIndex);
    const clickTabbar = (item: Tabbar, index: number) => {
        com.setTabbarIndex(index);
        if (item.type == "push") push({ url: item.to });
        else tab({ url: item.to });
    };
    const changeTabbar = (e: any) => {};
    onShow(() => {
        let route = getCurrentPages()[0].route;
        console.log(route);
        for (let i = 0; i < list.length; i++) {
            if (route && list[i].to.includes(route)) {
                com.setTabbarIndex(i);
            }
        }
    });
</script>
<style lang="scss">
    .tabbarBox {
        position: fixed;
        z-index: 500;
    }
</style>
