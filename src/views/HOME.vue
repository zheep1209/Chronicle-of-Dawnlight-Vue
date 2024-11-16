<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();
const login = () => {
  router.push('/wenwenNews');
};

const register = () => {
  router.push('/register');
};
</script>

<template>
  <div class="home">
    <div class="background-overlay">
      <div class="content">
        <!-- 文字和介绍 -->
        <div class="text-block">
          <h1>Dawnlight Log</h1>
          <h1>曦光录</h1>
          <p>曦光下，梦随晨光</p>
        </div>

        <!-- 两个按钮 -->
        <div class="button-group">
          <button class="btn" @click="register">注册账号</button>
          <button class="btn" @click="login">立即启程</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bg-image: url('https://img.picgo.net/2024/10/26/-5384882fb6bac38c.jpg');
$overlay-color: rgba(0, 0, 0, 0.5);

.home {
  height: 100vh;
  overflow: hidden;
  position: relative;

  .background-overlay {
    background-image: $bg-image;
    background-size: cover;
    background-position: center;
    position: relative;
    height: 100%;
    display: flex;
    justify-content: left;
    align-items: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: $overlay-color; // 蒙版颜色及透明度
      z-index: 1; // 确保蒙版在内容下面
    }
  }

  .content {
    position: relative; // 使内容在蒙版之上
    z-index: 2; // 确保内容在蒙版之上
    text-align: left;
    box-sizing: border-box;
    padding-left: 13%; // 默认左侧内边距

    .text-block {
      margin-bottom: 20px;
      color: white;

      h1 {
        font-size: 3.8em;
        font-weight: 100;
      }

      p {
        font-size: 2em;
        font-weight: 100;
      }
    }

    .button-group {
      display: flex;
      justify-content: start;
      gap: 20px;

      .btn {
        border-radius: 25px;
        color: white;
        padding: 15px 35px;
        border: 2px solid white;
        cursor: pointer;
        transition: 0.3s;

        &:hover {
          background-color: #ffffff;
          color: black;
        }
      }
    }
  }
}

// 媒体查询：适配手机
@media (max-width: 600px) {
  .background-overlay {
    height: auto; // 保留背景图的高度
  }

  .content {
    width: 100%;
    padding-left: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; // 让内容居中

    .text-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 10px; // 调整间距
      text-align: center;
    }

    .button-group {
      justify-content: center; // 按钮居中
      gap: 10px; // 调整间距
    }
  }
}
</style>
