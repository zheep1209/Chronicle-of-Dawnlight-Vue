<script setup>
import * as echarts from 'echarts';
import {onMounted} from 'vue';

onMounted(() => {
  const chartDom = document.getElementById('main');
  const myChart = echarts.init(chartDom);
  const option = {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    darkMode: false,
    title: {
      text: '账单统计图',
      subtext: '如你所见',
      left: 'center'
    },
    textStyle: {
      textBorderColor: 'transparent', // 取消白边
      textBorderWidth: 0 // 取消边框宽度
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '70%'], // 内半径为30%，外半径为70%
        center: ['50%', '50%'], // 饼图居中显示
        data: [
          {value: 1048, name: '餐饮'},
          {value: 321, name: '交通'},
          {value: 1145, name: '其他'},
          {value: 735, name: '娱乐'},
          {value: 580, name: '医疗'},
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          }
        }
      }
    ]
  };
  option && myChart.setOption(option);
});
</script>

<template>
  <div class="app">
    <div class="info">
      <div class="page-menu">
        <div>年</div>
        <div>月</div>
        <div>日</div>
      </div>
      <div class="title">
        <div class="time">2024<b>年 · </b>12月9日</div>
        <div class="text-block">今日收入：<span>0</span>，今日花费：<span>20</span>，当月预算还剩：<span>100</span></div>
      </div>
      <div class="transaction">
        <el-scrollbar height="62vh">
          <div v-for="i in 20" class="transaction-item">
            <div class="transaction-item-info">
              <div class="mode">入</div>
              <div class="amount">150<b> 元</b></div>
              <div class="description">买石灰街车站的海鸥</div>
              <div class="label">饮食</div>
              <div class="time">21:27:42</div>
            </div>
            <div class="edit">
              <a>
                <svg class="icon" height="23" p-id="7486" t="1732282838351"
                     version="1.1" viewBox="0 0 1024 1024" width="23" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M857.058 979.307l-696.21 0c-64.08 0-116.035-51.981-116.035-116.097L44.813 166.55c0-64.123 52.716-121.611 116.803-121.611l467.187 0 0 58.397-467.18 0c-32.044 0-58.785 31.145-58.785 63.205l0 696.66c0 32.054 25.974 58.043 58.01 58.043l696.21 0c32.018 0 63.733-26.698 63.733-58.733l0-467.18 58.397 0 0 467.187c0.006 64.123-58.054 116.785-122.133 116.785L857.058 979.307zM510.287 697.977c-8.476 8.484-19.097 12.743-30.055 14.884L226.22 838.502c-28.588 13.257-51.486-12.364-40.954-40.971L310.838 543.33c2.13-10.958 6.371-21.58 14.865-30.066L776.958 61.682c22.659-22.65 59.387-22.65 82.046 0L961.553 164.31c22.66 22.66 22.66 59.44 0 82.1L510.29 697.974 510.287 697.977zM240.837 762.401c-6.637 13.396 6.177 27.131 20.46 20.493l156.863-95.003-82.382-82.444-94.94 156.952L240.837 762.401zM387.229 574.827l61.535 61.579c11.321 11.338-17.939-17.957 20.511 20.502l328.193-328.39L694.177 226.625 366.716 554.28c10.907 10.922 9.19 9.21 20.511 20.547L387.229 574.827zM900.025 184.852l-61.535-61.579c-11.32-11.356-29.693-11.356-41.024 0l-60.068 60.094L838.48 287.472l61.535-61.588c11.347-11.338 11.347-29.711 0.006-41.031L900.025 184.852z"
                      fill="#999999" p-id="7487"></path>
                </svg>
              </a>
              <a>
                <svg class="icon" height="20" p-id="8859" t="1732282990979"
                     version="1.1" viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M992 204.8l-960 0C12.8 204.8 0 192 0 172.8s12.8-32 32-32l960 0c19.2 0 32 12.8 32 32S1011.2 204.8 992 204.8z"
                      fill="#999999" p-id="8860"></path>
                  <path
                      d="M665.6 179.2c-19.2 0-32-12.8-32-32L633.6 115.2C633.6 83.2 614.4 64 582.4 64L441.6 64C409.6 64 390.4 83.2 390.4 115.2l0 32c0 19.2-12.8 32-32 32S326.4 166.4 326.4 147.2L326.4 115.2c0-64 51.2-115.2 115.2-115.2l140.8 0c64 0 115.2 51.2 115.2 115.2l0 32C697.6 166.4 684.8 179.2 665.6 179.2z"
                      fill="#999999" p-id="8861"></path>
                  <path
                      d="M729.6 1024 294.4 1024c-64 0-115.2-51.2-115.2-108.8L128 326.4c0-19.2 12.8-32 32-32C172.8 288 192 300.8 192 320l44.8 588.8c0 25.6 25.6 51.2 51.2 51.2l441.6 0c25.6 0 51.2-19.2 51.2-44.8L832 320c0-19.2 19.2-32 32-32 19.2 0 32 19.2 32 32l-44.8 588.8C851.2 972.8 793.6 1024 729.6 1024z"
                      fill="#999999" p-id="8862"></path>
                  <path
                      d="M409.6 1024c-19.2 0-32-12.8-32-32L352 326.4c0-19.2 12.8-32 32-32 19.2 0 32 12.8 32 32l25.6 672C441.6 1011.2 428.8 1024 409.6 1024 409.6 1024 409.6 1024 409.6 1024z"
                      fill="#999999" p-id="8863"></path>
                  <path
                      d="M614.4 1024C614.4 1024 614.4 1024 614.4 1024c-19.2 0-32-12.8-32-32L608 320c0-19.2 12.8-32 32-32 19.2 0 32 12.8 32 32l-25.6 672C646.4 1011.2 633.6 1024 614.4 1024z"
                      fill="#999999" p-id="8864"></path>
                </svg>
              </a>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="ECharts">
      <div id="main">

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;

  .info {
    position: relative;
    padding: 20px 100px 20px 50px;
    width: 60%;
    backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
    background-color: rgba(255, 255, 255, 0.6); /* 半透明的白色背景 */
    .page-menu {
      border-radius: 5px;
      position: fixed;
      top: 10%;
      right: 20px;
      border: 3px solid transparent; // 必须透明，显示背景渐变
      background: linear-gradient(to right, rgb(255, 230, 230), rgba(255, 255, 250, 0.9), rgba(255, 255, 250, 0.5)), // 外层渐变
      linear-gradient(to bottom, rgba(56, 14, 14, 0.8), rgba(255, 255, 250, 0.8)); // 卡片背景的半透明效果
      background-origin: border-box; // 背景从边框外开始
      background-clip: padding-box, border-box; // 双层裁剪显示效果
      div {
        cursor: pointer;
        padding: 2px;
        background-color: rgba(255, 255, 255, 0.8);
        transition: .5s;
      }

      div:hover {
        background-color: rgba(255, 230, 230, 0.8);
      }
    }

    .title {
      margin-left: 5px;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .time {
        font-size: 25px;
      }

      .text-block {
        span {
          font-size: 20px;

          svg {
            path {
              fill: #666;
            }
          }
        }
      }
    }

    .transaction {
      .transaction-item {
        position: relative;
        transition: background 0.5s ease;
        margin-right: 20px;
        border-radius: 40px;
        margin-bottom: 20px;
        border: 3px solid transparent; // 必须透明，显示背景渐变
        background: linear-gradient(to right, rgb(255, 230, 230), rgba(255, 255, 250, 0.9), rgba(255, 255, 250, 0.5)), // 外层渐变
        linear-gradient(to right, rgba(56, 14, 14, 0.8), rgba(255, 255, 250, 0.8)); // 卡片背景的半透明效果
        background-origin: border-box; // 背景从边框外开始
        background-clip: padding-box, border-box; // 双层裁剪显示效果
        padding: 20px;
        display: flex;
        height: 80px;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .transaction-item-info {
          z-index: 1;
          display: flex;
          align-items: center;

          .mode {
            margin-left: 10px;
          }

          .amount {
            margin: 0 20px;
            font-size: 20px;
          }

          .description {
            text-align: center;
            max-width: 35%;
            min-width: 30%;
          }

          .time {
            color: #999;
          }

          .label {
            margin: 0 20px;
            background-color: rgba(211, 211, 211, 0.29);
            border-radius: 5px;
            font-size: 14px;
            color: #666;
            padding: 2px 10px;
          }
        }

        .edit {
          transition: opacity .5s;
          width: 0;
          overflow: hidden;
          opacity: 0;
          margin-right: 10px;
          display: flex;
          gap: 10px;

          a {
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #eee;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: .5s;
          }

          a:hover {
            background-color: #ccc;
          }
        }
      }

      .transaction-item::before {
        transition: .5s;
        content: "";
        width: 10000000000000px;
        height: 100000000000000px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0);
      }

      .transaction-item:hover::before {
        background-color: rgba(201, 201, 201, 0.41);
      }

      .transaction-item:hover {
        .edit {
          width: auto;
          opacity: 1;
        }
      }
    }
  }

  .ECharts {
    border-left: #a7a7a7 1px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
    background-color: rgba(255, 255, 255, 0.6); /* 半透明的白色背景 */
    #main {
      width: 600px;
      height: 400px;
    }
  }
}
</style>
