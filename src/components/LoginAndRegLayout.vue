<script setup>

</script>

<template>
  <div class="home">
    <div class="background">
      <div class="card">
        <div class="img">
          <img src="https://img.picgo.net/2024/10/24/98765962_p0a1f5dbcb7fbf320d.jpg" alt="" >
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg-image: url('https://img.picgo.net/2024/10/24/f78607cf03042a307616296bf065ea3b80aa64710b6ddf67.jpg');
$overlay-color: rgba(255, 255, 255, 0.8);
.home{
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
    .card{
      background-color: #fff;
      border-radius: 20px;
      box-shadow: #adadad 0 0 10px 1px;
      overflow: hidden;
      display: flex;
      z-index: 2;
      position: relative;
      height: 60%;
      img{
        height: 100%;
        transform: scaleX(-1);
      }
      .content{
        width: 50%;
      }
    }
  }}
</style>