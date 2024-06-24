import { http, ajax } from "@/http/http";
export interface PromptSendParams {
    promptType: string;
    promptWord: string;
    promptModel: string;
    promptLabel?: string;
    imageId?: string;

    promptTitle: string;
}
export interface PromptListParams {
    iDisplayStart: number | string;
    iDisplayLength: number | string;
    hasCount: boolean;
    uid?: string;
    tuckuid?: string;
    promptId?: string;
    auditingSta?: 0 | 1 | 2 | number;
    promptType?: number | string;
    promptLabel?: string;
    sortFlag?: 0 | 1;
    tuckFlag?: boolean;
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

export interface PromptItem {
    accInfo: Partial<AccInfo>;
    id: string;
    promptTitle: string;
    promptType: string;
    promptWord: string;
    promptModel: string;
    promptModelName: string;
    imageId: string;
    promptLabel: string;
    auditingSta: number;
    createTime: number;
    tuckCount: number;
    uid: string;
    isPick: boolean;
    tuckFlag: boolean;
}
class CommunityService {
    async getOptions(params: { type: string }) {
        const serviceData = await http.post<AnyObject>(
            `/prompt/api/get/congis`,
            {
                ...params
            },
            {
                ...params
            }
        );
        return serviceData.data;
    }
    async getPromptList(params: PromptListParams) {
        const serviceData = await http.post<PromptItem[]>(
            `/prompt/api/lst`,
            {
                ...params
            },
            {
                ...params
            },
            {
                showToast: true
            }
        );
        return serviceData.data;
    }
    async getUserLikeList(params: PromptListParams) {
        const serviceData = await http.post<PromptItem[]>(
            `/prompt/api/tuck/lst`,
            {
                ...params
            },
            {
                ...params
            },
            {
                showToast: true
            }
        );
        return serviceData.data;
    }
    async likePrompt(params: {
        uid: string;
        promptId: string;
        actType?: 0 /**copy */;
        showToast?: boolean;
    }) {
        const serviceData = await http.post<PromptItem>(
            `/prompt/api/tuck`,
            {
                ...params
            },
            {
                ...params
            },
            {
                showToast: params.showToast || false
            }
        );
        uni.hideLoading();
        return serviceData.data;
    }
}
export const communityService = () => {
    return {
        service: new CommunityService()
    };
};
