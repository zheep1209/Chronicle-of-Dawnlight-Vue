<script setup>
import {firstParagraph, formattedTime, truncateContent} from '@/assets/script/utils.js'
import {onMounted, ref} from "vue";
import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/vue-3'
import {Color} from '@tiptap/extension-color'
import {ListItem} from '@tiptap/extension-list-item'
import {TextStyle} from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import {ElMessage} from 'element-plus'
import {createArticle, getArticle, listArticles, updateArticle} from "@/API/ArticleAPI.js";

let articleList = ref('')
const html = ref('');
//业务开始
onMounted(async () => {
  articleList.value = await listArticles()
  ArticleID.value =  articleList.value.data[0].id?articleList.value.data[0]:''
  await selectArticle(ArticleID.value);
  if (articleList.value.code === 0) {
    ElMessage({
      "type": Error,
      "message": '获取用户笔记出错，请刷新页面'
    })
  }
  console.log(articleList.value.data)
})

// 先获取该用户全部笔记
// 如果用户没有笔记，则自动打开默认内容，当用户编辑默认内容触发save，则保存笔记
const defaultContent = `
<h1>请输入标题</h1>
<p>请输入内容</p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
`
let editor = useEditor({
  content: articleList.value.data ? articleList.value.data[0].content : defaultContent,
  extensions: [
    StarterKit,
    Color.configure({types: [TextStyle.name, ListItem.name]}),
    TextStyle.configure({types: [ListItem.name]}),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight,
  ],
  onUpdate: ({editor}) => {
    html.value = editor.getHTML()
    data.value.title = firstParagraph(html.value)
    data.value.content = html.value
    // console.log("html:",html.value)
    // console.log("title",data.value.title)
    // console.log("content",data.value.content)
  }
});
// id
const ArticleID = ref('')
// 选择文章
const selectArticle = async (id) => {
  console.log(articleList.value)
  try {
    const article = await selectById(id);
    const content = article.content;

    if (editor.value) {
      editor.value.commands.setContent(content);
    }

    ArticleID.value = id;
  } catch (error) {
    console.error('获取文章内容失败:', error);
  }
};
// id查找文章
const selectById =async (id)=>{
  const result = await getArticle(id)
  if (result.code===1){
    console.log("文章数据",result)
    return result.data
  }
}
// 失焦保存
const data = ref({
  title: "",
  content: "",
  isPrivate: true,
  createdAt: "",
  updatedAt: ""
})
const save = async () => {
  if (!ArticleID.value){
    // 列表无数据，新增
    if (data.value.content === "") {
    }
    else {
      data.value.updatedAt = formattedTime()
      data.value.createdAt = formattedTime()
      console.log(data.value)
      const result = await createArticle(data.value)
      articleList.value = await listArticles()
      // console.log(result)
      if (result.code !== 1) {
        ElMessage({
          message: "保存失败，" + result.msg,
          type: "error"
        })
      }
    }
  }else if (ArticleID.value){
    // 列表有数据，检查ID后编辑
    // console.log("待提交的数据",data.value)
    console.log(data.value)
    const result = await updateArticle(ArticleID.value,data.value)
    // console.log(result)
    articleList.value = await listArticles()
    if (result.code !== 1) {
      ElMessage({
        message: "保存失败，" + result.msg,
        type: "error"
      })
    }
  }
}
// 新建笔记
const add=()=>{
  ArticleID.value = '';
  if (editor.value) {
    editor.value.commands.setContent(defaultContent);
  }
}
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
          <div v-if="articleList" class="sum">共{{ articleList.data.length }}项</div>
          <div class="button-group">
            <div class="more-select">多选</div>
            <div class="add" @click="add">new</div>
          </div>
        </div>
      </div>
      <div class="list">
        <el-scrollbar height="74vh">
          <div v-if="!articleList.data" class="tips">你还没有笔记哦</div>
          <div @click="selectArticle(item.id)" v-for="item in articleList.data" class="item">
            <div class="title">{{ item.title }}</div>
            <div class="content">{{ truncateContent(item.content) }}</div>
            <div class="info">
              <div class="icon">{{item.isPrivate?"私密":"公开"}}</div>
              <div class="time">{{item.updatedAt}}</div>
              <div class="label">分类</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="edit" @focusout="save">
      <div v-if="editor" class="container">
        <div class="control-group">
          <div class="button-group">
            <el-switch
                v-model="data.isPrivate"
                active-text="私密"
                inactive-text="公开"
                size="small"
            />
            <button :disabled="!editor.can().chain().focus().undo().run()" @click="editor.chain().focus().undo().run()">
              撤销
            </button>
            <button :disabled="!editor.can().chain().focus().redo().run()" @click="editor.chain().focus().redo().run()">
              返回
            </button>
            <button :class="{ 'is-active': editor.isActive('bold') }"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    @click="editor.chain().focus().toggleBold().run()">
              加粗
            </button>
            <button :class="{ 'is-active': editor.isActive('italic') }"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    @click="editor.chain().focus().toggleItalic().run()">
              斜体
            </button>
            <button :class="{ 'is-active': editor.isActive('strike') }"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    @click="editor.chain().focus().toggleStrike().run()">
              删除线
            </button>
            <button :class="{ 'is-active': editor.isActive('paragraph') }"
                    @click="editor.chain().focus().setParagraph().run()">
              段落
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
              标题1
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
              标题2
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
              标题3
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">
              标题4
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 5 }).run()">
              标题5
            </button>
            <button :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
                    @click="editor.chain().focus().toggleHeading({ level: 6 }).run()">
              标题6
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
              水平线
            </button>
            <!--            <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">-->
            <!--              Blockquote-->
            <!--            </button>-->
            <button :class="{ 'is-active': editor.isActive('highlight') }"
                    @click="editor.chain().focus().toggleHighlight().run()">
              Highlight
            </button>
            <button :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
                    @click="editor.chain().focus().setTextAlign('left').run()">
              Left
            </button>
            <button :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
                    @click="editor.chain().focus().setTextAlign('center').run()">
              Center
            </button>
            <button :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
                    @click="editor.chain().focus().setTextAlign('right').run()">
              Right
            </button>
            <button :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }"
                    @click="editor.chain().focus().setColor('#958DF1').run()">
              紫色
            </button>
            <button :class="{ 'is-active': editor.isActive('textStyle', { color: 'rgba(0,0,0)' }) }"
                    @click="editor.chain().focus().setColor('#000000').run()">
              黑色
            </button>
          </div>
        </div>
        <el-scrollbar height="80vh">
          <editor-content :editor="editor"/>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$text-color: #858585;
@media (min-width: 800px) {
  .home {
    height: 100vh;
    box-shadow: 0 0 10px 1px #e5e5e5;
    margin: 40px;
    background-color: #fffffa;
    border-radius: 20px;
    display: flex;

    .preview {
      min-width: 300px;
      height: 100%;
      width: 30%;
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

        .tips {
          padding-top: 20px;
          text-align: center;
          color: #a7a7a7;
        }

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

    .edit {
      width: 100%;
      padding: 20px;

      .container {
        .tiptap {
          border: none;
          width: 100%;
        }

        :focus-visible {
          outline: none;
        }

        .control-group {
          .button-group {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;

            button {
              font-weight: 100;
              padding-inline: 6px;
              border-radius: 5px;
              background-color: #f0eeed;
            }

            .is-active {
              border: none;
              color: white;
              background-color: #ff82ba;
            }

            button:focus {
              background-color: #bebebe;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 800px) {
  .home {
    height: 100vh;
    box-shadow: 0 0 10px 1px #e5e5e5;
    margin: 40px 0;
    background-color: #fffffa;
    border-radius: 20px;
    min-width: 300px;

    .preview {
      height: 100%;


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
}
</style>