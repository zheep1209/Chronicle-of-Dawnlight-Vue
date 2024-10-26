<script setup>

</script>

<template>
  <div class="home">
    <div class="preview">
      <div class="border">
        <div class="above">
          <div class="title">全部笔记</div>
          <div class="icon">图标</div>
        </div>
        <div class="under">
          <div class="sum">共{{ 0 }}项</div>
          <div class="button-group">
            <div class="more-select">多选</div>
            <div class="add">new</div>
          </div>
        </div>
      </div>
      <div class="list">
        <el-scrollbar height="74vh">
          <div class="item">
            <div class="title">标题</div>
            <div class="content">内容</div>
            <div class="info">
              <div class="icon">O</div>
              <div class="time">2024年10月26日</div>
              <div class="label">分类</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="edit">
    </div>
  </div>
</template>

<style lang="scss" scoped>
$text-color: #858585;
.home {
  height: 100vh;
  box-shadow: 0 0 10px 1px #e5e5e5;
  margin: 40px;
  background-color: #fffffa;
  border-radius: 20px;
  display: flex;

  .preview {
    height: 100%;
    width: 30%;
    min-width:300px ;
    border-right: #d2d2d2 1px solid;

    .border {
      padding: 20px;
      height: 15%;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .above {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 20px;
          font-weight: 600;
        }

        .icon {
        display: block;
        }
      }

      .under {
        display: flex;
        justify-content: space-between;

        .sum {
          font-size: 14px;
          color: #a7a7a7;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          gap: 40px;

          div {
            padding: 5px 15px;
            border-radius: 17px;
            min-width: 50px;
            text-align: center;
            font-weight: 600;
          }

          .more-select {
            background-color: #d7d7d7;
          }

          .add {
            color: white;
            background-color: #ff82ba;
          }
        }
      }
    }

    .list {
      width: 100%;
      height: 100%;

      .item {
        transition: 0.5s;
        border-radius: 10px;
        margin: 20px;
        background-color: #eaeaea;
        padding: 10px;

        .title {
          font-weight: 600;
        }

        .content {
          color: $text-color;
        }

        .info {
          display: flex;
          gap: 10px;
          color: $text-color;
          font-size: 14px;

          .icon {
            display: block;
          }

          .time {
            display: block;
          }

          .label {
            display: block;
          }

          .label::before {
            content: "";
            background-color: $text-color;
            padding: 0.5px 0.75px;
            margin-right: 5px
          }
        }
      }

      .item:hover {
        background-color: #e1e1e1;
      }
    }
  }
}
</style>