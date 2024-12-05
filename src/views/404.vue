<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push('/wenwenNews'); // 假设要跳转到首页，可以根据需要修改路径
  }, 5000); // 5秒后执行
});
</script>

<template>
  <div class="main">
    <div class="tips">
      <span class="a">404</span>
      <span class="b">网页被幽幽子吃掉了</span>
      <span class="c">5s自动返回</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url("https://zheep.oss-cn-beijing.aliyuncs.com/%E5%B9%BD%E5%B9%BD%E5%AD%903.jpg") center center / cover;

  .tips {
    position: relative;
    height: 100vh;
    color: #f2d5ff;
    font-size: 50px;
    text-shadow: 2px 2px 4px #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .a {
      font-size: 40px;
    }

    .b {
      font-size: 60px;
    }

    .c {
      font-size: 30px;
    }
  }
}

.main::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}
</style>