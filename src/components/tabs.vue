<!--  -->
<template>
    <div class="tabsCom com" v-show="props.notTop">
        <div class="tabs">
            <div class="tab fr">
                <up-tabs
                    ref="tabRef"
                    :activeStyle="{
                        fontFamily: 'AlibabaPuHuiTiM',
                        color: '#0271FD',
                        fontWeight: 'bold'
                    }"
                    :inactiveStyle="{
                        color: '#999'
                    }"
                    :current="current"
                    line-width="40"
                    lineHeight="2"
                    lineColor=" linear-gradient(90deg,#0271FD 0% ,#0271FD 19% , #fff 20%,  #fff 30%,#0271FD 31%);"
                    itemStyle="padding-left: 15px; padding-right: 15px; height: 46px;"
                    :list="tabs"
                    @click="clickTabs"
                >
                    <template #right v-if="!props.hiddenSearch">
                        <view
                            class="search vcenter"
                            style="padding: 0 20rpx"
                            @click="clickSearch"
                        >
                            <up-icon
                                name="search"
                                color="#0271FD"
                                size="24"
                                bold
                            ></up-icon>
                        </view>
                    </template>
                </up-tabs>
            </div>
        </div>
    </div>
    <up-sticky v-show="!props.notTop" bgColor="#ffffff" zIndex="100">
        <div class="tabsCom com" v-show="!props.notTop">
            <div class="tabs">
                <div class="tab fr">
                    <up-tabs
                        :activeStyle="{
                            fontFamily: 'AlibabaPuHuiTiM',
                            color: '#0271FD',
                            fontWeight: 'bold'
                        }"
                        :inactiveStyle="{
                            color: '#999'
                        }"
                        :current="current"
                        line-width="40"
                        lineHeight="2"
                        lineColor=" linear-gradient(90deg,#0271FD 0% ,#0271FD 19% , #fff 20%,  #fff 30%,#0271FD 31%);"
                        itemStyle="padding-left: 15px; padding-right: 15px; height: 46px;"
                        :list="tabs"
                        @click="clickTabs"
                    >
                        <template #right v-if="!props.hiddenSearch">
                            <view
                                class="search vcenter"
                                style="padding: 0 20rpx"
                                @click="clickSearch"
                            >
                                <up-icon
                                    name="search"
                                    color="#0271FD"
                                    size="24"
                                    bold
                                ></up-icon>
                            </view>
                        </template>
                    </up-tabs>
                </div>
            </div>
        </div>
    </up-sticky>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            hiddenSearch: boolean;
            tab: tabItem[];
            notTop: boolean;
        }>(),
        {
            notTop: false,
            hiddenSearch: false,
            tab: () => [{ name: "全部" }]
        }
    );
    const emits = defineEmits<{
        (e: "onSearch", item: tabItem): void;
        (e: "onChange", item: tabItem): void;
    }>();

    interface tabItem {
        name: string;
        disabled?: boolean;
        val?: string;
        id?: string;
        index?: number;
    }
    const tabs = computed(() => props.tab);
    const clickSearch = () => {
        console.log("search");
        emits("onSearch", { name: "123" });
    };
    const pickTabItem = ref(tabs.value[0]);
    const clickTabs = (item: tabItem) => {
        console.log(item);
        current.value = item?.index || 0;
        pickTabItem.value = item;
        if (item.disabled) {
            return;
        } else {
            emits("onChange", pickTabItem.value);
        }
    };
    const current = ref(0);
    const tabRef = ref();
    const setTab = (params: {
        name?: string;
        val?: string;
        id?: string;
        index: number;
    }) => {
        // console.log("setTab");
        // console.log(params);
        // console.log("oldCurrent");
        // console.log(current.value);
        if (params.name)
            current.value = tabs.value.findIndex(
                (item) => item.name == params.name
            );
        if (params.val)
            current.value = tabs.value.findIndex(
                (item) => item.val == params.val
            );
        if (params.id)
            current.value = tabs.value.findIndex(
                (item) => item.id == params.id
            );
        if (params.index) {
            current.value = Number(params.index);
        }
        console.log(current.value);
        console.log(pickTabItem.value);
        nextTick(() => {
            console.log(tabRef.value);
            console.log(tabRef.value.innerCurrent);
            if (tabRef && tabRef.value.innerCurrent)
                tabRef.value.innerCurrent = current.value;
            console.log(tabRef.value.innerCurrent);
            tabRef.value.resize();
        });
    };

    defineExpose({
        setTab
    });
</script>
<style lang="scss" scoped>
    .tabsCom {
        background-color: #fff;
        box-shadow: 0rpx 5rpx 11rpx 0rpx rgba(0, 0, 0, 0.05);
        .search {
            border-left: 1px solid #e8e8e8;
            height: 88rpx;
            box-shadow: 0rpx 5rpx 11rpx 0rpx rgba(0, 0, 0, 0.05);
        }
    }
</style>
