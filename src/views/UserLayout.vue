<script setup>
import {onMounted, ref, watch} from "vue";
import router from "@/router/index.js";
import UserInfoCard from "@/components/UserInfoCard.vue";
import useLoginStore from "@/stores/index.js";
import {showMessage} from "@/assets/script/utils.js";

const userAgent = navigator.userAgent;
if (/Mobi|Android/i.test(userAgent)) {
  showMessage("用电脑吧，我什么都原因做", "error")
  router.push("/");
}

let activeIndex = ref("/article"); // 初始化默认值
let userData = ref({}); // 初始化为一个空对象
const store = useLoginStore()
onMounted(async () => {
  if (!store.isLoggedIn) {
    console.log("未登录")
  }
  userData.value = store.getUserData
});


// 监听路由变化，更新 activeIndex
watch(() => router.currentRoute.value.path, (newPath) => {
  activeIndex.value = newPath;
}, {immediate: true});
</script>

<template>
  <div class="app">
    <div class="userCard">
      <UserInfoCard :user-data="userData"></UserInfoCard>
    </div>
    <div class="tarBar">
      <h3>Alba Log</h3>
      <el-menu
          :default-active="activeIndex"
          :ellipsis="false"
          :router="true"
          background-color="rgba(255, 255, 255, 0.4)"
          mode="horizontal">
        <el-menu-item index="/article">
          <template #title>文花帖</template>
        </el-menu-item>
        <el-menu-item index="/bill">
          <template #title>御札录</template>
        </el-menu-item>
        <el-menu-item v-if="userData.role < 4" index="/Saigyouji">
          <template #title>永云阁</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-container">
      <RouterView v-slot="{ Component }">
        <transition name="fade">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </transition>
      </RouterView>
    </div>
    <!--    <div class="bottom">-->
    <!--      <div><span class="text-block">&copy;2024-2024</span><span>Saigyouji-Zheep</span></div>-->
    <!--    </div>-->
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: 800px) {

}

$primary-color: #fffffa;
$shadow-color: #e5e5e5;

.app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0); /* 半透明的白色蒙版 */
  z-index: 0; /* 确保蒙版在背景图之上 */
}

.app::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://zheep.oss-cn-beijing.aliyuncs.com/%E8%93%9D%E5%A4%A9%E6%96%87%E6%96%87.jpg") no-repeat bottom center;
  background-size: cover; /* 使背景图覆盖整个元素 */
  z-index: -1; /* 确保背景图在所有内容之下 */
}

.app {
  height: calc(100vh - 60px);
  position: relative; /* 确保伪元素相对于 .home 定位 */
  .content-container {
    position: relative;
    z-index: 2; /* 确保内容在蒙版之上 */
  }

  .userCard {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 4;
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
  }

  //.bottom {
  //  position: relative;
  //  padding-top: 20px;
  //  height: 10vh;
  //  text-align: center;
  //
  //  span {
  //    padding: 10px;
  //  }
  //
  //  .text-block {
  //    color: black;
  //    position: relative; /* 确保伪元素相对于 .text-block 定位 */
  //  }
  //
  //  .text-block::after {
  //    content: "";
  //    display: block; /* 设置为块级元素 */
  //    width: 1px;
  //    height: 16px;
  //    background-color: #000;
  //    position: absolute; /* 相对于 .text-block 定位 */
  //    right: 0; /* 伪元素的位置 */
  //    top: 50%; /* 垂直居中 */
  //    transform: translateY(-50%); /* 垂直居中 */
  //  }
  //}
}

.fade-enter-active {
  transition: opacity .5s ease-in-out;
}

//.fade-leave-active {
//  //transition: opacity .3s ease-in-out;
//}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
