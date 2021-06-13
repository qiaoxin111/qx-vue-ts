import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

createApp(App).use(ElementPlus).use(Antd).use(store).use(router).mount("#app");
