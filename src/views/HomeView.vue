<template>
  <div>
    <div v-if="loading" class="loading-overlay"></div>
    <div v-if="loading" class="loading-spinner">
      <van-loading size="64px" text-size="18px" text-color="#fff" vertical
        >加载中...</van-loading
      >
    </div>
    <img
      src="../assets/pic/img01@2x.png"
      alt=""
      srcset=""
      style="width: 100%"
    />
    <div class="pageBox">
      <div class="submitBox">
        <div class="inputBox">
          <div class="noticeBarBox">
            <!-- <van-notice-bar
           scrollable 
           speed="30"
           text="张**21秒前已提交领取"
           style="background-color: #fff;"
          /> -->
          </div>
          <div class="nameBox">
            <van-cell-group inset>
              <van-field
                v-model="formData.userName"
                required
                label="领卡姓名"
                clearable
                placeholder="办理人姓名（已加密）"
              />
              <van-field
                v-model="formData.mobile"
                required
                label="联系电话"
                clearable
                placeholder="有效联系电话并保持畅通"
                style="margin: 10px 0"
              />
              <van-field
                v-show="isShowAddress"
                v-model="formData.idCard"
                required
                label="证件号码"
                clearable
                placeholder="办理人身份证号（已加密）"
                style="margin: 10px 0"
              />
              <van-field
                v-model="formData.result"
                required
                name="area"
                label="邮寄地址"
                placeholder="点击选择省市区"
                @click="showArea = true"
                v-show="isShowAddress"
              />
              <van-popup :show="showArea" position="bottom">
                <van-area
                  :area-list="areaArr"
                  @confirm="onConfirm"
                  @cancel="showArea = false"
                />
              </van-popup>

              <van-field
                v-show="isShowAddress"
                v-model="formData.address"
                required
                label="详细地址"
                clearable
                placeholder="输入详细地址"
                style="margin: 10px 0"
              />
            </van-cell-group>
          </div>
          <div class="submitBtn" @click="getAwardBtn">立即领取</div>
          <div class="privacyBox">
            <van-checkbox
              v-model="checked"
              checked-color="#1a66ff"
              icon-size="15px"
            ></van-checkbox>
            <span style="margin-left: 8px"
              >提交即视为阅读并同意<span @click="goDetailUrl(1)"
                >《个人信息保护政策》</span
              >
              和<span @click="goDetailUrl(2)">《入网许可协议》</span></span
            >
          </div>
          <div class="privacyBox1">
            <van-icon name="warning-o" size="15" color="#FF3D13" />
            <span style="margin-left: 8px"
              >激活业务后可在此查看优惠券，具体活动规则参见购买须知</span
            >
          </div>
        </div>
      </div>
    </div>
    <img
      src="../assets/pic/img02@2x.png"
      alt=""
      srcset=""
      style="width: 100%"
    />
    <img
      src="../assets/pic/img03.png"
      alt=""
      srcset=""
      style="width: 100%; margin-top: -5px"
    />
    <!-- <span class="linkClass" @click="gourl">https://cdn-hw.adroi.com.cn/h5/scard/index.html</span> -->
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref,reactive } from "vue";
import {
  showLoadingToast,
  closeToast,
  showSuccessToast,
  showFailToast,
} from "vant";

import { getAward } from "@/common/api.js";
import { areaList } from "@vant/area-data";
//引入路由
import {
  useRoute,
  useRouter,
  RouteLocationNormalized,
  LocationQueryValueRaw,
} from "vue-router";
//定义路由
const route = useRoute();
const router = useRouter();
// const goDetailUrl = (val: LocationQueryValueRaw | LocationQueryValueRaw[]) => {
const goDetailUrl = (val: number) => {
  router.push({ path: "/networkAccess", query: { type: val } });
};
const formData=reactive({
  userName:'',
  mobile:'',
  result:'',
  idCard:'',
  address:''
})
const loading = ref(false);
const checked = ref(false);
const areaArr = ref({
  province_list: areaList.province_list,
  // province_list:{440000:"广东省"},//目前只支持广东省
  city_list: areaList.city_list,
  county_list: areaList.county_list,
});
const showArea = ref(false);
const isShowAddress = ref(false);

