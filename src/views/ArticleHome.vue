<script setup>
import '/src/assets/script/leaves.js'
import {firstParagraph, showMessage, truncateContent} from '@/assets/script/utils.js'
import {onMounted, ref} from "vue";
import StarterKit from '@tiptap/starter-kit'
import {EditorContent, useEditor} from '@tiptap/vue-3'
import {Color} from '@tiptap/extension-color'
import {ListItem} from '@tiptap/extension-list-item'
import {TextStyle} from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import {ElMessageBox} from 'element-plus'
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
    articleList.value = await listArticles();

    if (articleList.value && articleList.value.data && articleList.value.data.length > 0) {
      ArticleID.value = articleList.value.data[0].id;
      await selectArticle(ArticleID.value);
    } else {
      ArticleID.value = '';
    }

    if (articleList.value && articleList.value.code === 0) {
      showMessage('获取用户笔记出错，请刷新页面', 'error');
    }

    // 获取全部标签列表
    await getCategories();
  } catch (error) {
    showMessage('发生未知错误，请刷新页面', 'error');
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
    Highlight
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
};
// 已选文章的id
const ArticleID = ref('')
// 选择文章
const selectArticle = async (id) => {
  try {
    const article = await selectById(id);
    const content = article.content;
    if (editor.value) {
      editor.value.commands.setContent(content);
      handleUpdate(editor.value)
    }
    ArticleID.value = id;
  } catch (error) {
    showMessage("获取文章内容失败", "error");
  }
};
// id查找文章
const selectById = async (id) => {
  const result = await getArticle(id)
  if (result.code === 1) {
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

      const result = await createArticle(data.value)
      articleList.value = await listArticles()
      if (result.code !== 1) {
        showMessage("保存失败，" + result.msg, "error")
      } else {
        ArticleID.value = result.data
        showMessage("已保存", "success")
      }
    }
  } else if (ArticleID.value) {
    const result = await updateArticle(ArticleID.value, data.value)
    articleList.value = await listArticles()
    if (result.code === 1) {
      showMessage("已保存", "success")
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
    showMessage("删除成功", "success")
    articleList.value = await listArticles()
  } else {
    showMessage("删除失败" + result.msg, "error")
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
  if (result.code === 1) {
    await result.data.forEach((item) => {
      options.value.push({
        value: item.id,
        label: item.name
      })
    })
  } else {
    showMessage("获取分类失败: " + result.msg, 'error');
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
          showMessage(`成功添加:${value}标签`, 'success');
          await getCategories()
        } else {
          showMessage('添加错误' + result.msg, 'info');
        }
      })
      .catch(() => {

      })
}
// 移动文章/批量修改文章标签
const moveArticle = async (categoriesId) => {
  if (!checkedArticles.value || checkedArticles.value.length === 0) {
    showMessage('你还没有选择文章', 'error');
    return;
  }
  // 业务！启动！
  const result = await updateCategoryByIds(checkedArticles.value, categoriesId)
  if (result.code === 1) {
    showMessage('移动成功', 'success');
    articleList.value = await listArticles()
  } else {
    showMessage('移动失败', 'error');
  }
}
// 通过分类ID查询当前ID下的文章
const articleByCategoryId = async () => {
  if (currentID.value[0] === 0) {
    //全部笔记
    articleList.value = await listArticles()
  } else {
    const result = await getArticleByCategoryId(currentID.value[0] === '' ? '' : currentID.value[0])
    if (result.code === 1) {
      articleList.value.data = result.data
    } else {
      showMessage('获取文章失败', 'error');
    }
  }
}
// 删除标签
const delCategory = async (id) => {
  const result = await delCategories(id)
  if (result.code === 1) {
    showMessage('已删除', 'success');
    options.value = [
      {
        value: 0,
        label: '全部笔记',
      }]
    await getCategories();
  } else {
    showMessage("删除失败" + "请将当前在此分类中的文章移出", 'error');
  }
}
</script>
<template>
  <div class="home-a">
    <div class="page-title">
      <div class="text-block">
        <span class="ft">东</span>方<span style="color: red;">文</span>花帖
      </div>
    </div>
    <div class="page-content">
      <div class="preview">
        <div class="border">
          <div class="above">
            <div class="title">
              <el-cascader v-model="currentID" :options="options" placeholder="全部笔记"
                           @change="articleByCategoryId"/>
              <div @click="addCategories">
                <svg class="icon" height="25px" p-id="4264"
                     viewBox="0 0 1024 1024" width="25px" xmlns="http://www.w3.org/2000/svg">
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
            <router-link class="wenhuatie-button" to="/wenwenNews">《文文。新闻》</router-link>
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
                       viewBox="0 0 1024 1024" width="25" xmlns="http://www.w3.org/2000/svg">
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
                  <div v-for="item in options" class="selectCategory"
                       @click="moveArticle(item.value===0?'':item.value)">
                    {{ item.value === 0 ? "" : item.label }}
                  </div>
                  <template #reference>
                    <div class="move" @click="moveArticles">
                      <svg class="icon" height="20" p-id="5122" t="1730088948026"
                           viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
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
              <div :style="isMore?'color: white;background-color: var(--theme-color);':'color:var(--theme-font-color)'"
                   class="more-select"
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
                  <div class="card-title">{{ item.title }}</div>
                  <div class="card-content">{{ truncateContent(item.content) }}</div>
                  <div class="card-info">
                    <div class="icon">{{ item.isPrivate ? "私密" : "公开" }}</div>
                    <div class="time">{{ item.updatedAt.split('T')[0] }}</div>
                    <div class="label">{{
                        item.categoryId === null ? "未分类" : getLabelByValue(item.categoryId)
                                       }}
                    </div>
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
              <!--撤销-->
              <button :disabled="!editor.can().chain().focus().undo().run()"
                      @click="editor.chain().focus().undo().run()">
                <svg class="icon" height="20" p-id="37677" t="1731410793576"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M396.8 200.533333l64 64L384 341.333333h298.666667c119.466667 0 213.333333 93.866667 213.333333 213.333334s-93.866667 213.333333-213.333333 213.333333H298.666667v-85.333333h384c72.533333 0 128-55.466667 128-128s-55.466667-128-128-128H170.666667l226.133333-226.133334z"
                      fill="#515151" p-id="37678"></path>
                </svg>
              </button>
              <!--返回-->
              <button :disabled="!editor.can().chain().focus().redo().run()"
                      @click="editor.chain().focus().redo().run()">
                <svg class="icon" height="20" p-id="37677" style="transform: scaleX(-1);"
                     t="1731410793576" viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M396.8 200.533333l64 64L384 341.333333h298.666667c119.466667 0 213.333333 93.866667 213.333333 213.333334s-93.866667 213.333333-213.333333 213.333333H298.666667v-85.333333h384c72.533333 0 128-55.466667 128-128s-55.466667-128-128-128H170.666667l226.133333-226.133334z"
                      fill="#515151" p-id="37678"></path>
                </svg>

              </button>
              <!--加粗-->
              <button :class="{ 'is-active': editor.isActive('bold') }"
                      :disabled="!editor.can().chain().focus().toggleBold().run()"
                      @click="editor.chain().focus().toggleBold().run()">
                <svg class="icon" height="20" p-id="35431" t="1731410697143"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M768.96 575.072c-22.144-34.112-54.816-56.8-97.984-68.032v-2.176c22.88-10.88 42.112-23.04 57.696-36.48 15.616-12.704 27.584-26.144 35.936-40.288 16.32-29.76 24.128-60.96 23.392-93.632 0-63.872-19.776-115.232-59.328-154.08-39.2-38.464-97.824-58.048-175.84-58.784H215.232v793.728H579.52c62.432 0 114.496-20.864 156.256-62.624 42.112-39.936 63.52-94.176 64.224-162.752 0-41.376-10.336-79.68-31.04-114.88zM344.32 228.832h194.912c43.904 0.736 76.224 11.424 96.896 32.128 21.056 22.144 31.584 49.184 31.584 81.12s-10.528 58.432-31.584 79.488c-20.672 22.848-52.992 34.304-96.896 34.304H344.32V228.832z m304.352 536.256c-20.672 23.584-53.344 35.744-97.984 36.48H344.32v-238.432h206.336c44.64 0.704 77.312 12.512 97.984 35.392 20.672 23.232 31.04 51.168 31.04 83.84 0 31.904-10.336 59.488-31.008 82.72z"
                      fill="#515151" p-id="35432"></path>
                </svg>
              </button>
              <!--斜体-->
              <button :class="{ 'is-active': editor.isActive('italic') }"
                      :disabled="!editor.can().chain().focus().toggleItalic().run()"
                      @click="editor.chain().focus().toggleItalic().run()">
                <svg class="icon" height="20" p-id="34355" t="1731410666424"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M768 85.792h-288a32 32 0 0 0 0 64h96.32l-230.336 704H256a32 32 0 0 0 0 64h288a32 32 0 0 0 0-64h-93.728l230.528-704H768a32 32 0 0 0 0-64z"
                      fill="#707070" p-id="34356"></path>
                </svg>
              </button>
              <!--删除线-->
              <button :class="{ 'is-active': editor.isActive('strike') }"
                      :disabled="!editor.can().chain().focus().toggleStrike().run()"
                      @click="editor.chain().focus().toggleStrike().run()">
                <svg class="icon" height="20" p-id="33329" t="1731410629943"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M1024 511.81H687.11c-38.48-16.41-94.03-35.49-167.45-57.37-77.09-22.34-126.25-39.09-146.36-50.27-45.8-24.57-68.14-56.98-68.14-97.18 0-45.82 18.98-79.32 56.98-101.66 33.5-20.11 79.32-29.07 138.52-29.07 64.8 0 115.07 13.41 150.82 42.45 34.64 27.93 56.98 70.39 67.05 128.48H809c-7.82-83.77-37.98-147.45-91.61-189.91C666 115.94 594.5 95.83 505.14 95.83c-82.68 0-150.82 17.89-203.34 53.64-59.2 37.98-88.25 92.73-88.25 161.98 0 67.05 30.16 118.43 91.61 154.18 19.87 10.38 61.41 26.15 123.58 46.19H0v93.09h681.64c35.63 26.24 54.75 59.59 54.75 100.93 0 42.43-20.11 75.95-60.32 100.55-40.23 24.57-93.84 36.86-158.66 36.86-71.5 0-125.11-15.64-161.98-44.68-40.23-32.41-64.8-83.8-72.61-153.07h-90.5c6.7 98.32 41.34 170.93 103.91 218.98 53.61 40.2 127.34 60.32 221.18 60.32 94.98 0 169.82-20.11 225.68-59.2 55.86-40.23 83.8-96.09 83.8-165.34 0-35.82-8.24-67.53-24.42-95.34H1024v-93.11z"
                      fill="#707070" p-id="33330"></path>
                </svg>
              </button>
