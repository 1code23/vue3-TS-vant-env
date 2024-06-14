import request from "./newHttp"; //加密请求封装
// import request from "./request"; //不加密请求封装
// 提交信息领取
export function getAward(params) {
  return request("post", "/scard/order", params)
  // return request("post", "/api/scard/order", params)
}
