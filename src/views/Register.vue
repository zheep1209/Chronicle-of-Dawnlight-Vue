<script setup>
  import LoginAndRegLayout from "@/components/LoginAndRegLayout.vue";
  import {ref} from "vue";
  import {getCode, register} from "@/API/Tools.js";
  import {ElMessage} from "element-plus";
  let registerForm = ref()
  registerForm.value = {
    email:"",
    code:"",
    username:"",
    password:""
  }
  // 定义校验规则
  const rules = {
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    code: {
      required: true
    },
    username: {
      required: true,
      pattern: /^[a-zA-Z0-9_-]{3,20}$/
    },
    password: {
      required: true,
      pattern: /^[a-zA-Z0-9]{6,20}$/
    }
  };

  // 校验单个字段
  const validateField = (field) => {
    const rule = rules[field];
    if (rule.required && !registerForm.value[field]) {
      ElMessage({
        message: `${field} 不能为空`,
        type: 'error'
      });
      return false;
    }
    if (rule.pattern && !rule.pattern.test(registerForm.value[field])) {
      ElMessage({
        message: `${field} 格式不正确`,
        type: 'error'
      });
      return false;
    }
    return true;
  };

  // 提交表单
  const commitRegister = async () => {
    const fields = ['email', 'code', 'username', 'password'];
    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      console.log('注册表单数据:', registerForm.value)
      const result = await register(registerForm.value,registerForm.value.code)
      console.log(result)
      ElMessage({
        message: '注册成功',
        type: 'success'
      });
    }
  };

  // 获取邮箱验证码
  const getEmailCode = async ()=>{
    const result =await getCode({email : registerForm.value.email})
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
<LoginAndRegLayout>
<div class="register">
    <label>
      <div class="title">Dawnlight Log 注册</div>
      <div class="input-item"><span>邮　箱</span><input  v-model="registerForm.email" type="text" id="email"></div>
      <div class="input-item"><span>验证码</span><input v-model="registerForm.code" type="text" id="code">
        <button class="getCode" type='button' @click="getEmailCode">获取</button>
      </div>
      <div class="input-item"><span>用户名</span><input placeholder="3~20 字母 数字 '_' 和 '-'" v-model="registerForm.username" type="text" id="username" autocomplete="username"></div>
      <div class="input-item"><span>密　码</span><input placeholder="6-20" v-model="registerForm.password" type="password" id="password" autocomplete="current-password" ></div>
      <div class="button-group">
        <button type='button' @click="commitRegister">注册</button>
        <button type='button'>返回</button>
      </div>
    </label>
</div>
</LoginAndRegLayout>
</template>

<style scoped lang="scss">
.register{
  box-sizing: border-box;
  padding: 50px 50px 50px 0;
  label{
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