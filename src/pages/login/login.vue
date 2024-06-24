<template>
    <view class="loginPage page">
        <div class="logo center">
            <image
                class="resImg"
                mode="scaleToFill"
                src="../../static/image/logo.png"
                lazy-load="false"
            >
            </image>
        </div>
        <div class="bg">
            <image
                class="resImg"
                mode="widthFix"
                src="../../static/image/logoBg.png"
                lazy-load="false"
            >
            </image>
        </div>
        <div class="float center">
            <button
                class="login fm"
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumberAndLogin"
            >
                授权登录
            </button>
        </div>
    </view>
</template>

<script setup lang="ts">
    import { useUserStore } from "@/store/user-store";
    import { useAppStore } from "@/store/app-store";
    import type { ButtonOnGetphonenumber } from "@uni-helper/uni-app-types";
    import { onLoad } from "@dcloudio/uni-app";
    import { useLoginService } from "./service";
    import { useRouter } from "@/common/route";
    const { push, replace, tab } = useRouter();
    const { LoginService } = useLoginService();
    const userStore = useUserStore();
    const appStore = useAppStore();
    const code = ref("");
    const pn = ref("");
    onLoad((options) => {
        console.log(options);
        getCode();
    });
    const getCode = () => {
        uni.login({
            success: function (loginRes) {
                console.log(loginRes);
                code.value = loginRes.code;
            }
        });
    };
    const getPhoneNumberAndLogin = async (e: ButtonOnGetphonenumber | any) => {
        console.log("getPhoneNumberAndLogin", e);
        uni.showLoading({
            title: "登录中，请稍等"
        });
        const { detail } = e;
        const showToast = uni.showToast;
        const { login } = uni;
        if (detail.errno === 104) {
            // showAgreementFunc();
            uni.hideLoading();
            return;
        }
        if (detail.errMsg.includes("ok")) {
            try {
                let o = {
                    sign: detail.sign,
                    response: detail.encryptedData
                };
                let params: {
                    eid: string;
                    [index: string]: string | undefined;
                } = {
                    code: detail.code || undefined,
                    alires: JSON.stringify(o) || undefined,
                    eid: "x012345678901234"
                };
                for (let k in params) {
                    if (params[k] == undefined) delete params[k];
                }
                const res = await LoginService.getPhoneNumber(params);
                console.log(res);
                if (res.code == 0) {
                    const data = JSON.parse(res.data);
                    console.log(data);
                    pn.value = data.phoneNumber || data;
                    const loginRes = await LoginService.loginIn({
                        pn: pn.value,
                        mode: 2097152
                    });
                    console.log(loginRes);
                    userStore.set_user_info(loginRes.data);
                    appStore.changeLoginState(true);
                    appStore.set_Token(
                        "local_token",
                        loginRes.data.uid + "" + loginRes.data.security
                    );
                    tab({
                        url: "/pages/home/home-index"
                    });
                }
            } catch {
                uni.hideLoading();
                showToast({
                    title: "登陆失败，请稍后再试",
                    icon: "none"
                });
            }
        } else {
            showToast({
                title: "登陆失败，请稍后再试",
                icon: "none"
            });
        }
    };
</script>

<style lang="scss" scoped>
    .page {
        height: 100vh;
        overflow: hidden;
        .bg {
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            width: 100%;
            .resImg {
                width: 100%;
                height: 100vh;
            }
        }
        .logo {
            position: fixed;
            top: 235rpx;
            left: 0;
            width: 100%;
            z-index: 10;
            .resImg {
                width: 419rpx;
                height: 194rpx;
            }
        }
        .float {
            position: fixed;
            left: 0;
            bottom: 10vh;
            width: 100%;
            z-index: 10;
            .login {
                width: 638rpx;
                height: 105rpx;
                background: #0271fd;
                border-radius: 53rpx;
                line-height: 105rpx;
                color: #fff;
            }
        }
    }
</style>
