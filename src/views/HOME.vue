<template>
  <div class="home">
    <div class="background-overlay">
      <div class="content">
        <!-- 文字和介绍 -->
        <div class="text-block">
          <div class="title">
            <div class="zh_title">曦光录</div>
            <div class="en_title">
              <div>Dawnlight</div>
              <div>Log</div>
            </div>
          </div>
          <div class="introduce">记账随心，笔记留痕</div>
        </div>
        <!-- 两个按钮 -->
        <div class="button-group">
          <router-link class="btn" to="/register">注册账号</router-link>
          <router-link class="btn" to="/wenwenNews">立即启程</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bg-image: url('https://zheep.oss-cn-beijing.aliyuncs.com/%E4%B8%BB%E9%A1%B5%E5%9B%BE%E7%89%87.jpg');
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
    padding-left: 10%; // 默认左侧内边距

    .text-block {
      margin-bottom: 20px;
      color: white;
      display: flex;
      flex-direction: column;
      //gap: 10px;
      .title {
        display: flex;
        align-items: center;
        gap: 1.05rem;

        .en_title {
          height: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: serif;
          font-weight: 100;

          div {
            height: 40px;
            display: flex;
            align-items: center;
            font-size: 2rem;
          }
        }

        .zh_title {
          font-family: serif;
          color: #ffe7b0;
          font-weight: 100;
          font-size: 4.2rem;
          line-height: 1.5;
        }
      }

      .introduce {
        font-family: serif;
        line-height: 1.5;
        font-weight: 100;
        font-size: 2.2rem;
      }
    }

    .button-group {
      display: flex;
      justify-content: start;
      gap: 20px;

      .btn {
        border-radius: 25px;
        color: white;
        padding: 10px 35px;
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
<script lang="ts" setup>
</script>