<template>
  <div>
    <div class="headBox">
      <div class="iconBox"><van-icon @click="goBack" name="down" class="iconBack" size="20"/></div>
      <div class="titlebox">{{ isNetworkAccess?'入网协议':'隐私协议' }}</div>
    </div>
    <img src="../assets/pic/img04.png" v-if="isNetworkAccess" alt="" class="imgBox">
    <img src="../assets/pic/img05.png" v-if="!isNetworkAccess" alt="" class="imgBox">
  </div>
</template>

<script setup>
import { onMounted,ref} from 'vue'
//引入路由
import { useRoute,useRouter } from 'vue-router'
//定义路由
const route = useRoute()
const router = useRouter()
let isNetworkAccess=ref(false)
//周期函数，获取页面传递的数据
onMounted(async () => {
  isNetworkAccess.value=route.query.type==2?true:false
})
const goBack=()=>{
  router.go(-1);
}
</script>

<style scoped lang="less">
.headBox{
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  background: #fff;
}
.iconBack{
  transform: rotate(-270deg);
}
.iconBox{
  width: 20%;
  padding-left: 5%;
}
.titlebox{
  font-weight: 400;
  font-size: 18px;
  color: #000000;
  width: 50%;
  display: flex;
  justify-content: center;
}
  .imgBox{
    width: 100%;
    height: 100%;
  }
</style>