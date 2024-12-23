<script setup>
import * as d3 from 'd3';
import * as echarts from 'echarts';
import {onMounted, ref, computed, watch, onUnmounted} from 'vue';
import {
  createTr,
  deleteTr,
  getDailySummary,
  getMonthlySummary,
  getYearlySummary,
  updateTr
} from "@/API/TranslationAPI.js";
import {convertDate, formattedDateDay, keepOnlyTime, parseFormattedDate, showMessage} from "@/assets/script/utils.js";
import {createCategory, getAllCategories} from "@/API/TransactionCategoryAPI.js";
import usePageStore from "@/stores/page.js";

onMounted(async () => {
  nowTime();
  await today();
  await getMonthlySummaryData();
  await getYearlySummaryData();
  await getCategories();
  watch(
      [() => option_income.value, () => option_expense.value],
      () => {
        // 处理 incomeEcharts
        const incomeEchartsDom = document.getElementById('incomeEcharts');
        if (incomeEchartsDom) {
          const incomeEcharts = echarts.getInstanceByDom(incomeEchartsDom);
          if (incomeEcharts) {
            incomeEcharts.dispose();
          }
        }
        // 处理 expenseEcharts
        const expenseEchartsDom = document.getElementById('expenseEcharts');
        if (expenseEchartsDom) {
          const expenseEcharts = echarts.getInstanceByDom(expenseEchartsDom);
          if (expenseEcharts) {
            expenseEcharts.dispose();
          }
        }

        echartsSum(); // 在依赖项更新后重新渲染图表
      },
      {immediate: true} // immediate: true 确保在初始化时就调用一次
  );
});
onUnmounted(() => {
  document.removeEventListener("keydown", saveKeyDown);
});

