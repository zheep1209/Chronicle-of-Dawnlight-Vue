<script setup>
// 获取邮箱验证码
import {getCode} from "@/API/Tools.js";
import {ElMessage} from "element-plus";
const props = defineProps({
  email: {
    type: String,
    required: true
  }
});
const getEmailCode = async ()=>{
  const result =await getCode({email : props.email})
  console.log(result)
  if (result.code === 0){
    ElMessage({
      message:result.msg,
      type:'error'
    })
  }else {
    ElMessage({
      message:"发送成功",
      type:'success'
    })
  }
}
</script>

<template>
  <button class="getCode" type='button' @click="getEmailCode">获取</button>
</template>

<style scoped lang="scss">
.getCode{
  position: absolute;
  right: 20px;
  color: #ea3081;
}
</style>