// selectedOptions格式为对象 对象中的selectedOptions字段为数组 数组中的text字段为字符串
// const selectedOptions = ref({
//   selectedOptions:[{text:'北京'}],
//   selectedIndexes:[1,2,4],
//   selectedValues:[101,102,1044],
// })
// 地址保存
const onConfirm = (selectedOptions: {
  selectedOptions: Array<{ text: string }>;
}) => {
  showArea.value = false;
  formData.result= selectedOptions.selectedOptions
    .map((item) => item.text)
    .join("/");
};
// 提交信息
const getAwardBtn = async () => {
  if (!formData.userName || !formData.mobile) {
    showFailToast("请填写办理人信息");
    return;
  }
  let pattern = /^1[0-9]{10}$/;
  if (!pattern.test(formData.mobile)) {
    showFailToast("请填写合法的手机号");
    return;
  }
  if (!isShowAddress.value) {
    isShowAddress.value = true;
    return;
  }
  let idCardCheck = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardCheck.test(formData.idCard)) {
    showFailToast("请填写合法身份证号码");
    return;
  }
  if (!checked.value) {
    showFailToast("请先阅读个人信息保护政策");
    return;
  }
  if (!formData.result) {
    showFailToast("请选择省市区");
    return;
  }
  if (!formData.address) {
    showFailToast("请填写详细地址");
    return;
  }
  loading.value = true;
  const res = await getAward({
    name: formData.userName,
    mobile: formData.mobile,
    addr: formData.address,
    idCard: formData.idCard,
    province: formData.result.split("/")[0],
    city: formData.result.split("/")[1],
    region: formData.result.split("/")[2],
  });
  if (res&& 'data' in res&&res.data&&res.data.code == 200) {
    loading.value = false;
    showSuccessToast(res.data.msg);
  } else {
    loading.value = false;
    showFailToast(res && 'data' in res ? res.data.msg : '请求错误');
  }
};
function greet1(name: string): string {
  return `Hello, ${name}!`;
}
const message1: string = greet1('John');
console.log(message1,8787); // Output: "Hello, John!"
// let numberLength: number = <number>length; // Using <type> syntax
// let stringLength: number = length as number; // Using "as type" syntax
// let ss=length+2
// console.log(numberLength+stringLength,999,ss)

let length: any = 5;
function greet(name: number): number {
  return name;
}
let stringLength: number = length as number; // Using "as type" syntax
stringLength.toFixed()
const message: number = greet(length);
console.log(message)


