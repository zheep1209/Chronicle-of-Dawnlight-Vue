<script setup>
import {firstParagraph, truncateContent} from '@/assets/script/utils.js'
import {onMounted, ref} from "vue";
import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/vue-3'
import {Color} from '@tiptap/extension-color'
import {ListItem} from '@tiptap/extension-list-item'
import {TextStyle} from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleByCategoryId,
  listArticles,
  updateArticle, updateCategoryByIds
} from "@/API/ArticleAPI.js";
import {createCategories, delCategories, getCategoriesList} from "@/API/categoryAPI.js";

let articleList = ref('')
const html = ref('');
//业务开始
onMounted(async () => {
  try {
    const response = await listArticles();
    articleList.value = response;

    if (articleList.value && articleList.value.data && articleList.value.data.length > 0) {
      ArticleID.value = articleList.value.data[0].id;
      await selectArticle(ArticleID.value);
    } else {
      ArticleID.value = '';
    }

    if (articleList.value && articleList.value.code === 0) {
      ElMessage({
        type: 'error',
        message: '获取用户笔记出错，请刷新页面'
      });
    }

    // 获取全部标签列表
    await getCategories();
  } catch (error) {
    console.error('Error in onMounted:', error);
    ElMessage({
      type: 'error',
      message: '发生未知错误，请刷新页面'
    });
  }
});

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
  }
});
// 手动调用editor更新
// 定义 onUpdate 回调
const handleUpdate = (editor) => {
  html.value = editor.getHTML();
  data.value.title = firstParagraph(html.value);
  data.value.content = html.value;
  // console.log(html.value);
};
// 已选文章的id
const ArticleID = ref('')
// 选择文章
const selectArticle = async (id) => {
  // console.log(articleList.value)
  // console.log("打印", id, "end")
  try {
    const article = await selectById(id);
    const content = article.content;
    if (editor.value) {
      editor.value.commands.setContent(content);
      handleUpdate(editor.value)
    }
    ArticleID.value = id;
  } catch (error) {
    console.error('获取文章内容失败:', error);
  }
};
// id查找文章
const selectById = async (id) => {
  const result = await getArticle(id)
  if (result.code === 1) {
    // console.log("文章数据", result)
    return result.data
  }
}
// 保存
const data = ref({
  title: "",
  content: "",
  isPrivate: true,
  createdAt: "",
  updatedAt: ""
})
const save = async () => {
  if (!ArticleID.value) {
    // 列表无数据，新增
    if (data.value.content === "") {
    } else {
      // console.log(data.value)
      const result = await createArticle(data.value)
      articleList.value = await listArticles()
      if (result.code !== 1) {
        ElMessage({
          message: "保存失败，" + result.msg,
          type: "error"
        })
      } else {
        ArticleID.value = result.data
        ElMessage({
          message: "已保存",
          type: "success"
        })
      }
    }
  } else if (ArticleID.value) {
    // 列表有数据，检查ID后编辑
    // console.log(data.value)
    const result = await updateArticle(ArticleID.value, data.value)
    articleList.value = await listArticles()
    if (result.code === 1) {
      ElMessage({
        message: "已保存",
        type: "success"
      })
    }
  }
}
// 新建笔记
const add = () => {
  ArticleID.value = '';
  if (editor.value) {
    editor.value.commands.setContent(defaultContent);
  }
}
// 批量删除
const deleteArticles = async () => {
  const result = await deleteArticle(checkedArticles.value);
  if (result.code === 1) {
    ElMessage({
      message: "删除成功",
      type: "success"
    })
    articleList.value = await listArticles()
  } else {
    ElMessage({
      message: "删除失败" + result.msg,
      type: "error"
    })
  }
}
// 已选择的文章ID列表
let checkedArticles = ref([])
// 多选
let isMore = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const handleCheckAllChange = (val) => {
  checkedArticles.value = val ? articleList.value.data.map(item => item.id) : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === articleList.value.data.map(item => item.id).length
  isIndeterminate.value = checkedCount > 0 && checkedCount < articleList.value.data.map(item => item.id).length
}
// 当前选择的标签ID
let currentID = ref('')

// 获取与给定值匹配的标签
function getLabelByValue(value) {
  if (!options.value) {
    return null;
  }
  const matchedOption = options.value.find(option => option.value === value);
  return matchedOption ? matchedOption.label : null;
}

