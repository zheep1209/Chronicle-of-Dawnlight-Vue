<script setup>
import {onMounted, ref, watch} from "vue";
import {getUser} from "@/API/UserAPI.js";
import router from "@/router/index.js";
import UserInfoCard from "@/components/UserInfoCard.vue";

let userData = ref({}); // 初始化为一个空对象
let activeIndex = ref("/article"); // 初始化默认值

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    console.log("token存储错误");
    await router.push('/login');
  } else {
    try {
      const result = await getUser();
      if (result.code !== 1) {
        localStorage.clear("token");
        await router.push('/login');
      } else {
        userData.value = result.data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // 可以在这里添加更多的错误处理逻辑
    }
  }
});

// 监听路由变化，更新 activeIndex
watch(() => router.currentRoute.value.path, (newPath) => {
  activeIndex.value = newPath;
}, {immediate: true});
</script>

<template>
  <div class="home">
    <div class="tarBar">
      <h3>Alba Log</h3>
      <div class="userCard">
        <UserInfoCard :user-data="userData"></UserInfoCard>
      </div>
      <el-menu
          :default-active="activeIndex"
          :ellipsis="false"
          :router="true"
          background-color="background-color: rgba(255, 255, 255, 0.4);"
          mode="horizontal">
        <el-menu-item index="/article">
          <template #title>文章</template>
        </el-menu-item>
        <el-menu-item index="/bill">
          <template #title>账单</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-container">
      <RouterView v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component"/>
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-color: #fffffa;
$shadow-color: #e5e5e5;

@media (max-width: 800px) {
  .home {
    height: auto !important;
    border-radius: 0 !important;
    margin-top: 0 !important;
  }

  .tarBar {
    height: 100px !important;

    .userCard {
      top: 0 !important;
      right: 0 !important;
    }

    .el-menu {
      position: absolute;
      bottom: 0;
      background-color: $primary-color !important;
    }
  }
}

.home::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5); /* 半透明的白色蒙版 */
  z-index: 0; /* 确保蒙版在背景图之上 */
}
.home::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://img.picgo.net/2024/11/12/77813431_p0b492e65b887511a3.jpg") no-repeat center center;
  background-size: cover; /* 使背景图覆盖整个元素 */
  z-index: -1; /* 确保背景图在所有内容之下 */
}
.home {
  height: 100vh;
  position: relative; /* 确保伪元素相对于 .home 定位 */
  .content-container {
    position: relative;
    z-index: 2; /* 确保内容在蒙版之上 */
  }
  .tarBar {
    backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
    background-color: rgba(255, 255, 255, 0.8); /* 半透明的白色背景 */
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    justify-content: center;

    h3 {
      position: absolute;
      top: 10px;
      left: 20px;
      letter-spacing: 5px;
    }

    .userCard {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s; /* 调整过渡时间为0.5秒 */
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0; /* 初始状态为透明 */
}

</style>