onMounted(async () => {
 
  // interface Person {
  //   name: string;
  //   age ?: number;
  //   [propName: string]: string | number | undefined;
  // }

  // let tom: Person = {
  //   name: 'Tom',
  //   age: 25,
  //   gender: 'male'
  // };
  // console.log(tom,111)

  // const x = {
  //   a:1,
  //   b:2,
  //   c:3
  // }
  // const key="a"
  // console.log(x[key])

  // let listObject: Array<object> = [{key:1}];
  // let listNumber: Array<number> = [1,2,3];
  // let listNumber: number[] = [1,2,3];//常用的写法
  // let listString: Array<string> = ['1','2','3'];
  // let listLength: [string, number];
  // listLength = ['name',26]
  // let arr: ReadonlyArray<number>=listNumber //只读数组
  // console.log(arr,111)

  // enum Color {Red, Green, Blue}
  // let colorName: string = Color[0];
  // console.log(colorName,'enu枚举');  // 显示'Red' 因为上面代码里它的值是1

  // enum Color1 {Red=1, Green, Blue}
  // let colorName1: string = Color1[2];
  // console.log(colorName1,'enu枚举');  // 显示'Green' 因为上面代码里它的值是1

  // let notSure: any = 4;
  // notSure = "maybe a string instead";
  // notSure = false; // okay, definitely a boolean
  // notSure.ifItExists(); // 这里notSure没有ifItExists方法就会报错 okay, ifItExists might exist at runtime
  // notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)


  // let someValue: any = "this is a string";
  // let strLength: number = (someValue as string).length;  //可以理解为 someValue看做string类型
  // console.log(strLength)
  
  // const numbers= [1, 2, 3, 4, 5];
  // const sum = numbers.reduce((accumulator, currentValue) => {
  //   return accumulator + currentValue;
  // }, 0);
  // console.log(sum); // 输出：15
  // // const sum1 = numbers.reduce('回调函数callback', '初始值');
  // // const sum1 = numbers.reduce(('累计值','当前值','当前索引','原始数组') => {
  
  // // }, 0);
  // const sum1= numbers.reduce((s,value,key,arr) => {
  //   console.log(s,value,key,arr)
  //   return s+value
  // }, 0);
  const numbers = [8, 3, 5, 1, 9];
  // 正无穷大 Infinity ，负无穷大 -Infinity
  const max = numbers.reduce((max,value)=>{
    return value>max?value:max
  },-Infinity)
  const min = numbers.reduce((min,value)=>{
    return value<min?value:min
  },Infinity)
  console.log('最大值为：'+ max,'最小值为：'+ min); // 输出：9

  // array.reduce(callback, initialValue);
  // reduce() 是 JavaScript 数组的高阶函数之一，它可以用于对数组中的元素进行迭代，并根据每个元素进行累积计算，最终返回一个单一的值。
  // reduce() 方法接受两个参数：回调函数和可选的初始值。回调函数又有四个参数：累计值（accumulator）、当前值（current value）、当前索引（current index）和原始数组（array）。
  // callback：一个函数，用于对数组中的每个元素进行处理。它接受四个参数：
  // accumulator：累计值，即上一次回调函数的返回值或初始值（如果提供了初始值）。
  // currentValue：当前元素的值。
  // currentIndex：当前元素的索引（可选）。
  // array：原始数组（可选）。
  // initialValue（可选）：作为第一次调用回调函数时的累计值。如果不提供初始值，则使用数组的第一个元素作为初始值，并从第二个元素开始迭代。
  
});
</script>
<style scoped lang="less">
.pageBox {
  width: 100%;
  background: #1a66ff;
  // background: #ff741a;
  padding: 10px 0;
  // background: #f8f8f8 url("~@/assets/imgs/img01.jpg") no-repeat center;
  // position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -5px;
}
.submitBox {
  // position: absolute;
  // top: 210px;
  width: 328px;
  min-height: 290px;
  background: #fff;
  border-radius: 30px;
  display: flex;
  justify-content: center;

  .inputBox {
    width: 298px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 0 25px 0;
    box-sizing: border-box;
    .noticeBarBox {
      width: 100%;
    }
    .van-cell {
      background: #aae3ff;
    }
    .submitBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      width: 165px;
      height: 47px;
      // background: linear-gradient(180deg, #ff3010 0%, #ffa66b 100%);
      // box-shadow: 0px 1px 1px 0px rgba(209, 104, 21, 0.4);
      border-radius: 24px 24px 24px 24px;
      // border: 1px solid;
      // border-image: linear-gradient(
      //     180deg,
      //     rgba(254.00000005960464, 227.00000166893005, 183.00000429153442, 1),
      //     rgba(255, 253.5441157221794, 249.35841232538223, 1)
      //   )
      //   1 1;
      background: linear-gradient(180deg, #1a66ff 0%, #6bebff 100%);
      box-shadow: 0px 1px 1px 0px rgba(26, 102, 255, 0.2);
      border-image: linear-gradient(
          180deg,
          rgba(170.0000050663948, 227.00000166893005, 255, 1),
          rgba(255, 253.5441157221794, 249.35841232538223, 1)
        )
        1 1;
    }
    .privacyBox {
      margin: 17px 0 6px;
      box-sizing: border-box;
      font-weight: 400;
      font-size: 9px;
      color: #3d3d3d;
      width: 98%;
      display: flex;
    }
    .privacyBox1 {
      font-size: 9px;
      width: 98%;
      color: #ff3d13;
      display: flex;
      align-items: center;
    }
  }
}
.loading-overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading-spinner {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<style lang="less">
.van-popup .van-popup--center .van-toast .van-toast--middle .van-toast--fail {
  background: #fff !important;
}
.van-field .van-field__control::placeholder {
  color: #859299; /* 自定义颜色 */
  background: #aae3ff;
}
.inputBox {
  i {
    color: #333;
  }
}
</style>
