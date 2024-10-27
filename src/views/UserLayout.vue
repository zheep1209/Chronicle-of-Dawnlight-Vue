<script setup>
import { onMounted, ref, watch } from "vue";
import { getUser } from "@/API/UserAPI.js";
import router from "@/router/index.js";
import UserInfoCard from "@/components/UserInfoCard.vue";

let userData = ref({}); // 初始化为一个空对象
let activeIndex = ref("/article"); // 初始化默认值

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    await router.push('/login');
  } else {
    try {
      const result = await getUser();
      if (result.code !== 1) {
        localStorage.clear("token");
        await router.push('/login');
      }
      userData.value = result.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
});

// 监听路由变化，更新 activeIndex
watch(() => router.currentRoute.value.path, (newPath) => {
  activeIndex.value = newPath;
}, { immediate: true });
</script>

<template>
  <div class="home">
    <div class="tarBar">
      <h3>Alba Log</h3>
      <div class="userCard"><UserInfoCard :user-data="userData"></UserInfoCard></div>
      <el-menu
          :ellipsis="false"
          :router="true"
          style=";background-color: #fffffa;border: none;"
          :default-active="activeIndex"
          mode="horizontal">
        <el-menu-item index="/article">
          <template #title>文章</template>
        </el-menu-item>
        <el-menu-item index="/bill">
          <template #title>账单</template>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view v-slot="{ Component }">
      <transition :name="router.currentRoute.value.path === '/bill' ? 'slide-right' : 'slide-left'" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>

@media (max-width: 800px){
  .tarBar{
    height: 100px !important;
    .userCard{
      top: 0 !important;
      right: 0 !important;
    }
    .el-menu{
      position: absolute;
      bottom: 0;
      background-color: #fffffa !important;
    }
  }
}
.home {
  height: 100vh;
  .tarBar {
    background-color: #fffffa;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    position: relative;
    box-shadow: 0 0 10px 1px #e5e5e5;
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
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
