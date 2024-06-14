<template>
  <div>
    <div v-if="loading" class="loading-overlay"></div>
    <div v-if="loading" class="loading-spinner">
      <van-loading size="64px" text-size="18px" text-color="#fff" vertical>加载中...</van-loading>
    </div>
  <img src="../assets/pic/img01@2x.png" alt="" srcset="" style="width: 100%;">
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
              v-model="userName"
              required
              label="领卡姓名"
              clearable
              placeholder="办理人姓名（已加密）"
            />
            <van-field
              v-model="mobile"
              required
              label="联系电话"
              clearable
              placeholder="有效联系电话并保持畅通"
              style="margin: 10px 0;"
            />
            <van-field
             v-show="isShowAddress"
              v-model="idCard"
              required
              label="证件号码"
              clearable
              placeholder="办理人身份证号（已加密）"
              style="margin: 10px 0;"
            />
            <van-field
              v-model="result"
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
              v-model="address"
              required
              label="详细地址"
              clearable
              placeholder="输入详细地址"
              style="margin: 10px 0;"
            />
       </van-cell-group>
        </div>
        <div class="submitBtn" @click="getAward">立即领取</div>
        <div class="privacyBox">
          <van-checkbox
            v-model="checked"
            checked-color="#1a66ff"
            icon-size="15px"
            ></van-checkbox
          >
          <span style="margin-left: 8px;">提交即视为阅读并同意<span @click="goDetailUrl(1)">《个人信息保护政策》</span>  和<span @click="goDetailUrl(2)">《入网许可协议》</span></span>
        </div>
        <div class="privacyBox1">
          <van-icon name="warning-o" size="15" color="#FF3D13" />
          <span style="margin-left: 8px;">激活业务后可在此查看优惠券，具体活动规则参见购买须知</span>
        </div>
      </div>
    </div>
  </div>
  <img src="../assets/pic/img02@2x.png" alt="" srcset="" style="width: 100%;">   
  <img src="../assets/pic/img03.png" alt="" srcset="" style="width: 100%;margin-top: -5px;">   
  <!-- <span class="linkClass" @click="gourl">https://cdn-hw.adroi.com.cn/h5/scard/index.html</span> -->
</div>
</template>

<script >
import { defineComponent } from "vue";
import {
  showLoadingToast,
  closeToast,
  showSuccessToast,
  showFailToast,
} from "vant";

import { getAward } from "@/common/api.js";
import { areaList } from '@vant/area-data';
export default defineComponent({
  name: "HomeView",
  created() {
  },
  data() {
    return {
      loading:false,
      checked: false,
      userName:'',
      mobile:'',
      result: '',
      areaArr:{
        province_list:areaList.province_list,
        // province_list:{440000:"广东省"},//目前只支持广东省
        city_list:areaList.city_list,
        county_list:areaList.county_list,
      },
      showArea:false,
      isShowAddress:false,
      address:'',
      idCard:'',
    };
  },
  computed: {},
  methods: {
    onConfirm(selectedOptions){
      this.showArea=false
      this.result=selectedOptions.selectedOptions.map((item) => item.text).join('/')
    },
    // 提交
    async getAward() {
      if(!this.userName||!this.mobile){
        showFailToast("请填写办理人信息");
        return
      }
      let pattern = /^1[0-9]{10}$/;
      if(!pattern.test(this.mobile)){
        showFailToast("请填写合法的手机号"); 
        return
      }
      if(!this.isShowAddress){
        this.isShowAddress=true
        return
      }
      let idCardCheck = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(!idCardCheck.test(this.idCard)){
        showFailToast("请填写合法身份证号码");
        return
      }
      if(!this.checked){
        showFailToast("请先阅读个人信息保护政策");
        return
      }
      if(!this.result){
        showFailToast("请选择省市区");
        return
      }
      if(!this.address){
        showFailToast("请填写详细地址");
        return
      }
      this.loading=true
       const res = await getAward({
        name:this.userName,
        mobile:this.mobile,
        addr:this.address,
        idCard:this.idCard,
        province:this.result.split('/')[0],
        city:this.result.split('/')[1],
        region:this.result.split('/')[2],
       });
      if (res.data.code == 200) {
        this.loading=false
        showSuccessToast(res.data.msg);
      } else{
        this.loading=false
        showFailToast(res.data.msg)
      }
    },
    gourl(){
      this.$router.replace({ path: this.$route.path });
    },
    goDetailUrl(val){
      this.$router.push({ path: '/networkAccess',query:{type:val} });
    },
  },
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
    .noticeBarBox{
      width: 100%;
    }
    .van-cell{
      background: #AAE3FF;
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
        background: linear-gradient( 180deg, #1A66FF 0%, #6BEBFF 100%);
        box-shadow: 0px 1px 1px 0px rgba(26,102,255,0.2);
        border-image: linear-gradient(180deg, rgba(170.0000050663948, 227.00000166893005, 255, 1), rgba(255, 253.5441157221794, 249.35841232538223, 1)) 1 1;
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
.van-popup .van-popup--center .van-toast .van-toast--middle .van-toast--fail{
  background: #fff !important;
}
.van-field .van-field__control::placeholder {
  color: #859299; /* 自定义颜色 */
  background: #AAE3FF;
}
.inputBox{
i{
    color: #333 ; 
  }
}

</style>
