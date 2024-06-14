const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer : {
    proxy : {
      '/api' : {
          target : 'http://121.37.174.69:9081',//测试环境
            changeOrigin : true,
            pathRewrite: {
            '^/api': ''
            }
        }
    }
  }
})