// 标签选择
let options = ref()
// 获取全部标签
const getCategories = async () => {
  options.value = [
    {
      value: 0,
      label: '全部笔记',
    },
    {
      value: 1,
      label: '未分类',
    },]
  const result = await getCategoriesList()
  // console.log(result)
  if (result.code === 1) {
    await result.data.forEach((item) => {
      options.value.push({
        value: item.id,
        label: item.name
      })
    })
    // console.log("获取分类:", options.value)
  } else {
    ElMessage({
      message: "获取分类失败" + result.msg,
      type: "error"
    })
  }
}
// 添加标签
const addCategories = () => {
  ElMessageBox.prompt('请输入分类名', 'Tip', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
      .then(async ({value}) => {
        const result = await createCategories({id: '', name: value})
        if (result.code === 1) {
          ElMessage({
            type: 'success',
            message: `成功添加:${value}标签`,
          })
          await getCategories()
        } else {
          ElMessage({
            type: 'info',
            message: '添加错误' + result.msg,
          })
        }
      })
      .catch(() => {

      })
}
// 移动文章/批量修改文章标签
const popoverRef = ref()
const moveArticle = async (categoriesId) => {
  if (checkedArticles.value.length == 0) {
    ElMessage({
      message: "你还没有选择文章",
      type: "error"
    })
    return;
  }
  // 业务！启动！
  const result = await updateCategoryByIds(checkedArticles.value, categoriesId)
  if (result.code === 1) {
    ElMessage({
      message: "移动成功",
      type: "success"
    })
    articleList.value = await listArticles()
  } else {
    ElMessage({
      message: "移动失败" + result.msg,
      type: "error"
    })
  }
}
// 通过分类ID查询当前ID下的文章
const articleByCategoryId = async () => {
  if (currentID.value[0] === 0) {
    //全部笔记
    articleList.value = await listArticles()
  }
  else {
    const result = await getArticleByCategoryId(currentID.value[0]===''?'':currentID.value[0])
    if (result.code === 1) {
      articleList.value.data = result.data
    } else {
      ElMessage({
        message: "获取文章失败" + result.msg,
        type: "error"
      })
    }
  }
}
// 删除标签
const delCategory = async (id) => {
  console.log(id)
  const result = await delCategories(id)
  console.log(result)
  if (result.code === 1) {
    ElMessage({
      message: "已删除",
      type: "success"
    })
    options.value = [
      {
        value: 0,
        label: '全部笔记',
      }]
    await getCategories();
  } else {
    ElMessage({
      message: "删除失败" + "请将当前在此分类中的文章移出",
      type: "error"
    })
  }
}
</script>
<template>
  <div class="home">
    <div class="preview">
      <div class="border">
        <div class="above">
          <div class="title">
            <el-cascader v-model="currentID" :options="options" placeholder="全部笔记"
                         style="background-color: #fffffa;"
                         @change="articleByCategoryId"/>
            <div @click="addCategories">
              <svg class="icon" height="25px" p-id="4264" t="1730114441421"
                   version="1.1" viewBox="0 0 1024 1024" width="25px" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M703.335746 550.266535l-153.069211 0 0 153.069211-76.535117 0 0-153.069211-153.069211 0 0-76.535117 153.069211 0 0-153.069211 76.535117 0 0 153.069211 153.069211 0L703.335746 550.266535zM511.998977 129.327484c-210.469526 0-382.672516 172.201967-382.672516 382.672516s172.20299 382.672516 382.672516 382.672516c210.469526 0 382.672516-172.201967 382.672516-382.672516S722.469526 129.327484 511.998977 129.327484z"
                    fill="#8a8a8a" p-id="4265"></path>
              </svg>
            </div>
            <el-popover
                :width="200"
                placement="top"
                title="请选择要删除的分类"
                trigger="click">
              <el-popconfirm
                  v-for="item in options"
                  cancel-button-text="No"
                  confirm-button-text="Yes"
                  icon-color="#626AEF"
                  title="你确定要删除它吗?"
                  @confirm="delCategory(item.value)">
                <template #reference>
                  <div class="delItem">{{ item.label === "全部笔记" ? "" : item.label }}</div>
                </template>
              </el-popconfirm>
              <template #reference>
                <div>
                  <svg class="icon" height="20" viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M507.904 52.224q95.232 0 179.2 36.352t145.92 98.304 98.304 145.408 36.352 178.688-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-178.688-36.352-145.408-98.304-98.304-145.92-36.352-179.2 36.352-178.688 98.304-145.408 145.408-98.304 178.688-36.352zM736.256 573.44q30.72 0 55.296-15.872t24.576-47.616q0-30.72-24.576-45.568t-55.296-14.848l-452.608 0q-30.72 0-56.32 14.848t-25.6 45.568q0 31.744 25.6 47.616t56.32 15.872l452.608 0z"
                        fill="#8a8a8a"/>
                  </svg>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="icon">图标</div>
        </div>
        <div class="under">
          <div>
            <div v-if="articleList.value" class="sum">共{{ articleList.data.length }}项</div>
            <div v-if="isMore">
              <el-checkbox @change="handleCheckAllChange">
                全选
              </el-checkbox>
            </div>
          </div>
          <div class="button-group">
            <div v-if="isMore" class="more-button">
              <div class="del" @click="deleteArticles">
                <svg class="icon" height="25" p-id="5223" t="1730088400772"
                     version="1.1" viewBox="0 0 1024 1024" width="25" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M783.72 958.39h-539c-41.75 0-75.72-33.46-75.72-74.6V242.5c0-21.18 17.17-38.36 38.36-38.36s38.36 17.17 38.36 38.36v639.17h537V242.5c0-21.18 17.17-38.36 38.36-38.36s38.36 17.17 38.36 38.36v641.29c0 41.14-33.97 74.6-75.72 74.6z"
                      fill="#8a8a8a" p-id="5224"></path>
                  <path
                      d="M706.01 244.51c-21.19 0-38.36-17.17-38.36-38.36v-63.82H360.79v63.82c0 21.18-17.17 38.36-38.36 38.36-21.19 0-38.36-17.17-38.36-38.36v-65.93c0-41.83 27.11-74.6 61.71-74.6h336.87c34.6 0 61.71 32.77 61.71 74.6v65.93c0.01 21.18-17.16 38.36-38.35 38.36z"
                      fill="#8a8a8a" p-id="5225"></path>
                  <path
                      d="M921.14 256.01H102.86c-21.18 0-38.36-17.17-38.36-38.36s17.17-38.36 38.36-38.36h818.29c21.19 0 38.36 17.17 38.36 38.36s-17.18 38.36-38.37 38.36zM514.22 763.27c-21.19 0-38.36-17.17-38.36-38.36V405.27c0-21.18 17.17-38.36 38.36-38.36 21.19 0 38.36 17.17 38.36 38.36v319.64c0 21.18-17.17 38.36-38.36 38.36zM360.79 699.34c-21.19 0-38.36-17.17-38.36-38.36V469.2c0-21.18 17.17-38.36 38.36-38.36s38.36 17.17 38.36 38.36v191.79c0 21.18-17.17 38.35-38.36 38.35zM667.65 699.34c-21.19 0-38.36-17.17-38.36-38.36V469.2c0-21.18 17.17-38.36 38.36-38.36 21.19 0 38.36 17.17 38.36 38.36v191.79c0 21.18-17.17 38.35-38.36 38.35z"
                      fill="#8a8a8a" p-id="5226"></path>
                </svg>
              </div>
              <el-popover :width="160" placement="top" title="请选择分类" trigger="click">
                <div v-for="item in options" class="selectCategory" @click="moveArticle(item.value===0?'':item.value)">
                  {{ item.value === 0 ? "" : item.label }}
                </div>
                <template #reference>
                  <div class="move" @click="moveArticles">
                    <svg class="icon" height="20" p-id="5122" t="1730088948026"
                         version="1.1" viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M535.6544 983.04h-299.008V307.2h376.9344v113.2544a40.96 40.96 0 0 0 40.96 40.96H942.08V675.84h-81.92V542.72H611.0208a80.6912 80.6912 0 0 1-79.36-81.92v-71.68H318.5664v512h217.088z"
                          fill="#8a8a8a" p-id="5123"></path>
                      <path
                          d="M207.6672 753.0496H81.92V40.96h396.1856v122.88a40.96 40.96 0 0 0 40.96 40.96H828.416v199.0656h-81.92V286.72H478.1056a81.92 81.92 0 0 1-81.92-81.92v-81.92H163.84v548.2496h43.8272zM746.496 675.328h81.92V983.04h-81.92z"
                          fill="#8a8a8a" p-id="5124"></path>
                      <path d="M633.6512 788.2752h307.6096v81.92H633.6512z" fill="#8a8a8a" p-id="5125"></path>
                    </svg>
                  </div>
                </template>
              </el-popover>
            </div>
            <div :style="isMore?'color: white;background-color: #ff82ba;':''" class="more-select"
                 @click="isMore=!isMore">{{ isMore ? "取消" : "多选" }}
            </div>
            <div v-if="!isMore" class="save" @click="save">保存</div>
            <div v-if="!isMore" class="add" @click="add">new</div>
          </div>
        </div>
      </div>
      <div class="list">
        <el-scrollbar>
          <div v-if="!articleList.data" class="tips">你还没有笔记哦</div>
          <el-checkbox-group
              v-model="checkedArticles"
              @change="handleCheckedCitiesChange">
            <div v-for="item in articleList.data" class="item" @click="selectArticle(item.id)">
              <el-checkbox v-if="isMore&&articleList.data" :key="item.id" :value="item.id">
              </el-checkbox>
              <div class="cardInfo">
                <div class="title">{{ item.title }}</div>
                <div class="content">{{ truncateContent(item.content) }}</div>
                <div class="info">
                  <div class="icon">{{ item.isPrivate ? "私密" : "公开" }}</div>
                  <div class="time">{{ item.updatedAt.split('T')[0] }}</div>
                  <div class="label">{{ item.categoryId === null ? "未分类" : getLabelByValue(item.categoryId) }}</div>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
    </div>
    <div class="edit">
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
        <el-scrollbar height="70vh" max-height="100%">
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
    box-shadow: 0 0 10px 1px #e5e5e5;
    max-height: 85vh;
    margin: 40px 40px 0 40px;
    background-color: #fffffa;
    border-radius: 20px;
    display: flex;

    .preview {
      min-width: 300px;
      height: 100%;
      width: 30%;
      border-right: #d2d2d2 1px solid;
      display: flex;
      flex-direction: column;
      gap: 20px;

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
            color: #a7a7a7;
            display: flex;
            gap: 10px;
            align-items: center;
            font-size: 20px;
            font-weight: 600;

            div {
              display: flex;
              justify-content: center;
              align-items: center;
            }
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

            div {
              padding: 5px 15px;
              border-radius: 17px;
              font-weight: 600;
              height: 2em;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .more-select {
              background-color: #d7d7d7;
              min-width: 65px;
            }

            .save {
              margin-left: 10px;
              background-color: #ff82ba;
              min-width: 65px;
              color: white;
            }

            .add {
              margin-left: 10px;
              color: white;
              background-color: #ff82ba;
              min-width: 65px;
            }
          }
        }
      }

      .list {
        width: 100%;
        height: 100%;

        .el-scrollbar {
          height: 70vh;
          max-height: 100%
        }

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
          display: flex;
          align-items: center;

          .cardInfo {
            padding: 10px 0;

            .title {
              height: 20px;
              font-size: 16px;
              font-weight: 600;
            }

            .content {
              height: 20px;
              font-size: 16px;
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

        }

        .item:hover {
          background-color: #e1e1e1;
        }
      }
    }

    .edit {
      width: 100%;

      .el-scrollbar {
        padding: 20px;
      }

      .container {

        :focus-visible {
          outline: none;
        }

        .control-group {
          .button-group {
            padding: 20px;
            border-bottom: #a7a7a7 1px solid;
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
            display: flex;
            align-items: center;
          }

          .icon {
            display: block;
          }
        }

        .under {
          display: flex;
          justify-content: space-between;
          height: 35px;
          .sum {
            font-size: 14px;
            color: #a7a7a7;
          }

          .button-group {
            display: flex;
            justify-content: space-between;
            gap: 40px;

            .more-button {
              display: flex;
              align-items: center;
            }

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

            .save {
              margin-left: 10px;
              background-color: #ff82ba;
              min-width: 65px;
              color: white;
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

        .el-scrollbar {
          height: 75.1vh;
        }

        .item {
          transition: 0.5s;
          border-radius: 10px;
          margin: 20px;
          background-color: #eaeaea;
          padding: 10px;
          display: flex;
          align-items: center;

          .cardInfo {
            padding: 10px 0;

            .title {
              height: 20px;
              font-size: 16px;
              font-weight: 600;
            }

            .content {
              height: 20px;
              font-size: 16px;
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
        }

        .item:hover {
          background-color: #e1e1e1;
        }
      }
    }

    .edit {
      display: none;
    }
  }
}
</style>