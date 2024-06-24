<template>
    <view class="content">
        <!-- <image class="logo" src="/static/logo.png" mode="'scaleToFill'" /> -->
        <view class="text-area">
            <!-- <text class="title" @click="counter.increment()">{{ title }}</text> -->
        </view>

        <!-- <up-button type="warning" loading loadingText="加载中"></up-button>
        <up-button type="primary" icon="map" text="图标按钮"></up-button>
        <up-button
            type="primary"
            @click="goToLogin"
            shape="circle"
            text="跳转"
        ></up-button>
        <up-button type="primary" :disabled="true">{{
            counter.count
        }}</up-button> -->
        <tabbar />
    </view>
</template>

<script setup lang="ts">
    import tabbar from "@/components/tabbar.vue";
    import type BaseData from "@/http/http";
    interface Config {
        BASE_URL: string;
    }
    import { http, ajax } from "@/http/http";

    // #ifdef  MP-ALIPAY
    console.log("MP-WEIXIN");
    // #endif
    console.log(http);
    const getData = async () => {
        const res = await ajax.post(
            "https://midgrnd.hentre.top/api/act/lst?iDisplayStart=0&iDisplayLength=10&hasCount=true",
            { abc: 123 },
            { cbd: 456 }
        );

        console.log(res);
    };
    getData();

    const title = ref("Hello World1");

    // const goToLogin = () => {
    //     uni.navigateTo({
    //         url: "/pages/login/login"
    //     });
    // };

    const config: Config | undefined = inject("$config");
    console.log(config!.BASE_URL);
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .logo {
        height: 200rpx;
        width: 200rpx;
        margin-top: 200rpx;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 50rpx;
    }

    .text-area {
        display: flex;
        justify-content: center;
    }

    .title {
        font-size: 36rpx;
        color: #8f8f94;
    }
</style>
