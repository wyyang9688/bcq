import { http, ajax } from "@/http/http";
export interface PromptSendParams {
    promptType: string;
    promptWord: string;
    promptModel: string;
    promptLabel?: string;
    imageId?: string;

    promptTitle: string;
}
class PubllishService {
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
    async submit(params: PromptSendParams) {
        const serviceData = await ajax.post<AnyObject>(
            `/prompt/api/send`,
            {
                ...params
            },
            {
                ...params
            },
            {
                showToast: true,
                needLogin: true
            }
        );
        return serviceData.data;
    }
}
export const publishService = () => {
    return {
        service: new PubllishService()
    };
};
