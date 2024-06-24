import { http, ajax } from "@/http/http";
export interface PromptSendParams {
    promptType: string;
    promptWord: string;
    promptModel: string;
    promptLabel?: string;
    imageId?: string;

    promptTitle: string;
}
import type { BaseData } from "@/http/http";
class MyService {
    async getOptions(params: { type: string; promptType?: string | number }) {
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
    async updateImg(params: { uid: string; name?: string; headImg?: string }) {
        const serviceData = await ajax.post<BaseData<AnyObject>>(
            `/prompt/api/acc/upt`,
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
}
export const myService = () => {
    return {
        service: new MyService()
    };
};
