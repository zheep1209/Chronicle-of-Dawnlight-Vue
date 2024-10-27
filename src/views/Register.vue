<script setup>
import '@/assets/style/login&registerStyle.scss'
import LoginAndRegLayout from "@/components/LoginAndRegLayout.vue";
import GetCode from "@/components/GetCodeComponent.vue";
import {ref} from "vue";
import {register} from "@/API/UserAPI.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";

let registerForm = ref()
registerForm.value = {
  email: "",
  code: "",
  username: "",
  password: ""
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
    const result = await register(registerForm.value, registerForm.value.code)
    if (result.code === 1) {
      ElMessage({
        message: "注册成功",
        type: "success"
      })
      this.$router.push('/login')
    } else {
      ElMessage({
        message: result.msg,
        type: "error"
      })
    }
  }
};
const backToHome = () => {
  router.push('/')
}

</script>
<template>
  <LoginAndRegLayout>
    <div class="register">
      <label>
        <span class="title">Dawnlight Log 注册</span>
        <span class="input-item"><span>邮　箱</span><input id="email" v-model="registerForm.email" type="text"></span>
        <span class="input-item"><span>验证码</span><input id="code" v-model="registerForm.code" type="text">
        <GetCode :email="registerForm.email"></GetCode>
      </span>
        <span class="input-item"><span>用户名</span><input id="username"
                                                           v-model="registerForm.username" autocomplete="username" placeholder="3~20 字母 数字 '_' 和 '-'"
                                                           type="text"></span>
        <span class="input-item"><span>密　码</span><input id="password" v-model="registerForm.password"
                                                          autocomplete="current-password" placeholder="6-20" type="password"></span>
        <span class="button-group">
        <button type='button' @click="commitRegister">注册</button>
        <button @click="backToHome">返回</button>
      </span>
      </label>
    </div>
  </LoginAndRegLayout>
</template>