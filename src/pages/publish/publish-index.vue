<!--  -->
<template>
    <div class="publishPage page">
        <div class="form">
            <div class="btnGroup">
                <div
                    class="btn"
                    :class="gType == '1' ? ' pick' : ''"
                    @click="gType = '1'"
                >
                    文生图
                </div>
                <div
                    class="btn"
                    :class="gType == '0' ? ' pick' : ''"
                    @click="gType = '0'"
                >
                    文生文
                </div>
            </div>
            <div class="basic">
                <div class="title">基础信息</div>
                <div class="dv"></div>
                <div class="uploadBox center" v-show="gType == '1'">
                    <div class="upload" @click="selectImg('')">
                        <div class="bg vcenter" v-if="!imgItem.receiveSrc">
                            上传图片
                        </div>
                        <image
                            class="resImg"
                            :src="imgItem.receiveSrc"
                            mode="scaleToFill"
                            lazy-load="false"
                        >
                        </image>
                    </div>
                </div>
                <div class="row">
                    <div class="label required">AI模型名称</div>
                    <div class="val">
                        <mselect
                            @confirm="confirm"
                            :placehodle="'请选择模型名称'"
                            :options="[op.modelName]"
                        ></mselect>
                    </div>
                </div>
                <!-- <div class="row">
                    <div class="label required">类别</div>
                    <div class="val">
                        <mselect
                            @confirm="confirm"
                            :placehodle="'请选择类别'"
                            :options="[op.modelType]"
                        ></mselect>
                    </div>
                </div> -->
                <div class="row">
                    <div class="label required">标题</div>
                    <div class="val">
                        <div class="input">
                            <input
                                class="uni-input"
                                placeholder="带清除按钮的输入框"
                                :value="formData.promptTitle"
                                @input="inputTitleChange"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="label required">提示词</div>
                    <div class="val">
                        <div class="texta">
                            <textarea
                                v-model="formData.promptWord"
                                placeholder-style="color:#999;"
                                placeholder="请输入提示词"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="floatBtn vcenter">
                <div class="btn center vcenter" @click="submit">发布</div>
            </div>
        </div>
        <!-- <tabbar /> -->
    </div>
</template>

<script setup lang="ts">
    import tabbar from "@/components/tabbar.vue";
    import { getConfig } from "@/data/config";
    import mselect from "@/components/selectPick.vue";
    import type { InputOnInputEvent } from "@uni-helper/uni-app-types";
    import { http, ajax } from "@/http/http";
    import units from "@/utils/utils";
    import { publishService, type PromptSendParams } from "./service";
    import { useRouter } from "@/common/route";
    const route = useRouter();
    const service = publishService().service;
    const gType = ref("1");
    const imgItem = ref({
        src: "",
        receiveSrc: ""
    });

    const formData = ref<PromptSendParams>({
        promptType: "",
        promptWord: "",
        promptModel: "",
        promptTitle: "",
        imageId: ""
    });
    const submit = async () => {
        formData.value.promptType = gType.value;
        const params = formData.value;
        if (gType.value == "0") {
            delete params.imageId;
        }
        console.log(params);
        if (!units.notNull(params)) {
            uni.showToast({
                title: "请填写必要信息再进行操作",
                icon: "none"
            });
            return;
        }
        try {
            const res = await service.submit(params);
            console.log(res);
            if (res.code == 0) {
                uni.showToast({
                    title: "发布成功",
                    icon: "none"
                });
                route.tab({
                    url: "/pages/my/my-index"
                });
            }
        } catch (error) {}
    };
    const op = ref({
        modelName: [],
        modelType: []
    });
    const getOptions = async (params: { type: "modelName" | "modelType" }) => {
        try {
            const res = await service.getOptions(params);
            console.log(res);
            if (res.code == 0) {
                op.value[params.type] = res.data.map((v: AnyObject) => {
                    return {
                        ...v,
                        label: v.configTitle,
                        val: v.id
                    };
                });
            }
        } catch (error) {}
    };
    getOptions({ type: "modelName" });
    // getOptions({ type: "modelType" });
    const selectImg = (item: string = "") => {
        console.log(item);
        uni.chooseImage({
            sourceType: ["camera", "album"],
            count: 1,
            sizeType: ["compressed"],
            success: (res) => {
                console.log(JSON.stringify(res));
                if (res.tempFiles && (res.tempFiles as File[]).length > 0) {
                    if ((res.tempFiles as File[])[0].size > 5242880) {
                        // 300k=307200   1m=1048576    5m=5242880 tempFilePaths
                        uni.showToast({
                            title: "请将图片压缩至5m以内，再上传"
                        });
                        return;
                    }
                    uni.compressImage({
                        src: res.tempFilePaths[0],
                        // compressLevel: 1,
                        success: async (data) => {
                            console.log(data);
                            if (item == "") {
                                imgItem.value.src = data.tempFilePath;
                            }

                            uni.showLoading({
                                title: "图片上传中..."
                            });
                            try {
                                const res = await http.upload<{
                                    code: Number;
                                    data: string;
                                }>("/prompt/api/fileUpload", data.tempFilePath);
                                console.log(res);
                                if (res.code == 0) {
                                    imgItem.value.receiveSrc =
                                        getConfig().imgBasicUrl + res.data;
                                    formData.value.imageId = res.data;
                                } else {
                                    console.warn(res);
                                }
                            } catch (error) {
                                console.warn(error);
                            }
                        }
                    });
                }
            },
            fail: (error) => {
                // my.showToast({
                //   content: 'fail', // 文字内容
                // });

                console.log(JSON.stringify(error));
                if (error.error == 2001 || error.error == 11) {
                    uni.showToast({
                        title: "当前用户已拒绝该项授权", // 文字内容
                        icon: "none"
                    });
                } else if (error.error == 2002) {
                    // user does not allow authorization
                    // isPhoto_Per.value= true
                    // my.alert({ content: "打开失败：当前用户已拒绝该项授权，如需打开请点击右上角菜单中的设置选项重新打开,或者前往支付宝app-点击【我的】 - 右上角设置 - 【隐私】 - 【系统权限管理】，在里面看看相机、相册权限"});
                }
            }
        });
    };
    const title = ref("");
    const showClearIcon = ref(false);
    const inputTitleChange = function (event: InputOnInputEvent) {
        formData.value.promptTitle = event.detail.value;
        if (event.detail.value.length > 0) {
            showClearIcon.value = true;
        } else {
            showClearIcon.value = false;
        }
    };
    const clearIcon = function () {
        formData.value.promptTitle = "";
        showClearIcon.value = false;
    };
    const confirm = (item: any) => {
        console.log(item);
        console.log(item.configTitle);
        if (item.type == "modelName") {
            formData.value.promptModel = item.id;
        } else if (item.type == "modelType") {
            formData.value.promptType = item.id;
        }
    };

    onMounted(() => {
        //
    });
