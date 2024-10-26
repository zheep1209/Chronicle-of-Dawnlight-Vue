<script setup>
import { onMounted, ref } from "vue";
import { getUser } from "@/API/Tools.js";
import router from "@/router/index.js";
import UserInfoCard from "@/components/UserInfoCard.vue";

let userData = ref({}); // 初始化为一个空对象

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    await router.push('/login');
  } else {
    try {
      const result = await getUser();
      if (result.code === 0) {
        localStorage.clear("token");
        await router.push('/login');
      }
      userData.value = result.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
});
</script>

<template>
  <div class="home">
    <div class="tarBar">
      <h3>Alba Log</h3>
      <div class="userCard"><UserInfoCard :user-data="userData"></UserInfoCard></div>
      <el-menu
          style="width: 220px;background-color: #fffffa;border: none;"
          :default-active="activeIndex"
          mode="horizontal">
        <el-menu-item index="1">
          <template #title>文章</template>
        </el-menu-item>
        <el-menu-item index="2">
          <template #title>账单</template>
        </el-menu-item>
      </el-menu>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.home {
  height: 100vh;
  .tarBar{
    background-color: #fffffa;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    position: relative;
    box-shadow: 0 0 10px 1px #e5e5e5;
    justify-content: center;
    h3{
      position: absolute;
      top: 10px;
      left: 20px;
      letter-spacing: 5px
    }
    .userCard{
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>
