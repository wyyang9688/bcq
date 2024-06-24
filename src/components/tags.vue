<!--  -->
<template>
    <div class="tagCom com">
        <div class="tagsBox">
            <div class="wtags" style="">
                <div
                    class="wtag"
                    style="margin-right: 18rpx; margin-bottom: 10rpx"
                    v-for="(item, index) of tags"
                    :class="item.isPick ? 'pick' : ''"
                    :key="index"
                    @click="clickTag(item)"
                >
                    {{ item.name }}
                </div>
            </div>
            <div class="rt" v-show="!hideRt">
                <div class="iconBox" @click="switchType">
                    <up-icon
                        :name="showType == 'list' ? 'list-dot' : 'photo'"
                        color="#999999"
                        size="28"
                    ></up-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    export interface Tag {
        name: string;
        isPick: boolean;
    }
    const props = defineProps({
        tags: {
            type: Array as PropType<Tag[]>,
            default: []
        },
        msg: {
            type: Object as PropType<any>
        },
        hideRt: {
            type: Boolean,
            default: false
        }
    });
    const emits = defineEmits<{
        (e: "showTypeChange", showType: "list" | "img"): void;
        (e: "tagChange", tags: Tag[]): Tag[];
    }>();
    const showType = ref<"list" | "img">("list");
    const tags = computed(() => props.tags);
    const tagsChange = () => {
        emits("tagChange", tags.value);
    };
    const clickTag = (item: Tag) => {
        item.isPick = !item.isPick;
        tagsChange();
    };
    const switchType = () => {
        if (props.msg?.pickTabItem.val == 1) {
            showType.value = showType.value === "list" ? "img" : "list";

            emits("showTypeChange", showType.value);
        }

        return showType.value;
    };
    defineExpose({
        showType,
        switchType
    });
</script>
<style lang="scss" scoped>
    .com {
        .tagsBox {
            display: flex;
            margin: 28rpx 0 18rpx 0;
            .wtags {
                flex-grow: 1;
            }
            .rt {
                text-align: right;
            }
        }
    }
</style>