<!--              列表项-->
              <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
                <svg t="1731732366228" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6561" width="20" height="20"><path d="M917.044 572.14H377.858c-24.816 0-44.932-20.116-44.932-44.932s20.116-44.932 44.932-44.932h539.186c24.816 0 44.932 20.116 44.932 44.932s-20.116 44.932-44.932 44.932z m0-314.525H377.858c-24.816 0-44.932-20.116-44.932-44.932s20.116-44.932 44.932-44.932h539.186c24.816 0 44.932 20.116 44.932 44.932s-20.116 44.932-44.932 44.932zM153.198 931.597c-49.632 0-89.864-40.232-89.864-89.864s40.232-89.864 89.864-89.864 89.864 40.232 89.864 89.864-40.232 89.864-89.864 89.864z m0-314.525c-49.632 0-89.864-40.232-89.864-89.864 0-49.632 40.232-89.864 89.864-89.864s89.864 40.232 89.864 89.864c0 49.632-40.232 89.864-89.864 89.864z m0-314.525c-49.632 0-89.864-40.232-89.864-89.864s40.232-89.864 89.864-89.864 89.864 40.232 89.864 89.864-40.232 89.864-89.864 89.864z m224.66 494.254h539.186c24.816 0 44.932 20.116 44.932 44.932s-20.116 44.932-44.932 44.932H377.858c-24.816 0-44.932-20.116-44.932-44.932s20.116-44.932 44.932-44.932z" fill="#707070" p-id="6562"></path></svg>
              </button>
              <!--引用-->
              <button :class="{ 'is-active': editor.isActive('blockquote') }"
                      @click="editor.chain().focus().toggleBlockquote().run()">
                <svg class="icon" height="20" p-id="5487" t="1731730910443"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M46.545455 907.450182v-814.545455h93.090909v814.545455z m218.763636-63.162182v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h557.242182v93.090909z m0-297.472v-93.090909h708.747636v93.090909z"
                      fill="#707070" p-id="5488"></path>
                </svg>
              </button>
              <!--代码块-->
              <button :class="{ 'is-active': editor.isActive('codeBlock') }"
                      @click="editor.chain().focus().toggleCodeBlock().run()">
                <svg class="icon" height="20" p-id="4264" t="1731730876352"
                      viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M714.24 296.533333h-94.933333l202.026666 202.453334-202.453333 202.453333h94.933333l202.453334-202.453333-202.026667-202.453334zM202.666667 498.986667l202.026666-202.453334h-94.933333l-202.026667 202.453334 198.826667 199.04 3.626667 3.413333h94.933333L202.666667 498.986667zM628.48 196.906667H558.933333l-169.386666 630.186666h69.546666v-2.56l51.413334-192 116.906666-431.573333z"
                      fill="#707070" p-id="4265"></path>
                </svg>
              </button>
              <!--段落-->
              <button :class="{ 'is-active': editor.isActive('paragraph') }"
                      @click="editor.chain().focus().setParagraph().run()">
                <svg class="icon" height="20" p-id="27607" t="1731410529055"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M235.5 871.691v-740h98v304h385v-304h98v740h-98v-349h-385v349h-98z" fill="#707070"
                        p-id="27608"></path>
                </svg>
              </button>
              <!--一级标题-->
              <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
                <svg class="icon" height="20" p-id="4273" t="1731409449388"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M533.333333 116.437333a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666667a42.666667 42.666667 0 0 1-85.333333 0v-298.666667h-341.333334v298.666667a42.666667 42.666667 0 0 1-85.333333 0v-682.666667a42.666667 42.666667 0 1 1 85.333333 0v298.666667h341.333334v-298.666667a42.666667 42.666667 0 0 1 42.666666-42.666667z m344.234667 285.696v382.890667h86.016v56.746667h-250.88v-56.746667h96.170667V479.146667H730.026667v-43.605334c41.216-7.765333 70.485333-17.92 95.573333-33.450666h51.968z"
                      fill="#5A5A5C" p-id="4274"></path>
                </svg>
              </button>
              <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
                <svg class="icon" height="20" p-id="5295" t="1731409615551"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M797.824 419.072c-26.88 0-50.304 3.968-70.4 11.904a146.24 146.24 0 0 0-49.856 31.488c-13.056 13.056-22.976 27.52-29.568 43.52-6.656 16-9.92 31.488-9.92 46.272 0 12.672 3.712 22.912 11.2 30.4a38.4 38.4 0 0 0 28.16 11.264c12.8 0 22.784-4.16 29.568-12.416 6.4-7.872 12.096-18.88 17.088-33.152l2.304-6.4 5.44-13.888a34.304 34.304 0 0 1 2.368-4.672c15.104-23.04 35.52-34.496 61.76-34.496 12.352 0 23.744 2.816 34.24 8.32a62.848 62.848 0 0 1 24.704 23.424c6.08 9.984 9.088 21.376 9.088 34.112 0 11.84-2.88 23.936-8.64 36.352-5.76 12.48-14.208 24.704-25.344 36.608-8.384 9.024-18.432 18.048-30.08 27.008l-12.096 8.96c-2.752 1.92-6.08 4.352-9.856 7.36l-12.992 10.752-16.064 14.272a1385.792 1385.792 0 0 0-52.352 49.856l-32 32.576a110.08 110.08 0 0 0-19.072 30.08c-5.76 12.8-8.704 23.168-8.704 31.168 0 12.544 4.736 23.552 14.08 32.768a48.96 48.96 0 0 0 29.44 13.376l9.152 0.512h230.208c14.592 0 25.664-3.84 33.088-11.584a39.36 39.36 0 0 0 11.072-28.16 35.84 35.84 0 0 0-14.08-29.76 55.232 55.232 0 0 0-29.568-10.24l-9.408-0.384H747.52a35.392 35.392 0 0 0 13.952-10.752l3.712-4.288c5.76-7.04 14.08-15.424 24.768-25.344l17.856-15.936 21.568-18.048 40.32-33.28 26.816-23.168c13.568-12.224 26.88-29.056 39.808-50.432 13.12-21.632 19.712-45.696 19.712-72.128 0-16.896-3.2-33.152-9.472-48.832a130.368 130.368 0 0 0-26.432-41.472 125.888 125.888 0 0 0-39.424-28.224c-22.976-10.24-50.56-15.36-82.88-15.36z"
                      fill="#5D6166" p-id="5296"></path>
                  <path
                      d="M192 851.2a44.8 44.8 0 0 1-89.6 0V172.8a44.8 44.8 0 0 1 89.6 0V448h320V172.8a44.8 44.8 0 0 1 89.6 0v678.4a44.8 44.8 0 0 1-89.6 0V537.6H192v313.6z"
                      fill="#5D6166" p-id="5297"></path>
                </svg>
              </button>
              <button :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
                <svg class="icon" height="20" p-id="4480" viewBox="0 0 1024 1024"
                     width="20" x="1731409780496" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M529.152 128a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-85.333334 0v-298.666666h-341.333333v298.666666a42.666667 42.666667 0 0 1-85.333333 0V170.666667a42.666667 42.666667 0 1 1 85.333333 0v298.666666h341.333333V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z m285.696 277.333333c78.848 0 134.4 40.618667 134.4 113.493334 0 50.773333-29.269333 86.016-75.861333 103.338666v2.986667c50.773333 12.544 90.794667 50.773333 90.794666 109.909333 0 79.445333-66.304 126.037333-146.944 126.037334-69.290667 0-114.090667-27.477333-143.36-60.330667l33.450667-44.202667c25.685333 26.282667 58.538667 48.384 103.936 48.384 49.578667 0 83.626667-27.477333 83.626667-72.874666 0-48.981333-31.061333-80.64-130.218667-80.64v-50.773334c86.613333 0 115.285333-32.853333 115.285333-77.056 0-38.826667-25.685333-63.317333-67.498666-63.914666-34.048 0.597333-62.72 17.322667-87.808 41.813333l-35.84-43.008c34.645333-31.061333 75.264-53.162667 126.037333-53.162667z"
                      fill="#5A5A5C" p-id="4481"></path>
                </svg>
              </button>
              <button :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 4 }).run()">
                <svg class="icon" height="20" p-id="5613" viewBox="0 0 1024 1024"
                     width="20" x="1731409820071" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M177.948444 528.554667v310.954666c0 32.540444-16.725333 45.624889-41.870222 45.624889-27.022222 0-41.927111-13.084444-41.927111-45.624889V170.097778c0-34.417778 13.084444-48.355556 41.927111-48.355556 27.875556 0 41.870222 15.758222 41.870222 48.355556v278.357333h351.914667v-279.324444c0-37.205333 17.635556-47.445333 41.870222-47.445334 30.72 0 41.870222 13.994667 41.870223 49.379556v665.6c0 36.295111-13.937778 48.355556-40.96 48.355555-27.875556 0-42.780444-12.060444-42.780445-48.355555V528.497778H177.948444zM852.366222 768.284444H680.391111c-33.223111 0-53.418667-15.644444-53.418667-43.064888 0-14.961778 8.533333-31.857778 19.569778-48.810667l177.891556-269.824c19.569778-29.980444 37.774222-40.391111 59.278222-40.391111 32.597333 0 53.475556 16.270222 53.475556 63.886222v263.224889h18.204444c21.504 0 33.905778 9.784889 33.905778 37.148444 0 27.363556-10.410667 37.831111-33.905778 37.831111h-18.204444v71.68c0 31.288889-13.084444 41.016889-42.382223 41.016889-29.980444 0-42.382222-9.784889-42.382222-41.073777v-71.68z m-124.416-74.979555h124.472889V503.694222l-124.472889 189.610667z"
                      fill="#707070" p-id="5614"></path>
                </svg>
              </button>
              <button :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 5 }).run()">
                <svg class="icon" height="20" p-id="6734" viewBox="0 0 1024 1024"
                     width="20" x="1731409858034" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M85.333333 170.666667v682.666666a42.666667 42.666667 0 1 0 85.333334 0V170.666667a42.666667 42.666667 0 0 0-85.333334 0zM469.333333 170.666667v682.666666a42.666667 42.666667 0 1 0 85.333334 0V170.666667a42.666667 42.666667 0 0 0-85.333334 0z"
                      fill="#707070" p-id="6735"></path>
                  <path
                      d="M149.333333 554.666667h341.333334a42.666667 42.666667 0 1 0 0-85.333334h-341.333334a42.666667 42.666667 0 1 0 0 85.333334zM725.333333 768.170667Q725.333333 810.666667 768 810.666667q37.461333 0 49.792-18.56 14.208-21.376 14.208-77.44 0-56.32-13.312-80.384-8.661333-15.616-29.354667-15.616-34.218667 0-65.408 9.045333-9.685333 2.816-17.066666 5.930667l-2.090667 0.896A42.666667 42.666667 0 0 1 640 598.058667v-149.845334a42.666667 42.666667 0 0 1 42.666667-42.666666h170.666666a42.666667 42.666667 0 0 1 0 85.333333h-128v48.725333q31.146667-6.272 64-6.272 128 0 128 181.333334 0 81.834667-28.458666 124.672Q851.242667 896 768 896q-64.426667 0-99.413333-41.984-28.586667-34.218667-28.586667-85.845333a42.666667 42.666667 0 0 1 85.333333 0z m0-170.112q0 25.173333-20.053333 36.181333a42.666667 42.666667 0 0 0 20.053333-36.181333z"
                      fill="#707070" p-id="6736"></path>
                </svg>
              </button>
              <!--六级标题-->
              <button :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
                      @click="editor.chain().focus().toggleHeading({ level: 6 }).run()">
                <svg class="icon" height="20" p-id="7757" viewBox="0 0 1024 1024"
                     width="20" x="1731409891393" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M525.269333 128a42.666667 42.666667 0 0 1 42.666667 42.666667v682.666666a42.666667 42.666667 0 0 1-85.333333 0v-298.666666h-341.333334v298.666666a42.666667 42.666667 0 0 1-85.333333 0V170.666667a42.666667 42.666667 0 1 1 85.333333 0v298.666666h341.333334V170.666667a42.666667 42.666667 0 0 1 42.666666-42.666667z m325.717334 277.333333c48.981333 0 84.821333 20.906667 109.909333 47.189334l-37.632 41.813333c-16.128-19.114667-43.008-32.853333-68.693333-32.853333-56.149333 0-102.741333 42.410667-105.728 167.850666 25.685333-31.658667 63.914667-50.773333 95.573333-50.773333 74.069333 0 123.648 45.397333 123.648 138.581333 0 87.210667-59.733333 143.957333-131.413333 143.957334-83.626667 0-151.722667-69.888-151.722667-219.221334 0-169.045333 79.445333-236.544 166.058667-236.544z m-19.114667 223.402667c-25.685333 0-55.552 13.738667-81.834667 51.370667 7.168 87.210667 38.826667 128.426667 86.016 128.426666 38.229333 0 68.096-34.645333 68.096-91.392 0-56.746667-25.088-88.405333-72.277333-88.405333z"
                      fill="#707070" p-id="7758"></path>
                </svg>
              </button>
              <!--水平线-->
              <button @click="editor.chain().focus().setHorizontalRule().run()">
                <svg class="icon" height="20" p-id="25466" viewBox="0 0 1024 1024"
                     width="20" x="1731410327075" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M884.363636 465.454545a46.545455 46.545455 0 0 1 0 93.09091H186.181818a46.545455 46.545455 0 0 1 0-93.09091h698.181818z"
                      fill="#515151" p-id="25467"></path>
                </svg>
              </button>
              <!--高亮-->
              <button :class="{ 'is-active': editor.isActive('highlight') }"
                      @click="editor.chain().focus().toggleHighlight().run()">
                <svg class="icon" height="20" p-id="14893" viewBox="0 0 1029 1024"
                     width="20" x="1731409996542" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M251.507053 409.85487L720.889402 15.047287A57.758887 57.758887 0 0 1 804.23767 20.896288l206.177294 245.658052a59.952263 59.952263 0 0 1-5.849002 83.348268L547.612741 731.549938zM146.225031 679.640052l51.909886-219.337546 292.450062 319.501692H292.450062l-56.296637 43.86751H0z m-146.225031 296.105688a48.25426 48.25426 0 0 1 48.25426-48.25426h927.066696a48.25426 48.25426 0 1 1 0 95.777395H48.25426a48.25426 48.25426 0 0 1-48.25426-47.523135z"
                      fill="#666666" p-id="14894"></path>
                </svg>
              </button>
              <!--靠左-->
              <button :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
                      @click="editor.chain().focus().setTextAlign('left').run()">
                <svg class="icon" height="20" p-id="18220" viewBox="0 0 1024 1024"
                     width="20" x="1731410122141" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M725.333 800.339c17.673 0 32 14.327 32 32 0 17.496-14.041 31.713-31.47 31.995l-0.53 0.005H128c-17.673 0-32-14.327-32-32 0-17.497 14.042-31.713 31.47-31.996l0.53-0.004h597.333zM896 587.113c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.996l0.53-0.004h768zM725.333 373.887c17.673 0 32 14.327 32 32 0 17.496-14.041 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.996l0.53-0.004h597.333zM896 160.661c17.673 0 32 14.327 32 32 0 17.497-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.995l0.53-0.005h768z"
                      fill="#707070" p-id="18221"></path>
                </svg>
              </button>
              <!--居中-->
              <button :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
                      @click="editor.chain().focus().setTextAlign('center').run()">
                <svg class="icon" height="20" p-id="17198" viewBox="0 0 1024 1024"
                     width="20" x="1731410088369" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M768 800.339c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.995l-0.53 0.005H256c-17.673 0-32-14.327-32-32 0-17.497 14.042-31.713 31.47-31.996l0.53-0.004h512z m128-213.226c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.996l0.53-0.004h768zM768 373.887c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.996l-0.53 0.004H256c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.996l0.53-0.004h512z m128-213.226c17.673 0 32 14.327 32 32 0 17.497-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.995l0.53-0.005h768z"
                      fill="#707070" p-id="17199"></path>
                </svg>
              </button>
              <!--靠右-->
              <button :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
                      @click="editor.chain().focus().setTextAlign('right').run()">
                <svg class="icon" height="20" p-id="19241" viewBox="0 0 1024 1024"
                     width="20" x="1731410156932" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M896 800.339c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.995l-0.53 0.005H298.667c-17.673 0-32-14.327-32-32 0-17.497 14.041-31.713 31.47-31.996l0.53-0.004H896z m0-213.226c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.996l0.53-0.004h768z m0-213.226c17.673 0 32 14.327 32 32 0 17.496-14.042 31.713-31.47 31.996l-0.53 0.004H298.667c-17.673 0-32-14.327-32-32 0-17.496 14.041-31.713 31.47-31.996l0.53-0.004H896z m0-213.226c17.673 0 32 14.327 32 32 0 17.497-14.042 31.713-31.47 31.996l-0.53 0.004H128c-17.673 0-32-14.327-32-32 0-17.496 14.042-31.713 31.47-31.995l0.53-0.005h768z"
                      fill="#707070" p-id="19242"></path>
                </svg>
              </button>
              <!--紫色-->
              <button :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }"
                      @click="editor.chain().focus().setColor('#958DF1').run()">
                <svg class="icon" height="20" p-id="22661" viewBox="0 0 1024 1024"
                     width="20" x="1731410268222" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M379.733333 635.733333l145.066667-384 145.066667 384M465.066667 85.333333L128 938.666667h136.533333l68.266667-183.466667h379.733333l68.266667 183.466667h136.533333L584.533333 85.333333h-119.466666z"
                      fill="#958df1" p-id="22662"></path>
                </svg>
              </button>
              <!--黑色-->
              <button :class="{ 'is-active': editor.isActive('textStyle', { color: 'rgba(0,0,0)' }) }"
                      @click="editor.chain().focus().setColor('#000000').run()">
                <svg class="icon" height="20" p-id="22661" t="1731410268222"
                     viewBox="0 0 1024 1024" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M379.733333 635.733333l145.066667-384 145.066667 384M465.066667 85.333333L128 938.666667h136.533333l68.266667-183.466667h379.733333l68.266667 183.466667h136.533333L584.533333 85.333333h-119.466666z"
                      fill="#2c2c2c" p-id="22662"></path>
                </svg>
              </button>
            </div>
          </div>
          <el-scrollbar height="76.5vh" max-height="100%">
            <editor-content :editor="editor"/>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
