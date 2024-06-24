import { ConfigEnv, defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import Import from "unplugin-auto-import/vite";
import { getConfig } from "./config/cfg";

const getViteConfig = (configEnv: ConfigEnv) => {
    const { mode } = configEnv;

    const option = {
        plugins: [
            uni(),
            Import({
                imports: ["vue", "vue-router"],
                dts: "./import.d.ts",
                eslintrc: {
                    enabled: false,
                    filepath: "./.eslintrc-auto-import.json",
                    globalsPropValue: true
                }
            })
        ],
        define: {
            "import.meta.env.config": JSON.stringify(getConfig())
        },
        build: {
            target: "es6"
        },
        esbuild: {}
    };
    if (mode !== "development") {
        option.esbuild = {
            // drop: ["console", "debugger"]
        };
    }
    return option;
};
// https://vitejs.dev/config/
export default defineConfig((configEnv: ConfigEnv) => getViteConfig(configEnv));
