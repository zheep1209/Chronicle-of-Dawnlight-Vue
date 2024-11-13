<script setup>
import '@/assets/style/login&registerStyle.scss'
import LoginAndRegLayout from "@/components/LoginAndRegLayout.vue";
import {onMounted, ref} from "vue";
import {loginByEmail, loginByPass} from "@/API/UserAPI.js"; // 导入两个登录接口
import {ElMessage} from "element-plus";
import GetCodeComponent from "@/components/GetCodeComponent.vue";
import router from "@/router/index.js";

const activeName = ref('first')
onMounted( async ()=>{
  if (localStorage.getItem("token")){
    await router.push('/article')
  }
})
let registerForm = ref({
  email: "",
  code: "",
  username: "",
  password: ""
})

// 定义校验规则
const rules = {
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 确保是正则表达式对象
  },
  code: {
    required: true
  },
  username: {
    required: true,
    pattern: /^[a-zA-Z0-9_-]{3,20}$/ // 确保是正则表达式对象
  },
  password: {
    required: true,
    pattern: /^[a-zA-Z0-9]{6,20}$/ // 确保是正则表达式对象
  }
}

// 校验单个字段
const validateField = (field) => {
  const rule = rules[field]
  if (!rule) return true // 如果没有规则，直接返回 true

  if (rule.required && !registerForm.value[field]) {
    ElMessage({
      message: `${field} 不能为空`,
      type: 'error'
    })
    return false
  }

  if (rule.pattern && !rule.pattern.test(registerForm.value[field])) {
    ElMessage({
      message: `${field} 格式不正确`,
      type: 'error'
    })
    return false
  }

  return true
}

// 校验用户名和密码
const validateUsernameAndPassword = () => {
  const fields = ['username', 'password']
  let isValid = true

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

// 校验邮箱和验证码
const validateEmailAndCode = () => {
  const fields = ['email', 'code']
  let isValid = true

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

// 提交表单
const commitLogin = async () => {
  if (activeName.value === 'first') {
    if (validateUsernameAndPassword()) {
      const result = await loginByPass(registerForm.value.username, registerForm.value.password)
      if (result.code===1){
        ElMessage({
          message: "登录成功",
          type: "success"
        })
        localStorage.setItem('token', result.data.Token);
        await router.push('/article')
      }else {
        ElMessage({
          message: result.msg,
          type: "error"
        })
      }

    }
  } else if (activeName.value === 'second') {
    if (validateEmailAndCode()) {
      const result = await loginByEmail(registerForm.value.email, registerForm.value.code)
      if (result.code===1){
        ElMessage({
          message: "登录成功",
          type: "success"
        })
        localStorage.setItem('token', result.data.Token);
        await router.push('/article')
      }else {
        ElMessage({
          message: result.msg,
          type: "error"
        })
      }
    }
  }
}
const backToHome  = ()=>{
  router.push("/")
}


</script>

<template>
  <LoginAndRegLayout>
    <div class="register">
      <label>
        <span class="title">Dawnlight Log 登录</span>
        <el-tabs v-model="activeName" class="demo-tabs" style="width: 300px;">
          <el-tab-pane label="密码登录" name="first">
            <div class="input-item"><span>用户名</span><input @keyup.enter="commitLogin" id="username" v-model="registerForm.username" type="text">
            </div>
            <div class="input-item"><span>密　码</span><input @keyup.enter="commitLogin" id="password" v-model="registerForm.password"
                                                             type="password"></div>
            <div class="button-group">
              <button type='button' @click="commitLogin">登录</button>
              <button @click="backToHome">返回</button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="邮箱登录" name="second">
            <div class="input-item"><span>邮　箱</span><input @keyup.enter="commitLogin" id="email" v-model="registerForm.email" type="text"></div>
            <div class="input-item"><span>验证码</span><input @keyup.enter="commitLogin" id="code" v-model="registerForm.code" type="text">
              <GetCodeComponent :email="registerForm.email"></GetCodeComponent>
            </div>
            <div class="button-group">
              <button type='button' @click="commitLogin">登录</button>
              <button @click="backToHome">返回</button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </label>
    </div>
  </LoginAndRegLayout>
</template>

<style lang="scss">
.el-tabs{
  //height: 200px;
  display: flex;
  align-items: center;
}
.el-tabs__item.is-active, .el-tabs__item:hover{
  color: #ff82ba;
}
.el-tabs__active-bar{
  background-color:#ff82ba;
}
</style>
