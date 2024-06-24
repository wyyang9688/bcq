import { http, ajax } from "@/http/http";

export interface WatchTimeParams {
    courseItemId?: string | number;
    courseId?: string | number;
    watchRecordId?: string;
    viewDuration?: string | number;
}
export interface PromptSendParams {
    promptType: string;
    promptWord: string;
    promptModel: string;
    promptLabel?: string;
    imageId?: string;

    promptTitle: string;
}
export interface CourseListParams {
    iDisplayStart: number | string;
    iDisplayLength: number | string;
    hasCount: boolean;
    uid?: string;
    tuckuid?: string;
    promptId?: string;
    auditingSta?: 0 | 1 | 2;
    promptType?: number | string;
    promptLabel?: string;
    tuckFlag?: boolean;
    course?: {
        courseType?: string;
        id?: string;
        guessFlag?: number;
        [index: string]: string | undefined | number;
    };
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
export interface CItem {
    id: string;
    courseId: string;
    createTime: number;
    courseItemLinkUrl: string;
    courseItemUrl: string;
    courseItemNum: number;
    imageItemUrl: string;
}
export interface CourseItem {
    id: string;
    courseName: string;
    courseRemark: string;
    createTime: number;
    courseHeat: number;
    courseType: string;
    courseTypeName: string;
    downloadUrl: string;
    hotFlag: number;
    items: CItem[];
    imageUrl: string;
}
class CourseService {
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
    async getCourseList(params: CourseListParams, query?: CourseListParams) {
        const serviceData = await http.post<CourseItem[]>(
            `/prompt/api/course/lst`,
            {
                ...params
            },
            {
                ...query,
                course: ""
            },
            {
                showToast: true
            }
        );
        return serviceData.data;
    }
    async recordWatchTime(params: WatchTimeParams) {
        //设定时间
        const serviceData = await http.post<AnyObject>(
            `/prompt/api/course/watchrecord`,
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
    async getRecordWatchTime(params: WatchTimeParams) {
        //获取时间
        const serviceData = await http.post<{
            course: CourseItem;
            courseLst: CItem[];
            viewDuration?: number;
        }>(
            `/prompt/api/coursehis/info`,
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
    // async likePrompt(params: {
    //     uid: string;
    //     promptId: string;
    //     actType?: 0 /**copy */;
    //     showToast?: boolean;
    // }) {
    //     const serviceData = await http.post<PromptItem>(
    //         `/prompt/api/tuck`,
    //         {
    //             ...params
    //         },
    //         {
    //             ...params
    //         },
    //         {
    //             showToast: params.showToast || false
    //         }
    //     );
    //     uni.hideLoading();
    //     return serviceData.data;
    // }
}
export const courseService = () => {
    return {
        service: new CourseService()
    };
};