const echartsSum = () => {
  incomeEcharts()
  expenseEcharts()

}
const generateOption = (title, data) => {
  return {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    darkMode: false,
    title: {
      text: (usePageStore().getModel === 1 ? date.value.year + ' · ' + date.value.month + '月' + date.value.day + '日' :
          usePageStore().getModel === 2 ? date.value.year + ' · ' + date.value.month + '月' : date.value.year) + '-' + title,
      // subtext: '开销',
      left: 'center'
    },
    textStyle: {
      fontWeight: 700,
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    color: colorList[usePageStore().getColor],
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['30%', '70%'], // 内半径为30%，外半径为70%
        center: ['50%', '50%'], // 饼图居中显示
        data: data ? data : [
          {value: 0, name: '暂无分类'}
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
  }

}
const incomeEcharts = () => {
  const chartDom = document.getElementById('incomeEcharts');
  const myChart = echarts.init(chartDom);
  option_income.value && myChart.setOption(option_income.value);
}
const expenseEcharts = () => {
  const chartDom = document.getElementById('expenseEcharts');
  const myChart = echarts.init(chartDom);
  option_expense.value && myChart.setOption(option_expense.value);
}
const option_income = computed(() => generateOption('收入', usePageStore().getModel === 1 ? todayData.value.breakdown.income : usePageStore().getModel === 2 ? nowMonth.value.breakdown.income : nowYear.value.breakdown.income));
const option_expense = computed(() => generateOption('支出', usePageStore().getModel === 1 ? todayData.value.breakdown.expense : usePageStore().getModel === 2 ? nowMonth.value.breakdown.expense : nowYear.value.breakdown.expense));
// 获取交易分类
const categories = ref([])
const getCategories = async () => {
  const result = await getAllCategories()
  categories.value = await result.data
  transaction.value.category = await categories.value[0].id
}
// 获取日数据
const todayData = ref([])
const today = async () => {
  todayData.value = (await getDailySummary(date.value.year + '-' + date.value.month + '-' + date.value.day)).data
}
const dialogCreateTrVisible = ref(false)
// 获取当月数据
const nowMonth = ref([])
const getMonthlySummaryData = async () => {
  const result = await getMonthlySummary(date.value.year + "-" + date.value.month);
  nowMonth.value = await result.data;
}
// 获取当年数据
const nowYear = ref([])
const getYearlySummaryData = async () => {
  const result = await getYearlySummary(date.value.year);
  nowYear.value = await result.data;
}
// 新增交易
const transaction = ref({
  date: "",
  type: "",
  categoryId: "",
  amount: "",
  description: "",
})
// 检查空值
const checkEmptyValues = (obj) => {
  let isEmpty = false;
  for (let key in obj) {
    if (obj[key] === "") {
      console.log(key, "为空")
      isEmpty = true
    }
  }
  if (isEmpty) {
    showMessage('请填写完整', 'error')
  }
  return isEmpty
}
// 提交交易
const createTransaction = async () => {
  if (!checkEmptyValues(transaction.value)) {
    transaction.value.date = convertDate(transaction.value.date)
    transaction.value.date = date.value.year + '-' + date.value.month + '-' + date.value.day + 'T' + convertDate(transaction.value.date).split('T')[1]
    // console.log(transaction.value.date)
    const result = await createTr(transaction.value)
    if (result.code === 1) {
      showMessage('添加成功', 'success');
      await today()
      await getMonthlySummaryData()
    } else {
      showMessage('添加错误' + result.msg, 'error');
    }
  }
}
// 删除交易
const deleteTransaction = async (id) => {
  const result = await deleteTr(id)
  if (result.code === 1) {
    showMessage('已删除', 'success');
    await today()
  } else {
    showMessage('删除失败', 'error');
  }
}
// 修改交易
const dialogUpdateTrVisible = ref(false)
const openUpdateTr = async (index) => {
  if (todayData.value.trList[index]) {
    transaction.value = await todayData.value.trList[index]
    transaction.value.date = parseFormattedDate(transaction.value.date)
    transaction.value.amount = transaction.value.amount > 0 ? transaction.value.amount : (-transaction.value.amount)
    transaction.value.categoryId = ''
    dialogUpdateTrVisible.value = true
  } else {
    console.error('交易数据不存在', index)
  }
}
const updateTransaction = async () => {
  if (transaction.value && !checkEmptyValues(transaction.value)) {
    transaction.value.date = convertDate(transaction.value.date)
    transaction.value.date = date.value.year + '-' + date.value.month + '-' + date.value.day + 'T' + convertDate(transaction.value.date).split('T')[1]
    const result = await updateTr(transaction.value)
    if (result.code === 1) {
      showMessage('修改成功', 'success');
      await today()
      // await echartsSum()
    } else {
      showMessage('修改错误' + result.msg, 'error');
    }
  } else {
    console.error('交易数据为空或存在空值')
  }
}
// 创建交易分类
const dialogCreateTransactionCategory = ref(false)
const category = ref("")
const addCategory = async () => {
  const result = await createCategory(category.value)
  if (result.code === 1) {
    showMessage('添加成功', 'success');
  } else {
    showMessage('添加错误' + result.msg, 'error');
  }
}
// 动态生成颜色映射函数c
const colorScale = computed(() => {
  return d3.scaleLinear()
      .domain([nowMonth.value.total ? nowMonth.value.total.min_expense : 0, 15, 20, nowMonth.value.total ? nowMonth.value.total.max_expense : 100])
      .range(colorList[usePageStore().getColor])
      .interpolate(d3.interpolateHsl)// 使用 HSL 插值，增加色彩对比;
      .clamp(true)
});
const colorList = [
  ['#e23e57', '#88304e', '#522546', '#311d3f'],//0
  ['#eeeeee', '#00adb5', '#393e46', '#222831'],//1
  ['#f9ed69', '#f08a5d', '#b83b5e', '#6a2c70'],//2
  ['#95e1d3', '#eaffd0', '#fce38a', '#f38181'],//3
  ['#eaeaea', '#ff2e63', '#08d9d6', '#252a34'],//4
  ['#f5f5f5', '#3fc1c9', '#364f6b', '#fc5185'],//5
  ['#ff7c38', '#e03e36', '#b80d57', '#700961'],//6
  ['#a7ff83', '#17b978', '#086972', '#071a52'],//7
  ['#ffd9e8', '#de95ba', '#7f4a88', '#4a266a'],//8
  ['#fecea8', '#ff847b', '#e84a5f', '#2a363b'],//9
  ['#ffffc1', '#ffd2a5', '#ffa8b8', '#d988bc'],//10
  ['#adf7d1', '#95e8d7', '#7dace4', '#8971d0'],//11
  ['#fffcca', '#55e9bc', '#11d3bc', '#537780'],//12
  // ['#e84545', '#903749', '#53354a', '#2b2e4a'],//13
  // ['', '', '', ''],//14
]
// 获取颜色的函数
const getColor = (netIncome) => {
  return colorScale.value(netIncome);
};
const date = ref({
  year: '',
  month: '',
  day: ''
})
// 获取当前时间
const nowTime = () => {
  const nowDate = formattedDateDay()
  date.value.year = nowDate.split('-')[0]
  date.value.month = nowDate.split('-')[1]
  date.value.day = nowDate.split('-')[2]
};
// 切换模式
const D = async () => {
  nowTime()
  usePageStore().setPageModel(1)
  await today()
}
const M = async () => {
  usePageStore().setPageModel(2)
}
const Y = async () => {
  usePageStore().setPageModel(3)
}
// 点击日历中的每天按钮事件
const toDay = async (clicked_date) => {
  date.value.year = clicked_date.split('-')[0]
  date.value.month = clicked_date.split('-')[1]
  date.value.day = clicked_date.split('-')[2]
  // console.log(date.value)
  usePageStore().setPageModel(1)
  await today()
  // await echartsSum()
}
const toMonth = (year, month) => {
  date.value.year = year
  date.value.month = month
  getMonthlySummaryData()
  usePageStore().setPageModel(2)
  today()
}
const emptyDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay(); // 获取每月第一天是星期几
  return (firstDay + 6) % 7; // 转换为周一开头所需的空格数量
}
</script>

<template>
  <div class="app">
    <div class="info">
      <div class="page-menu">
        <div @click="Y">Y</div>
        <div @click="M">M</div>
        <div @click="D">D</div>
      </div>
      <div v-if="usePageStore().getModel===1" class="title">
        <div class="time">{{ date.year }}<b>年 · </b>{{ date.month }}月{{ date.day }}日
        </div>
        <div v-if="todayData.total" class="text-block">
          今日收入：<span>{{ todayData.total.total_income }}</span>，今日花费：<span>{{
            -todayData.total.total_expense
                                                                                  }}，总计：{{
            todayData.total.total
                                                                                  }}</span>
        </div>
      </div>
      <div v-if="usePageStore().getModel===2" class="title">
        <div class="time">{{ date.year }}<b>年 · </b>{{ date.month }}月</div>
        <div v-if="nowMonth.total" class="text-block">
          本月收入：<span>{{ nowMonth.total.total_income }}</span>，
          本月花费：<span>{{ -nowMonth.total.total_expense }}</span>，
          总计：<span>{{ nowMonth.total.total }}</span>
        </div>
      </div>
      <div v-if="usePageStore().getModel===3" class="title">
        <div class="time">{{ date.year }}<b>年</b></div>
        <div v-if="nowYear.total" class="text-block">
          年收入：<span>{{ nowYear.total.total_income }}</span>，
          年消费：<span>{{ -nowYear.total.total_expense }}</span>，
          总计：<span>{{ nowYear.total.total }}</span>
        </div>
      </div>
      <div v-if="usePageStore().getModel===1" class="transaction">
        <div class="month"></div>
        <el-scrollbar v-loading="!todayData.trList" element-loading-background="rgba(0, 0, 0, 0)" height="64.5vh">
          <div class="transaction-item">
            <div class="transaction-item-crate" @click="dialogCreateTrVisible=true">
              <svg id="mx_n_1732324295672" class="icon" height="25" p-id="5303"
                   t="1732324295671" viewBox="0 0 1024 1024" width="25" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M469.333333 469.333333V170.666667h85.333334v298.666666h298.666666v85.333334h-298.666666v298.666666h-85.333334v-298.666666H170.666667v-85.333334h298.666666z"
                    fill="#380e0e" p-id="5304"></path>
              </svg>
              <b>新增收支</b>
            </div>
          </div>
          <div v-for="(tr,index) in todayData.trList" class="transaction-item">
            <div class="transaction-item-info">
              <div class="mode">{{ tr.type === "income" ? "收入" : "支出" }}</div>
              <div class="amount">{{ tr.amount }}<b> 元</b></div>
              <div class="description">{{ tr.description }}</div>
              <div class="label-box">
                <div class="label">{{ tr.category }}</div>
              </div>
              <div class="time">{{ keepOnlyTime(tr.date) }}</div>
            </div>
            <div class="edit">
              <a @click="openUpdateTr(index)">
                <svg class="icon" height="23" p-id="7486" t="1732282838351"
                     viewBox="0 0 1024 1024" width="23" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M857.058 979.307l-696.21 0c-64.08 0-116.035-51.981-116.035-116.097L44.813 166.55c0-64.123 52.716-121.611 116.803-121.611l467.187 0 0 58.397-467.18 0c-32.044 0-58.785 31.145-58.785 63.205l0 696.66c0 32.054 25.974 58.043 58.01 58.043l696.21 0c32.018 0 63.733-26.698 63.733-58.733l0-467.18 58.397 0 0 467.187c0.006 64.123-58.054 116.785-122.133 116.785L857.058 979.307zM510.287 697.977c-8.476 8.484-19.097 12.743-30.055 14.884L226.22 838.502c-28.588 13.257-51.486-12.364-40.954-40.971L310.838 543.33c2.13-10.958 6.371-21.58 14.865-30.066L776.958 61.682c22.659-22.65 59.387-22.65 82.046 0L961.553 164.31c22.66 22.66 22.66 59.44 0 82.1L510.29 697.974 510.287 697.977zM240.837 762.401c-6.637 13.396 6.177 27.131 20.46 20.493l156.863-95.003-82.382-82.444-94.94 156.952L240.837 762.401zM387.229 574.827l61.535 61.579c11.321 11.338-17.939-17.957 20.511 20.502l328.193-328.39L694.177 226.625 366.716 554.28c10.907 10.922 9.19 9.21 20.511 20.547L387.229 574.827zM900.025 184.852l-61.535-61.579c-11.32-11.356-29.693-11.356-41.024 0l-60.068 60.094L838.48 287.472l61.535-61.588c11.347-11.338 11.347-29.711 0.006-41.031L900.025 184.852z"
                      fill="#999999" p-id="7487"></path>
                </svg>
              </a>
              <a @click="deleteTransaction(tr.id)">
                <svg class="icon" height="20" p-id="8859" t="1732282990979"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
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
      <div v-if="usePageStore().getModel===2" class="transaction-month" v-loading="!nowMonth.trList" element-loading-background="rgba(0, 0, 0, 0)">
        <div v-for="(i,monthIndex) in nowMonth.trList"
             :style="{backgroundColor:i.total_expense===0&&i.total_income===0?'#f5f5f5':getColor(-i.total_expense)}"
             class="day" @click="toDay(nowMonth.trList[monthIndex].transaction_date)">
          <el-popover
              :content='"总收入："+i.total_income+"，总消费："+(-i.total_expense)'
              :title="i.transaction_date"
              :width="200"
              placement="top-start"
              trigger="hover">
            <template #reference>
              <div class="day-info" style="width: 100%;height: 100%">
              </div>
            </template>
          </el-popover>
        </div>
        <div class="selectColor" v-if="nowMonth.trList">
          <div v-for="(colorList,index) in colorList"
               class="color" @click="usePageStore().setColor(index)">
            <div :style="{background:colorList[0]}"></div>
            <div :style="{background:colorList[1]}"></div>
            <div :style="{background:colorList[2]}"></div>
            <div :style="{background:colorList[3]}"></div>
          </div>
        </div>
      </div>
      <div v-if="usePageStore().getModel===3" class="transaction-year" v-loading="!nowYear.monthsTotal" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="months">
          <div v-for="(i,monthIndex) in nowYear.monthsTotal" class="month" @click="toMonth(i.year,i.month)">
            <div class="month-title">
              <div>{{ i.year }}年</div>
              <div>{{ i.month }}月</div>
            </div>
            <div class="month-body">
              <div v-for="i in emptyDays(i.year,i.month-1)" class="month-body-none"></div>
              <div v-for="i in nowYear.months[monthIndex]"
                   :style="{backgroundColor:i.total_expense===0&&i.total_income===0?'#d0d0d0':getColor(-i.total_expense)}"
                   class="month-body-item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ECharts">
      <div id="incomeEcharts"  v-loading="!(todayData.breakdown && nowYear.breakdown.income && nowMonth.breakdown.income)"  element-loading-background="rgba(0, 0, 0, 0)"></div>
      <div id="expenseEcharts" v-loading="!(todayData.breakdown && nowYear.breakdown.income && nowMonth.breakdown.income)" element-loading-background="rgba(0, 0, 0, 0)"></div>
    </div>
    <!--    新增分类-->
    <el-dialog id="form" v-model="dialogCreateTransactionCategory"
               style="background: linear-gradient(to right, rgb(255, 230, 230), rgba(255, 255, 250, 1));"
               title="新增分类"
               width="500">
      <div class="dialogCreateTransactionCategory">
        <input v-model="category" placeholder="请输入分类名称" type="text"/>
        <div class="dialogCreateTransactionCategoryButtons">
          <a @click="addCategory">创建</a>
          <a>取消</a>
        </div>
      </div>
    </el-dialog>
    <!--    新增交易-->
    <el-dialog id="form" v-model="dialogCreateTrVisible"
               style="background: linear-gradient(to right, rgb(255, 230, 230), rgba(255, 255, 250, 1));"
               title="新增交易"
               width="500">
      <div class="dialog-content">
        <el-time-picker v-model="transaction.date" placeholder="交易时间" size="small"/>
        <div style=" height: 20px;display: flex;justify-content: space-between;padding: 0 10px;align-items: center">
          <el-switch v-model="transaction.type" active-text="收入" active-value="income" checked
                     inactive-text="支出" inactive-value="expense"/>
          <a class="create-category" @click="dialogCreateTransactionCategory = true">创建分类</a></div>
        <el-scrollbar height="40px" style="display: flex;align-items: center;padding: 10px;height: 40px">
          <el-radio-group v-model="transaction.categoryId" size="large">
            <el-radio-button v-for="item in categories" :label="item.name" :value="item.id" fill="#380E0EFF"
                             size="small"/>
          </el-radio-group>
        </el-scrollbar>
        <input v-model="transaction.amount" pattern="[0-9]*" placeholder="请输入金额" type="number"/>
        <input v-model="transaction.description" maxlength="30" placeholder="请输入备注" type="text">
        <div class="dialog-buttons">
          <a @click="createTransaction()">提交</a>
          <a>取消</a>
        </div>
      </div>
    </el-dialog>
    <!--    更新交易-->
    <el-dialog id="form" v-model="dialogUpdateTrVisible"
               style="background: linear-gradient(to right, rgb(255, 230, 230), rgba(255, 255, 250, 1));"
               title="更新交易"
               width="500">
      <div class="dialog-content">
        <el-time-picker v-model="transaction.date" placeholder="交易时间" size="small"/>
        <div style=" height: 20px;display: flex;justify-content: space-between;padding: 0 10px;align-items: center">
          <el-switch v-model="transaction.type" active-text="收入" active-value="income"
                     inactive-text="支出" inactive-value="expense"/>
          <a class="create-category" @click="dialogCreateTransactionCategory = true">创建分类</a></div>
        <el-scrollbar height="40px" style="display: flex;align-items: center;padding: 10px;height: 40px">
          <el-radio-group v-model="transaction.categoryId" size="large">
            <el-radio-button v-for="item in categories" :label="item.name" :value="item.id" fill="#380E0EFF"
                             size="small"/>
          </el-radio-group>
        </el-scrollbar>
        <input v-model="transaction.amount" pattern="[0-9]*" placeholder="请输入金额" type="number"/>
        <input v-model="transaction.description" maxlength="30" placeholder="请输入备注" type="text">
        <div class="dialog-buttons">
          <a @click="updateTransaction()">提交</a>
          <a>取消</a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  display: flex;
  overflow: hidden;

  .dialogCreateTransactionCategory {
    //input {
    //}

    .dialogCreateTransactionCategoryButtons {
      display: flex;
      justify-content: end;
      gap: 20px;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 5px;
        border-radius: 5px;
        font-size: 14px;
      }

      a:nth-child(2) {
        border: 1px var(--theme-color) solid;
      }

      a:nth-child(1) {
        background-color: var(--theme-color);
        color: #ffffff;
      }
    }
  }

  .dialog-content {
    height: 400px;
    display: flex;
    flex-direction: column;
    gap: 30px;

    .create-category {
      transition: .3s;
      cursor: pointer;
      border: var(--theme-color) 1px solid;
      padding: 2px 5px;
      border-radius: 20px;
      color: var(--theme-font-color)
    }

    .create-category:hover {
      border: none;
      background-color: var(--theme-color);
      color: #fffffa;
    }

    input {
      border-bottom: 1px var(--theme-font-color) solid;
      padding-bottom: 10px;
    }

    .el-radio-group {
      display: flex;
      flex-wrap: nowrap;
      gap: 10px;
      align-items: center;
    }

    .dialog-buttons {
      display: flex;
      justify-content: end;
      gap: 20px;
      height: 30px;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 10px;
        border-radius: 15px;
      }

      a:nth-child(2) {
        border: 1px var(--theme-color) solid;
      }

      a:nth-child(1) {
        background-color: var(--theme-color);
        color: #ffffff;
      }
    }
  }

  .info {
    position: relative;
    padding: 20px 50px 20px 50px;
    width: 60%;
    //backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
    background-color: rgba(255, 255, 255, 0.6); /* 半透明的白色背景 */
    .page-menu {
      z-index: 2;
      border-radius: 5px;
      position: absolute;
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
      padding-bottom: 20px;
      margin-right: 50px;

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

        .transaction-item-crate {
          width: 100%;
          height: 80px;
          z-index: 1;
          cursor: pointer;
          margin-left: 10px;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .transaction-item-info {
          z-index: 1;
          display: flex;
          align-items: center;
          min-width: 70%;

          .mode {
            margin-left: 10px;
          }

          .amount {
            justify-content: end;
            display: flex;
            gap: 10px;
            align-items: center;
            margin: 0 20px;
            font-size: 20px;
            width: 80px;
          }

          .description {
            text-align: end;
            width: 160px;
          }

          .time {
            width: 100px;
            text-align: right;
            color: #999;
          }

          .label-box {
            width: 200px;

            .label {
              display: inline-block;
              margin-left: 40px;
              background-color: rgba(211, 211, 211, 0.29);
              border-radius: 5px;
              font-size: 14px;
              color: #666;
              padding: 2px 10px;
            }
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

        .time {
          width: 0;
          opacity: 0;
        }
      }
    }

    .transaction-month {
      display: flex;
      justify-content: start;
      gap: 30px;
      flex-wrap: wrap;

      .day {
        box-shadow: #a7a7a7 0 0 5px;
        cursor: pointer;
        margin-bottom: 5%;
        width: 60px;
        height: 60px;
        //background-color: var(--theme-color);
        border-radius: 10px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fffffa;
      }

      .selectColor {
        width: 400px;
        position: absolute;
        bottom: 10px;
        left: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        .color {
          cursor: pointer;

          div {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .transaction-year {
      .months {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        overflow: scroll;
        height: 550px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;

        .month {
          border-radius: 10px;
          padding: 10px;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.44); /* 半透明的白色背景 */
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: center;

          .month-title {
            display: flex;
            gap: 10px;
          }

          .month-body {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: auto;
            gap: 10px;
            flex-wrap: wrap;
            place-items: center;

            .month-body-item {
              border-radius: 5px;
              width: 20px;
              height: 20px;
              background-color: var(--theme-color);
            }
          }
        }
      }
    }
  }

  .ECharts {
    box-shadow: #a7a7a7 0 0 15px;
    overflow: hidden;
    border-left: #a7a7a7 1px solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
    background-color: rgba(255, 255, 255, 0.6); /* 半透明的白色背景 */
    #incomeEcharts {
      width: 600px;
      height: 380px;
    }

    #expenseEcharts {
      width: 600px;
      height: 380px;
    }
  }
}
</style>
