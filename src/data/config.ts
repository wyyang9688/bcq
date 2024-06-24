export const getConfig = (): ImportMetaEnv => {
    return {
        ...import.meta.env.config,
        ...{ $name: "miniPro" },
        imgBasicUrl: import.meta.env.config.BASE_URL + "/prompt/api/image/"
    };
};
