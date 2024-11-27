<script setup>
import { getCode } from "@/API/UserAPI.js";
import { ElMessage } from "element-plus";
import { ref, computed } from "vue";

const props = defineProps({
  email: {
    type: String,
    required: true
  }
});

const canGetCode = ref(true);
const countdown = ref(0);
const isFetching = ref(false);

const getEmailCode = async () => {
  if (!canGetCode.value || isFetching.value) return;

  canGetCode.value = false;
  isFetching.value = true;
  countdown.value = 60;

  try {
    const result = await getCode(props.email);
    console.log(result);

    if (result.code === 0) {
      ElMessage({
        message: result.msg,
        type: 'error'
      });
      canGetCode.value = true;
    } else {
      ElMessage({
        message: "发送成功",
        type: 'success'
      });

      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          canGetCode.value = true;
        }
      }, 1000);
    }
  } catch (error) {
    ElMessage({
      message: "请求失败",
      type: 'error'
    });
    // 重置状态
    canGetCode.value = true;
    isFetching.value = false;
  } finally {
    isFetching.value = false;
  }
};

const buttonText = computed(() => {
  if (isFetching.value) {
    return "正在获取";
  } else if (canGetCode.value) {
    return "获取";
  } else {
    return `获取 (${countdown.value}s)`;
  }
});

const buttonColor = computed(() => {
  return canGetCode.value ? "#ea3081" : "#aaa";
});

const buttonCursor = computed(() => {
  return canGetCode.value ? "pointer" : "not-allowed";
});
</script>

<template>
  <button class="getCode" type='button' @click="getEmailCode" :disabled="!canGetCode"
          :style="{ color: buttonColor, cursor: buttonCursor }">
    {{ buttonText }}
  </button>
</template>

<style scoped lang="scss">
.getCode {
  position: absolute;
  right: 20px;
}
</style>