@media (min-width: 800px) {
  .home-a {
    .page-title {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      .text-block {
        display: inline;
        background-color: #6B3F2D; /* 深棕色背景 */
        color: #fff; /* 白色字体 */
        font-size: 35px;
        letter-spacing: 10px;
        font-family: FZCSJW,serif;
        padding: 5px 15px;
        border-radius: 5px; /* 圆角效果 */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 轻微阴影 */
      }

      .text-block .ft {
        font-family: FZCSFW,serif ;
      }

    }

    .page-content {
      max-height: 85vh;
      margin: 40px 40px 0 40px;
      display: flex;
      gap: 40px;
      //overflow: hidden;
      //border-radius: 20px;

      .preview {
        backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
        background-color: rgba(255, 255, 255, 0.4); /* 半透明的白色背景 */
        position: relative;
        min-width: 300px;
        width: 30%;
        overflow: hidden;

        .border {
          padding: 20px;
          display: flex;
          flex-direction: column;

          .above {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
              height: 70px;
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

            .wenhuatie-button {
              display: inline-block;
              width: 105px;
              height: 32px;
              line-height: 32px; /* 垂直居中 */
              background: linear-gradient(135deg, #8b0000, var(--theme-color)); /* 渐变背景 */
              color: #fff;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              border-radius: 8px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .wenhuatie-button::before {
              content: "";
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: rgba(255, 255, 255, 0.2);
              transform: rotate(45deg);
              transition: opacity 0.3s;
              pointer-events: none;
            }

            .wenhuatie-button:hover::before {
              opacity: 0.1;
            }

            .wenhuatie-button:hover {
              transform: scale(1.05); /* 微微放大 */
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4), 0 0 8px rgba(255, 255, 255, 0.5); /* 增加发光效果 */
            }

            .wenhuatie-button::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 8px;
              border: 1px solid rgba(255, 255, 255, 0.6); /* 外边框闪光效果 */
              opacity: 0;
              transition: opacity 0.3s;
            }

            .wenhuatie-button:hover::after {
              opacity: 1;
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
                background-color: rgba(175, 175, 175, 0.67);
                min-width: 65px;
              }

              .save {
                margin-left: 10px;
                background-color: var(--theme-color);
                min-width: 65px;
                color: white;
              }

              .add {
                margin-left: 10px;
                color: white;
                background-color: var(--theme-color);
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
            box-shadow: -5px 0 0 var(--theme-color);
            transition: 0.5s;
            border-radius: 10px;
            margin: 20px;
            background: linear-gradient(to right, rgba(255, 230, 230, 0.6), rgba(255, 255, 250, 0.6));
            padding: 10px;
            display: flex;
            align-items: center;

            .cardInfo {
              padding: 10px 0;

              .card-title {
                height: 20px;
                font-size: 16px;
                font-weight: 600;
                color: var(--theme-font-color);
              }

              .card-content {
                font-weight: 100;
                height: 20px;
                font-size: 16px;
                color: var(--theme-font-color);
              }

              .card-info {
                font-weight: 100;
                display: flex;
                gap: 10px;
                color: var(--theme-font-color);
                font-size: 14px;

                .icon {
                  display: block;
                }

                .time {
                  display: block;
                  padding-right: 10px;
                  position: relative;
                }

                .label {
                  display: block;
                }

                .time::after {
                  content: "";
                  display: block; /* 设置为块级元素 */
                  width: 1px;
                  height: 16px;
                  background-color: var(--theme-font-color);
                  position: absolute; /* 相对于 .text-block 定位 */
                  right: 0; /* 伪元素的位置 */
                  top: 50%; /* 垂直居中 */
                  transform: translateY(-50%); /* 垂直居中 */
                }
              }
            }

          }

          .item:hover {
            background-color: rgba(225, 225, 225, 0.6);
          }
        }
      }

      .edit {
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        max-height: 85vh;
        //border-radius: 20px;
        position: relative;
        //background-color: #fff;
        //backdrop-filter: blur(10px); /* 添加背景磨砂效果 */
        background-color: rgba(255, 255, 255, 0.5); /* 半透明的白色背景 */
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
              padding: 20px 20px 0;
              display: flex;
              justify-content: center;
              gap: 20px;
              flex-wrap: wrap;

              button {
                font-weight: 100;
                padding-inline: 6px;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .is-active {
                border: var(--theme-color) 1px solid;
                color: white;
                //background-color: var(--theme-color);
              }

              button:focus {
                background-color: #bebebe;
              }
            }
          }

          .el-scrollbar {
            padding: 20px 80px 0 80px;
          }
        }
      }

      .edit:before, .edit:after {
        content: "";
        height: 98%;
        position: absolute;
        width: 100%;
        z-index: -1;
      }

      .edit:before {
        //background: #fafafa;
        background-color: rgba(255, 255, 255, 0.5); /* 半透明的白色背景 */
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        left: -5px;
        top: 4px;
        transform: rotate(-2.5deg);
      }

      .edit:after {
        //background: #f6f6f6;
        background-color: rgba(255, 255, 255, 0.5); /* 半透明的白色背景 */
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
        right: -3px;
        top: 1px;
        transform: rotate(1.4deg);
      }
    }
  }
}

@media (max-width: 800px) {
  .home {
    display: none;
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
              color: var(--theme-font-color);
            }

            .info {

              display: flex;
              gap: 10px;
              color: var(--theme-font-color);
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
                background-color: var(--theme-font-color);
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