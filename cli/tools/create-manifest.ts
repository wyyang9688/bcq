import { outputJSON } from "fs-extra";
import { join } from "node:path";
import { getConfig } from "../../config/cfg";
export async function createManifest() {
    const startTime = Date.now();
    console.log("正在准备manifest.json文件，请稍等...");
    const config = getConfig();
    if (!config) return false;
    const { APPID: appid } = config;
    const manifest = {
        name: "",
        appid: "",
        description: "",
        versionName: "1.0.0",
        versionCode: "100",
        transformPx: false,
        "mp-weixin": {
            appid,
            setting: {
                urlCheck: true,
                es6: true,
                postcss: true,
                minified: true
            },
            optimization: {
                subPackages: true
            },
            lazyCodeLoading: "requiredComponents",
            permission: {
                "scope.bluetooth": {
                    desc: "用于蓝牙连接设备"
                }
            }
            // plugins: getPlugin()
        },
        uniStatistics: {
            enable: false
        },
        vueVersion: "3"
    };
    try {
        await outputJSON(join("src", "manifest.json"), manifest, { spaces: 2 });
        console.log(
            `manifest.json文件创建成功，耗时${Date.now() - startTime}ms`
        );
        return true;
    } catch (error) {
        console.log("manifest.json文件创建失败");
        throw new Error(error);
    }
}

const getPlugin = () => {
    if (process.env.PROJECTENV === "master") {
        return {
            "coral-adv": {
                version: "1.0.23",
                provider: "wx0e203209e27b1e66"
            }
        };
    }
    return {};
};
