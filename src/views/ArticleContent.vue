<script setup>import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {publicArticleByArticleID} from "@/API/ArticleAPI.js";
import PageMenu from "@/components/PageMenu.vue";

const route = useRoute();  // 获取当前路由实例
const router = useRouter();  // 获取路由实例
const result = ref({});
const userData = ref({});  // 确保初始化为空对象

onMounted(async () => {
  try {
    const articleId = route.params.id;  // 获取路由参数中的 id
    result.value = await publicArticleByArticleID(articleId);
    if (result.value.code === 1) {
      userData.value = {
        username: result.value.data.username,
        avatar: result.value.data.avatar,
        articleCount: result.value.data.articleCount,
        categoryCount: result.value.data.categoryCount
      };
    } else {
      // 处理错误情况
      console.error("Failed to fetch article data");
      await router.push("/wenwenNews");
    }
  } catch (error) {
    console.error(error);
    await router.push("/wenwenNews");
  }
});
</script>

<template>
  <div class="home">
    <div class="content">
      <div class="article">
        <div class="author">
          <img alt="" class="avatar"
               height="38px" src="https://img.picgo.net/2024/10/25/d693c6f605470263c9e42740e8bed7d2909387c156c4a646.png"
               width="38px">
          <div class="info">
            <div class="username">ZHEEP</div>
            <div class="identity">普通の魔法使い</div>
          </div>
        </div>
        <div v-if="result.data" class="article-content" v-html="result.data.content"></div>
      </div>
      <PageMenu :user-data="userData"></PageMenu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  .content {
    width: 100%;
    margin: 20px auto;
    min-height: 60px;
    max-width: 1350px;
    display: flex;
    position: relative;

    .article {
      width: 73%;
      border-radius: 5px;
      background-color: #fff;
      margin: 0 auto;
      padding: 16px 20px;
      .author {
        display: flex;
        align-items: center;
        gap: 10px;

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .username {
            font-weight: 700;
          }

          .identity {
            display: block;
          }
        }
      }
    }
  }
}
</style>