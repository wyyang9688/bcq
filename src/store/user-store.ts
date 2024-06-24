import { defineStore } from "pinia";
import { useAppStore } from "./app-store";

const { setStorageSync, getStorageSync, removeStorageSync } = uni;

interface State {
    userInfo: UserInfo;
}
export interface AccInfo {
    id: string;
    createTime: number;
    pn: string;
    name: string;
    gender: number;
    headImg: string;
    type: number;
    model: number;
    disEids: string[];
}

export interface UserInfo {
    uid: string;
    security: string;
    oid: string;
    timestamp: string;
    model: number;
    accInfo: AccInfo;
    pn: string;
}

export interface Ep {
    id: string;
    name: string;
    tag: string;
    type: number;
    wxCode: string;
    loc: Loc;
    mblSiteUrl: string;
    hasInlShop: boolean;
    showName: string;
    pay: AnyObject;
    graduateRefundApply: boolean;
}

export interface Loc {
    geo: Geo;
}

export interface Geo {
    type: string;
    coordinates: number[];
}

const state = (): State => {
    return {
        userInfo: getStorageSync("userInfo")
    };
};

export const useUserStore = defineStore({
    id: "user",
    state,
    actions: {
        set_user_info(userInfo: UserInfo) {
            setStorageSync("userInfo", userInfo);
            console.log("user-store -> set_user_info", userInfo);
            this.userInfo = userInfo;
        },
        update_user_info<T extends keyof AccInfo>(key: T, value: AccInfo[T]) {
            this.userInfo.accInfo[key] = value;
        },
        clear_user_info() {
            useAppStore().clear_Token();
            removeStorageSync("userInfo");
            removeStorageSync("local_token");
            removeStorageSync("mid_token");
            this.userInfo = {
                uid: "",
                security: "",
                oid: "",
                timestamp: "",
                model: 0,
                accInfo: {
                    id: "",
                    createTime: 0,
                    pn: "",
                    name: "",
                    gender: 0,
                    headImg: "",
                    type: 0,
                    model: 0,
                    disEids: []
                },
                pn: ""
            };
        }
    }
});
