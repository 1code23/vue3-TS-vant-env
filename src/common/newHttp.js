import axios from 'axios';
// import qs from 'querystring';
import qs from 'query-string';
import { showFailToast } from "vant";
import * as crypto from './crypto';

const instance = axios.create({
	baseURL: process.env.VUE_APP_BASE_API2,//根据env环境判断
  // baseURL: "http://192.168.48.162:9080",//后端开发人员ip
//   baseURL: "http://121.37.174.69:9081",//测试环境
  // baseURL: "https://ads-go.adroi.com.cn",//正式环境
	timeout: 60000 //30S延时
})
const buildEnv="production"  //development  production
/*
  拦截请求
*/
let instanceReq = {};
instance.interceptors.request.use(request => {
	// if(process.env.NODE_ENV == buildEnv){
		if( request.method == "post" || request.method == "put"){
			request.headers['Content-Type'] = 'text/plan';
		}
	// } else {//不加密
	// 	request.headers["c"] = "7191514"
	// 	request.headers["3967147432"] = "1965211367"
	// }

	instanceReq = request;
	return request;
}, function (error) {
	if (instanceReq && instanceReq.url.indexOf("userLog/allLog") == -1) {
		showFailToast('请求错误!' + error)
	}
	return false;
})

/*
  拦截响应
*/
instance.interceptors.response.use(res => {
	let data = res.data || {};
	//res.status 200成功，数据需要进行解密
	// if(res.status==200 && process.env.NODE_ENV == buildEnv){
		res.data = JSON.parse(crypto.Decrypt(data))
	// }
	// const test='8f51ykfH6r38vtk4MWmbC6LsdEciOY/qyXxnkdsciS52glvHFTXZsVkuymHreRUGL6LaVsbKpfDQOyuYrNHuNFhVzUplI741VXAKHBYD2UdvsZwMd0jb1K9Al9uAqKt7aEKRr/1/RA0sKtKab7Erork9t0mHVjTSRttP2TC7iVufLnEoue3OOdUt4+WqDh8JNjnaiTWxdNCb9k09aa5u5oOoEzATBXzSBe/BJO7JiWzfXRNLsgCWVHuux7HAM86/hTnVAoBtO5ncmoXuCLpnhrQKs1J7+Q12HYRvelOMbtB4Vj6k9F9I3txAXkBmzPidFuLbu3hkrkBM7UfJYPmP/c8vaupjQcIXWwR8vwZCZHg1uM+tJ76SYdUIn2A6JF9D7nXuxowsKeS9AvW5XBlRikShOmVKtjj98THA1Pg7TuO2WF9NePOmot0MmRDrA97oLqUhCsojsddK315NMDwMEWZ6SD7zfcEGokUXiWizmTuIQ7byYxrgN3wSyoCR3i1xSZsEHyBWFPXvOia32yIn/1xuEAdyZuZzJdIjAOqg5mQcD5aEi08n3ZXpH/a4oZ71WF12P+Qd2yMHLmJn5yvyub3RYF9EQpi/Xyy5a3VslvJwEblI1j3n2OFgPnPDFqr6NasYc28bICm5mfZiQsGYCXxemb5VR98RwKjgTZoPIwEzMXsbGGpmds2q14Z9OzVX+GPHuohmzYS5XId8NDaxMfhRVK7HM7nQ1Cse+tusuQvy/LGlzM3I4uKWaBNwM4q+K5LEfKCgA04K2TVhUhMLuA=='
	// console.log('JSON.parse(crypto.Decrypt(data))', JSON.parse(crypto.Decrypt(test)));
	
	return res
}, (error) => {
	// let errData=error.response.data


	let errData=error
	let message=errData.message||errData.msg
	showFailToast('请求错误!' + message)

	return false;
})

export default function (method, url, data = null,loading=true) {
		if (method == "get" || method == "delete") {
			if(data!=null){
				url+="?"+crypto.Encrypt(qs.stringify(data))
			}
		} else {
			data = crypto.Encrypt(JSON.stringify(data))
		}
	method = method.toLowerCase();
	switch (method) {
		case "post":
			return instance.post(url, data);
			break;
		case "get":
			return instance.get(url);
			break;
		case "delete":
			return instance.delete(url)
			break;
		case "put":
			return instance.put(url, data)
			break;
		default:
			console.error("未知的请求方式！" + method);
			return false;
			break;
	};
};
