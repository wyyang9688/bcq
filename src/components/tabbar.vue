<template>
    <div class="tabbarBox">
        <up-tabbar
            style="z-index: 500"
            :value="tabbarIndex"
            @change="changeTabbar"
            :fixed="true"
            :placeholder="false"
            activeColor="#37AE69"
            inactiveColor="#E9E9E9"
            :safeAreaInsetBottom="false"
        >
            <up-tabbar-item
                v-for="(item, index) in list"
                :key="index"
                :text="item.text"
                @click="clickTabbar(item, index)"
            >
                <template #active-icon>
                    <image
                        class="u-page__item__slot-icon"
                        :src="item.imgFill"
                    ></image>
                </template>
                <template #inactive-icon>
                    <image
                        class="u-page__item__slot-icon"
                        :src="item.img"
                    ></image>
                </template>
            </up-tabbar-item>
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
        img?: string;
        imgFill?: string;
    }
    const list: Tabbar[] = [
        {
            text: "首页",
            icon: "home",
            img: "/static/bcq/01.png",
            imgFill: "/static/bcq/01Fill.png",
            to: "/pages/home/home-index"
        },
        {
            text: "会员卡",
            icon: "photo",
            img: "/static/bcq/02.png",
            imgFill: "/static/bcq/02Fill.png",
            to: "/pages/community/community-index"
        },
        {
            text: "我的",
            icon: "account",
            img: "/static/bcq/03.png",
            imgFill: "/static/bcq/03Fill.png",
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
        background: #ffffff;
        box-shadow: 0px -5 5px 0px rgba(127, 127, 127, 0.09);
        .u-page__item__slot-icon {
            width: 20px;
            height: 20px;
        }
    }
</style>
