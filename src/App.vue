<script setup>
import {RouterView} from 'vue-router'
const message = `
%c我在天台拥抱星海，%c与夜风撞了满怀，%c
世间的好奇，%c成长的期待，%c
放不下的过去里%c
孕育了未来。
`;

console.log(
    message,
    'color: #3498db; font-size: 20px;',    // 为第一部分文字添加样式
    'color: #e74c3c; font-size: 18px;',    // 为第二部分文字添加样式
    'color: #9b59b6;',                    // 为第三部分文字添加样式
    'color: #f39c12; font-weight: bold;',  // 为第四部分文字添加样式
    'color: #1abc9c;',                    // 为第五部分文字添加样式
    'color: #ecf0f1; background: #34495e;' // 为第六部分文字添加样式
);

</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">

</style>
