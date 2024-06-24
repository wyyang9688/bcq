import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import uviewPlus from "uview-plus";
// import Http from "./http/http";
import "uview-plus/index.scss";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createSSRApp(App);
app.use(pinia);
export function createApp() {
    app.use(uviewPlus);
    return {
        app,
        pinia
    };
}
