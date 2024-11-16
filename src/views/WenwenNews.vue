<script setup>
import {onMounted, ref} from "vue";
import {listPublicArticles} from "@/API/ArticleAPI.js";
import {ElMessage} from "element-plus";
import PageMenu from "@/components/PageMenu.vue";
import useLoginStore from "@/stores/index.js";

const store = useLoginStore()
let articleList = ref('')
let userData = ref('')
onMounted(async () => {
  userData.value = store.getUserData;
  try {
    articleList.value = await listPublicArticles();
    // console.log(articleList.value)
    if (articleList.value && articleList.value.code === 0) {
      ElMessage({
        type: 'error',
        message: '获取用户笔记出错，请刷新页面'
      });
    }
  } catch (error) {
    console.error('Error in onMounted:', error);
    ElMessage({
      type: 'error',
      message: '发生未知错误，请刷新页面'
    });
  }
});

const sanitizeContent = (content) => {
  // 去除第一个双标签及其内容
  const firstTagPattern = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>(.*?)<\/\1>/;
  let result = content.replace(firstTagPattern, '');

  // 去除所有剩余的 HTML 标签
  result = result.replace(/<[^>]*>/g, '');

  return result;
}
</script>

<template>
  <div class="home-a">
    <div class="page-title">
      <div class="text-block">
        <span class="ft">《文文</span>。<span style="color: red;">新</span>闻》
      </div>
    </div>
    <div class="page-content">
      <PageMenu :user-data="userData"></PageMenu>
      <div class="articles">
        <router-link v-for="(item,index) in articleList.data" :key="index"
                     :style="{ animationDelay: `${index * 0.3}s` }"
                     :to="'/qwq/'+item.id"
                     class="article-items">
          <img v-if="(index+1)%2===0" alt="" class="left-img"
               src="https://images4.alphacoders.com/133/thumbbig-1337538.webp"
               width="350px">
          <div class="article-items-info">
            <div class="article-items-status">
              <div>
                <svg class="icon" height="16" p-id="6523" t="1731633755515"
                     viewBox="0 0 1024 1024" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M960 128H833c0-53-43-96-96-96h-16c-53 0-96 43-96 96H400c0-26.5-10.7-50.5-28.1-67.9C354.5 42.7 330.5 32 304 32h-16c-53 0-96 43-96 96H64c-35.3 0-64 28.6-64 64v736c0 35.3 28.7 64 64 64h896c35.3 0 64-28.7 64-64V192c0-35.4-28.7-64-64-64z m-271 8c0-22.1 17.9-40 40-40s40 17.9 40 40v80c0 22.1-17.9 40-40 40-11 0-21-4.5-28.3-11.7C693.5 237 689 227 689 216v-80z m-433 0c0-22.1 17.9-40 40-40s40 17.9 40 40v80c0 22.1-17.9 40-40 40-11 0-21-4.5-28.3-11.7C260.5 237 256 227 256 216v-80z m704 760c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V448h896v448z"
                      fill="#707070" p-id="6524"></path>
                  <path
                      d="M96 512h256v160H96zM96 704h256v160H96zM384 512h256v160H384zM384 704h256v160H384zM672 512h256v160H672zM672 704h256v160H672z"
                      fill="#707070" p-id="6525"></path>
                </svg>
                {{item.createdAt.split('T')[0]}}
              </div>
              <div>
                <svg class="icon" height="16" p-id="5410" t="1731633661746"
                     viewBox="0 0 1024 1024" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M513.1 187c-324 0-448.7 320-448.7 320s127 327.3 448.7 327.3S961.8 507 961.8 507 837.1 187 513.1 187z m0 522.5c-110.5 0-200.1-89.6-200.1-200.1s89.6-200.1 200.1-200.1 200.1 89.6 200.1 200.1-89.6 200.1-200.1 200.1z"
                      fill="#999999" p-id="5411"></path>
                  <path
                      d="M400.7 508.4c0 40.4 21.5 77.6 56.5 97.8 34.9 20.2 78 20.2 113 0 34.9-20.2 56.5-57.5 56.5-97.8 0-62.4-50.6-113-113-113s-113 50.6-113 113z"
                      fill="#999999" p-id="5412"></path>
                </svg>
                15k
              </div>
            </div>
            <h2 class="article-items-title">{{ item.title }}</h2>
            <div class="article-items-content">
              {{ sanitizeContent(item.content) }}
            </div>
          </div>
          <img v-if="(index+1)%2!==0" alt="" class="right-img"
               src="https://images6.alphacoders.com/714/thumbbig-714226.webp"
               width="350px">
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-a {
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  align-items: center;

  .page-title {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    .text-block {
      text-align: center;
      min-width: 400px;
      display: inline;
      background-color: #6B3F2D; /* 深棕色背景 */
      color: #fff; /* 白色字体 */
      font-size: 35px;
      letter-spacing: 10px;
      font-family: FZCSJW;
      padding: 5px 15px;
      border-radius: 5px; /* 圆角效果 */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 轻微阴影 */
    }
  }

  .page-content {
    margin: 0 auto;
    min-height: 60px;
    width: 100%;
    max-width: 1350px;
    display: flex;
    position: relative;


    .articles {
      width: 73%;
      margin: 0 auto;
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .article-items:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 轻微阴影 */
        transform: scale(1.01); // 放大效果
        img {
          transform: scale(1.05);
        }
      }

      .article-items {
        opacity: 0;
        animation: slideUp 0.5s ease;
        transition: .3s;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 轻微阴影 */
        backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
        background-color: rgba(255, 255, 255, 0.7); /* 半透明的白色背景 */
        //background-color: #fff;
        margin-bottom: 40px;
        display: flex;
        animation-fill-mode: forwards;

        img {
          height: 100%;
          transition: .3s;
          width: 40%;
          object-fit: cover;
        }

        .left-img {
          border-radius: 5px 0 0 5px;
          clip-path: polygon(0 0, 92% 0, 100% 100%, 0 100%);
        }

        .right-img {
          border-radius: 0 5px 5px 0;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
        }

        .article-items-info {
          width: 60%;
          padding: 20px;

          .article-items-status {
            display: flex;
            justify-content: right;
            gap: 20px;
            color: #777;

            div {
              display: flex;
              align-items: center;

              svg {
                margin-right: 10px;
              }
            }
          }

          .article-items-title {
            color: var(--theme-color);
            font-size: 25px;
            padding: 20px 0;
          }

          .article-items-content {
            width: 100%;
            font-size: 15px;
            color: #777;
            line-height: 30px;
            display: -webkit-box;
            -webkit-line-clamp: 3; /* 显示的行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>