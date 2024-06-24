<!--  -->
<template>
    <div class="selectPickCom com">
        <div class="select flex" @click="showOption">
            <div class="pick" v-if="pickItem?.label">{{ pickItem?.label }}</div>
            <div class="text" v-else>{{ props.placehodle }}</div>
            <div class="icon vcenter">
                <up-icon name="arrow-down" color="#ACB0B7" size="18"></up-icon>
            </div>
        </div>

        <up-picker
            ref="uPickerRef"
            @confirm="confirm"
            @cancel="cancel"
            @change="changeHandler"
            :show="show"
            keyName="label"
            :columns="props.options"
        ></up-picker>
    </div>
</template>

<script setup lang="ts">
    console.log("select");
    const props = withDefaults(
        defineProps<{
            placehodle?: string;
            options?: [];
        }>(),
        {
            placehodle: "请选择",
            options: () => []
        }
    );
    const show = ref(false);
    const uPickerRef = ref<any>();
    const changeHandler = (e: any) => {
        const { columnIndex, value, values, index } = e;
        // console.log(e);
        // if (columnIndex === 0) {
        //     uPickerRef.value.setColumnValues(1, columnData[index]);
        // }
    };
    const showOption = () => {
        show.value = true;
    };
    interface PickItem {
        label: string;
        val: string;
        [index: string]: any;
    }
    const pickItem = ref<PickItem>();
    const emits = defineEmits<{
        (e: "confirm", item: PickItem): void;
    }>();
    const confirm = (e: any) => {
        // console.log("confirm", e);
        pickItem.value = e.value[0];
        show.value = false;
        if (pickItem.value) emits("confirm", pickItem.value);
    };
    const cancel = () => {
        show.value = false;
    };
    const setVal = (item: PickItem) => {
        pickItem.value = item;
    };
    defineExpose({
        setVal
    });
</script>
<style lang="scss" scoped>
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
        .pick {
            color: #333;
        }
        .icon {
            position: absolute;
            top: 0;
            right: 20rpx;
            height: 100%;
        }
    }
</style>
