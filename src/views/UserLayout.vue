<script setup>
import { onMounted, ref, watch } from "vue";
import { getUser } from "@/API/UserAPI.js";
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
}, { immediate: true });
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
          mode="horizontal"
          style="background-color: #fffffa; border: none;">
        <el-menu-item index="/article">
          <template #title>文章</template>
        </el-menu-item>
        <el-menu-item index="/bill">
          <template #title>账单</template>
        </el-menu-item>
      </el-menu>
    </div>
    <RouterView v-slot="{ Component }" >
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </RouterView>
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

.home {
  height: 100vh;

  .tarBar {
    background-color: $primary-color;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    position: relative;
    box-shadow: 0 0 10px 1px $shadow-color;
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
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0; /* 初始状态为透明 */
}

</style>