</script>
<style lang="scss" scoped>
    .page {
        padding-bottom: 158rpx;
        .form {
            padding: 30rpx 25rpx;
            .btnGroup {
                display: flex;

                .btn {
                    width: 217rpx;
                    height: 83rpx;
                    line-height: 83rpx;
                    text-align: center;
                    border-radius: 11rpx;
                    background-color: #fff;
                }
                .pick {
                    background: #0271fd;
                    color: #fff;
                }
            }
            .basic {
                margin-top: 18rpx;
                padding: 27rpx;
                background-color: #fff;
                box-shadow: 0rpx 5rpx 11rpx 0rpx rgba(0, 0, 0, 0.05);
                border-radius: 11rpx;
                .title {
                    height: 25rpx;
                    font-family: AlibabaPuHuiTiM;
                    font-size: 38rpx;
                    color: #333333;
                    line-height: 25rpx;
                    text-align: left;
                    font-weight: bold;
                }
                .dv {
                    margin: 30rpx 0;
                    width: 697rpx;
                    height: 2rpx;
                    border: 2rpx solid #f6f6f6;
                }
                .uploadBox {
                    .upload {
                        width: 138rpx;
                        height: 138rpx;
                        background: #d8d8d8;
                        border-radius: 14rpx;
                        .bg {
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 29rpx;
                            color: #999999;
                            height: 100%;
                        }
                    }
                }
                .row {
                    margin-top: 28rpx;
                    .label {
                        height: 25rpx;
                        font-family: AlibabaPuHuiTiM;
                        font-size: 29rpx;
                        color: #333333;
                        line-height: 25rpx;
                        text-align: left;
                        font-style: normal;
                        font-weight: bold;
                    }
                    .val {
                        margin-top: 14rpx;

                        .select {
                            padding-left: 20rpx;
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 25rpx;

                            text-align: left;
                            font-style: normal;
                            width: 638rpx;
                            height: 58rpx;
                            line-height: 58rpx;
                            background: #f6f6f6;
                            border-radius: 7rpx;
                            position: relative;
                            .text {
                                color: #999999;
                            }
                            .icon {
                                position: absolute;
                                top: 0;
                                right: 20rpx;
                                height: 100%;
                            }
                        }
                        .input {
                            padding-top: 6rpx;
                            padding-left: 20rpx;
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 25rpx;
                            color: #333;
                            text-align: left;
                            font-style: normal;
                            width: 638rpx;
                            height: 58rpx;
                            line-height: 58rpx;
                            background: #f6f6f6;
                            border-radius: 7rpx;
                            position: relative;
                            &::v-deep .input-placeholder {
                                color: #999;
                            }
                        }
                        .texta {
                            padding-top: 20rpx;
                            padding-left: 20rpx;
                            font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
                            font-weight: 400;
                            font-size: 25rpx;
                            color: #333;
                            text-align: left;
                            font-style: normal;
                            width: 638rpx;
                            height: 350rpx;
                            // line-height: 58rpx;
                            background: #f6f6f6;
                            border-radius: 7rpx;
                            position: relative;
                        }
                    }
                }
            }
            .floatBtn {
                position: fixed;
                z-index: 100;
                bottom: 0;
                left: 0;
                width: 750rpx;
                height: 158rpx;
                background: #ffffff;
                box-shadow: 0rpx 0rpx 7rpx 0rpx rgba(198, 198, 198, 0.5);
                .btn {
                    width: 668rpx;
                    height: 76rpx;
                    background: #0271fd;
                    border-radius: 40rpx;
                    font-family: AlibabaPuHuiTiM;
                    font-size: 33rpx;
                    color: #ffffff;
                }
            }
        }
    }
</style>
