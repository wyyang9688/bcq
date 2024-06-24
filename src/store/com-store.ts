import { defineStore } from "pinia";

export const useComStore = defineStore("com", {
    state: () => {
        return { tabbarIndex: 0 };
    },
    actions: {
        setTabbarIndex(index: number) {
            this.tabbarIndex = index;
        }
    },
    persist: true
});
