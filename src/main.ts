import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Popup, Toast, Checkbox,Icon,Field,Area,Loading } from "vant";
import "vant/lib/index.css";


const app = createApp(App);
app.component(Popup.name, Popup);
app.use(Toast);
app.use(Checkbox);
app.use(Icon);
app.use(Field);
app.use(Area);
app.use(Loading);
app.use(router);
app.mount("#app");
