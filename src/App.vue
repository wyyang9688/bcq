<script setup lang="ts">
    import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
    import { getConfig } from "@/data/config";
    import { http } from "./http/http";
    provide("$app", { http });
    provide("$config", getConfig());
    onLaunch((options) => {
        console.log("App Launch");
        console.log(options);
        console.log(getConfig());
    });
    onShow(() => {
        console.log("App Show");
    });
    onHide(() => {
        console.log("App Hide");
    });
</script>

<style lang="scss">
    #app {
        box-sizing: border-box;
    }
    .myModal {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
    }
    .clearBtn {
        background-color: transparent;
        border: none;
        border-width: 0px;
        padding: 0;
        margin: 0;
        outline: none;
        border-radius: 0;
        border-color: transparent;
    }
    body {
        font-family: "AlibabaPuHuiTiR";
    }
    .m10 {
        margin-top: 10rpx;
    }
    .ml10 {
        margin-left: 10rpx;
    }
    .m20 {
        margin-top: 20rpx;
    }
    .ml20 {
        margin-left: 20rpx;
    }
    .m30 {
        margin-top: 30rpx;
    }
    .m40 {
        margin-top: 40rpx;
    }
    @font-face {
        font-family: "AlibabaPuHuiTiM";
        src: url("~@/static/ttf/AlibabaPuHuiM.ttf");
    }
    @font-face {
        font-family: "AlibabaPuHuiTiR";
        src: url("~@/static/ttf/AlibabaPuHuiR.ttf");
    }
    @font-face {
        font-family: "AlibabaPuHuiTiT";
        src: url("~@/static/ttf/AlibabaPuHuiT.ttf");
    }
    @font-face {
        font-family: "AlibabaPuHuiTi";
        src: url("~@/static/ttf/AlibabaPuHuiR.ttf");
    }

    .page {
        min-height: 100vh;
        background-color: #f6f6f6;
    }
    .pg {
        background-color: rgba(128, 128, 128, 0.35);
    }
    .w100 {
        width: 100%;
    }
    .test {
        color: rgba(153, 153, 153, 0.38);
    }
    .flex {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .grow {
        flex-grow: 1;
    }
    .radius {
        border-radius: 27rpx;
    }
    .required::after {
        content: "*";
        color: #ee4444;
        position: relative;
        right: -5px;
        margin-left: -5px;
        font-weight: bold;
    }
    .fr {
        font-family: "AlibabaPuHuiTiR";
    }
    .fm {
        font-family: "AlibabaPuHuiTiM";
    }
    .bold {
        font-weight: bold;
        font-family: "AlibabaPuHuiTiM";
    }
    $cp: #0271fd;
    $cp1: #82b9fe;
    $ci: #999999;
    .cp {
        color: $cp;
    }
    .cp1 {
        color: $cp1;
    }
    .cpg1 {
        background-color: $cp1;
    }
    .ci {
        color: $ci;
    }
    .cig {
        background-color: $ci;
    }
    .white {
        background-color: #fff;
    }

    .center {
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .vcenter {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .pos {
        position: relative;
    }
    .wtags {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .wtag {
        display: inline-block;
        text-align: center;
        display: flex;
        justify-content: center;
        width: fit-content;
        padding: 0 30rpx;
        height: 54rpx;
        line-height: 54rpx;
        background: #e8e8e8;
        border-radius: 27rpx;
        font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
        font-weight: 400;
        font-size: 29rpx;
        color: #333333;
        font-style: normal;
        &.pick {
            background-color: $cp;
            color: #fff;
        }
    }
    .bg1 {
        background-color: #f6f6f6;
    }

    .tabbarPage {
        padding-bottom: 100rpx;
    }
    .resImg {
        max-width: 100%;
        max-height: 100%;
        vertical-align: bottom;
    }
    .bgly,
    .bglb {
        position: relative;
        z-index: 10;
    }
    .bgly::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 40%;
        width: 100%;
        background-color: rgba(255, 178, 91, 0.5);
        z-index: 1;
    }
    .bglb::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 40%;
        width: 100%;
        background-color: rgba(2, 113, 253, 0.5);
        z-index: 1;
    }
    :not(not) {
        box-sizing: border-box;
    }

    .dv {
    }
    .hidden {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .hidden2 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .hidden3 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mtitle {
        display: flex;
        .title::before {
            content: "";
            display: inline-block;
            width: 6rpx;
            height: 31rpx;
            margin-right: 20rpx;
            line-height: 40rpx;
            position: relative;
            top: 4rpx;
            background: linear-gradient(
                180deg,
                #5c9cfd 0%,
                rgba(79, 112, 255, 0) 100%
            );
            border-radius: 5rpx;
        }
        .title {
            height: 40rpx;
            font-family: AlibabaPuHuiTiM;
            font-size: 30rpx;
            color: #000000;
            text-align: left;
            font-style: normal;
            font-weight: bold;
            line-height: 40rpx;
            flex-grow: 1;
        }
        .rt {
            display: flex;
            width: fit-content;
            height: 40rpx;
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 400;
            font-size: 25rpx;
            color: #acb0b7;
            line-height: 40rpx;
            text-align: left;
            font-style: normal;
            .u-icon {
                margin-left: 10rpx;
            }
        }
    }
</style>
