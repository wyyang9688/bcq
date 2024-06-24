import { http, ajax } from "@/http/http";
export interface GetPhoneNumberParams {
    eid: string;
    code?: string;
    wxSmallAppId?: string;
    alires?: string | undefined;
}
export interface ServiceData {
    code: number;
    data: string;
    msg: string;
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
interface loginServiceData {
    code: number;
    data: UserInfo;
    msg: string;
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
class loginService {
    async getPhoneNumber(params: GetPhoneNumberParams) {
        let url = "/prompt/api/wx/getphonenumber";
        if (!params.code) {
            url = "/prompt/api/wx/getaliphonenumber";
        }
        const serviceData = await ajax.get<string>(
            url,
            {
                ...params
            },
            {
                showToast: true
            }
        );
        return serviceData.data;
    }
    async loginIn(params: { pn: string; mode: number }) {
        const serviceData = await ajax.post<UserInfo>(
            `/prompt/api/acc/login`,
            {
                showToast: true,
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
export const useLoginService = () => {
    return {
        LoginService: new loginService()
    };
};
