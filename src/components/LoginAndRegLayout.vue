<script setup>
</script>

<template>
  <div class="home">
    <div class="background">
      <div class="card">
        <div class="img">
          <img src="https://zheep.oss-cn-beijing.aliyuncs.com/%E7%99%BB%E5%BD%95%E9%A1%B5%E7%81%B5%E6%A2%A6.png" alt="" />
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg-image: url('https://zheep.oss-cn-beijing.aliyuncs.com/%E5%B9%BB%E6%83%B3%E4%B9%A1%E5%90%88%E7%85%A7.jpg');
$overlay-color: rgba(255, 255, 255, 0.8);

.home {
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .background {
    height: 100%;
    background-image: $bg-image;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: center;
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

    .card {
      background-color: #fff;
      border-radius: 20px;
      box-shadow: #adadad 0 0 10px 1px;
      overflow: hidden;
      display: flex;
      z-index: 2;
      position: relative;
      min-height: 300px; // 设置最小高度
      min-width: 300px; // 设置最小宽度
      align-items: center;

      .img {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 300px;
        min-width: 150px; // 设置最小宽度

        img {
          height: 100%;
          object-fit: cover; // 确保图片按比例缩放
          transform: scaleX(-1);
        }
      }

      .content {
        width: 400px;
      }
    }
  }
}

@media (max-width: 600px) {
  .img {
    display: none;
  }

  .content {
    width: 100% !important;
    padding: 20px;
  }
}
</style>
