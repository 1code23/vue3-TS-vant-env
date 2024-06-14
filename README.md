# traffic_card

签到领奖活动H5

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


npm run build:prod正式环境打包
npm run build:stage测试环境打包

.env.development 文件一定要有 一定要有
.env.production  文件
.env.staging    文件

newHttp.js文件中 代码片段 baseURL: process.env.VUE_APP_BASE_API2,//根据env环境判断
以上几个文件是案例


vue3+ts+webpack兼容低版本谷歌浏览器  https://blog.csdn.net/treasurecp/article/details/138624681  assets文件中pic有截图

