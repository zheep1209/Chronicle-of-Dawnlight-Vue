<script setup>

</script>

<template>
  <div class="app">
    <div class="content">
      <h1>个人中心</h1>
      <el-tabs class="demo-tabs" tab-position="top">
        <el-tab-pane label="个人记录">超级炫酷的可视化界面（哎，还没做呢</el-tab-pane>
        <el-tab-pane label="修改资料">修改修改修改修改修改修改修改修改修改修改修改修改修改修改</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  padding: 40px 20px  0;
  flex-direction: column; /* 垂直布局 */
  height: calc(100vh - 60px); /* 填满整个视口高度 */
  justify-content: center;
  align-items: center;
  .top{
    height: 200px;
  }
  .content {
    height: 100%;
    padding: 20px;
    background-color: #fffffa;
    width: 1000px;
    flex-grow: 1; /* 占据剩余空间 */
    overflow-y: auto; /* 如果内容超出，显示滚动条 */
  }
}

</style>