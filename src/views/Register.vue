<script setup>
import '@/assets/style/login&registerStyle.scss'
  import LoginAndRegLayout from "@/components/LoginAndRegLayout.vue";
import GetCode from "@/components/GetCodeComponent.vue";
  import {ref} from "vue";
  import {register} from "@/API/Tools.js";
  import {ElMessage} from "element-plus";
import router from "@/router/index.js";
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
      const result = await register(registerForm.value,registerForm.value.code)
      if (result.code===1){
        ElMessage({
          message: "注册成功",
          type: "success"
        })
        this.$router.push('/login')
      }else {
        ElMessage({
          message: result.msg,
          type: "error"
        })
      }
    }
  };
const back = ()=>{
  router.push('/')
}

</script>
<template>
<LoginAndRegLayout>
<div class="register">
    <label>
      <span class="title">Dawnlight Log 注册</span>
      <span class="input-item"><span>邮　箱</span><input  v-model="registerForm.email" type="text" id="email"></span>
      <span class="input-item"><span>验证码</span><input v-model="registerForm.code" type="text" id="code">
        <GetCode :email="registerForm.email"></GetCode>
      </span>
      <span class="input-item"><span>用户名</span><input placeholder="3~20 字母 数字 '_' 和 '-'" v-model="registerForm.username" type="text" id="username" autocomplete="username"></span>
      <span class="input-item"><span>密　码</span><input placeholder="6-20" v-model="registerForm.password" type="password" id="password" autocomplete="current-password" ></span>
      <span class="button-group">
        <button type='button' @click="commitRegister">注册</button>
        <button @click="back">返回</button>
      </span>
    </label>
</div>
</LoginAndRegLayout>
</template>