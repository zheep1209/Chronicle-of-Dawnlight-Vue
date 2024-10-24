<script setup>
import LoginAndRegLayout from "@/components/LoginAndRegLayout.vue";


</script>

<template>
<LoginAndRegLayout>
<div class="register">
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :label-position="labelPosition"
      label-width="auto"
      status-icon
      style="max-width: 600px"
  >
    <div class="title">Dawnlight Log 注册</div>
    <div class="input-item"><span>邮　箱</span><input type="text" name="" id=""></div>
    <div class="input-item"><span>验证码</span><input type="text" name="" id="">
      <button class="getCode" type='button'>获取</button>
    </div>
    <div class="input-item"><span>用户名</span><input type="text" name="" id=""></div>
    <div class="input-item"><span>密　码</span><input type="password"  name="" id=""></div>
      <div class="button-group">
        <button type='button'>注册</button><button type='button' @click="event.preventDefault()">返回</button>
      </div>
  </el-form>
</div>
</LoginAndRegLayout>
</template>

<style scoped lang="scss">
.register{
  box-sizing: border-box;
  padding: 50px 50px 50px 0;
  .el-form{
    .title{
      text-align: center;
      font-size: 25px;
      padding-bottom: 50px;
    }
    .input-item{
      position: relative;
      display: flex;
      padding-bottom: 30px;
      span{
        box-sizing: border-box;
        padding-right: 20px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }
      input{
        width: 70%;
        border-bottom: 1px #ea3081 solid;
      }
      .getCode{
        position: absolute;
        right: 20px;
        color: #ea3081;
      }
    }
    .button-group{
      width: 100%;
      display: flex;
      justify-content: space-between;
      button{
        width: 100px;
        height: 34px;
        border-radius: 17px;
        background-color: #ff82ba;
        color: white;
      }
      button:nth-child(2){
        box-sizing: border-box;
        border: 1px #a7a7a7 solid;
        background-color: #fff;
        color: #a7a7a7;
      }
    }
  }
}
</style>