<script setup>
import RightRow from "@/components/rightrow.vue";
import {onMounted, ref, watch} from "vue";
import {allFolder, create, deleteFolder, folderFolders} from "@/API/FolderAPI.js";
import {deleteFile, download, folderFiles, upload} from "@/API/FileAPI.js";
import {formatFileSize, showMessage} from "@/assets/script/utils.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";
import useLoginStore from "@/stores/index.js";
import axios from "axios";

onMounted(async () => {
  await getAllFolder()
  watch(currentFolder, async () => {
        await getCurrentFolderFolders()
        await getCurrentFolderFiles()
        getTableData()
      },
      {immediate: true})
})
// 获取所有文件夹
const allFolderList = ref([])
const getAllFolder = async () => {
  const res = await allFolder()
  allFolderList.value = await res.data
  // console.log("所有文件夹：", allFolderList.value);
  // 默认第一个为根文件夹，并且把根文件夹设置为当前文件夹
  currentFolder.value = res.data[0];
}
// 当前文件夹
const currentFolder = ref('')
// 当前文件夹中的所有文件夹
const currentFolderFolders = ref([])
const getCurrentFolderFolders = async () => {
  const res = await folderFolders(currentFolder.value.id)
  currentFolderFolders.value = await res.data
}
// 当前文件夹中的所有文件
const currentFolderFiles = ref([])
// 获取当前文件夹中的所有文件
const getCurrentFolderFiles = async () => {
  const res = await folderFiles(currentFolder.value.id)
  // console.log("当前文件夹中的所有文件：" , res);
  currentFolderFiles.value = res.data
  // console.log("当前文件夹中的所有文件：", currentFolder.value.id, currentFolderFiles.value);
}
// 把当前文件夹所有文件和文件夹合并
const tableData = ref([])
const getTableData = () => {
  tableData.value = [...currentFolderFiles.value, ...currentFolderFolders.value]
  // console.log("当前文件夹中的所有文件夹和文件：", tableData.value);
}
const handleEdit = async (e) => {
  if (e.parentId) {
    currentFolder.value = e;
  } else if (e.fileName) {
    try {
      const response = await download(e.id); // 调用下载 API
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', e.fileName); // 替换为实际的文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      throw e;
    }
  }
}
const root = () => {
  currentFolder.value = allFolderList.value[0];
}
// 上传文件元素
const df = ref('')
// 创建取消令牌
let cancelTokenSource = null;
// 上传文件
const uploadFile = async (param) => {
  console.log('上传文件' + param);
  const fileData = {
    file: param.file,
    description: '',
    folderId: currentFolder.value.id,
  };

  // 创建取消令牌
  cancelTokenSource = axios.CancelToken.source();

  try {
    const uploadProgressEvent = progressEvent => {
      progressPercent.value = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
      if (progressPercent.value === 100) {
        showMessage('上传成功', 'success');
        fileList.value = [];
        progressPercent.value = 0;
      }
    };

    const res = await upload(fileData, uploadProgressEvent, cancelTokenSource.token);
    await getAllFolder();
    console.log("上传文件成功：", res);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('上传已取消');
    } else {
      console.error("上传文件失败：", error);
    }
  }
};
const position = ref({})
const delVisible = ref(false)
// 新建文件夹
const folderName = ref('')
const createFolder = async (name) => {
  dialogFormVisible.value = false
  const data = {
    name,
    parentId: currentFolder.value.id,
  }
  if (!name) {
    showMessage('文件夹名称不能为空', 'error')
    return;
  }
  try {
    const res = await create(data)
    await getAllFolder()
    console.log("新建文件夹成功：", res);
  } catch (error) {
    console.error("新建文件夹失败：", error);
  }
}
const dialogFormVisible = ref(false)
// 要删除的文件或文件夹id
const fid = ref('')
const rightClick = (item, e) => {
  if (item.fileName) {
    fid.value = {
      id: item.id,
      isFile: true
    }
  } else {
    fid.value = {
      id: item.id,
      isFile: false
    }
  }
  position.value = {left: e.clientX, top: e.clientY};
  delVisible.value = true;
}
// 确认删除
const delConfirm = () => {
  ElMessageBox.confirm(
      '你确定要删除这个文件吗?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        delFile()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
}
// 删除文件或文件夹
const delFile = async () => {
  delVisible.value = false
  try {
    let res;
    if (fid.value.isFile) {
      res = await deleteFile(fid.value.id)
    } else {
      res = await deleteFolder(fid.value.id)
    }
    await getAllFolder()
    console.log("删除文件成功：", res);
  } catch (error) {
    console.error("删除文件失败：", error);
  }
}
const driver = ref(false)
const fileList = ref([])
const progressPercent = ref(0)
const removeFIle = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('上传已取消');
    progressPercent.value = 0;
  }
};

</script>

<template>
  <div class="home" @click="delVisible = false">
    <!--右键菜单-->
    <ul v-show="delVisible" :style="{left:position.left+'px',top:(position.top-90)+'px'}" class="contextmenu">
      <li @click="delConfirm()">删除</li>
    </ul>
    <el-dialog v-model="dialogFormVisible" title="新建文件夹" width="500">
      <el-input v-model="folderName" placeholder="请输入文件夹名称"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <div @click="dialogFormVisible = false">Cancel</div>
          <div type="primary" @click="createFolder(folderName)">
            Confirm
          </div>
        </div>
      </template>
    </el-dialog>
    <!--    下载抽屉-->
    <el-drawer v-model="driver" direction="btt" size="40%">
      <template #default>
        <el-upload
            :before-remove="removeFIle"
            :file-list="fileList"
            :http-request="uploadFile"
            :limit="1"
            action=""
            class="upload-demo"
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            拖转上传 或 <em>点击上传</em>
          </div>
        </el-upload>
        <el-progress :percentage="progressPercent" style="display: flex"/>
      </template>
    </el-drawer>
    <div class="app-content">
      <div style="display: flex;justify-content: space-between">
        <el-breadcrumb :separator-icon="RightRow">
          <el-breadcrumb-item>
            <div class="bread-item" @click="root">/</div>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentFolder!==allFolderList[0]">
            <div class="bread-item">{{ currentFolder.name }}</div>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin-right: 20px;gap: 20px;display: flex;align-items: center">
          <svg class="icon" data-spm-anchor-id="a313x.search_index.0.i9.20c23a81nmaFIl" height="24"
               p-id="5855"
               style="cursor: pointer" t="1733467041393"
               viewBox="0 0 1024 1024"
               width="24" xmlns="http://www.w3.org/2000/svg" @click="dialogFormVisible=true">
            <path
                class=""
                d="M224 192h-64a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64v-64h-512a64 64 0 0 1-64-64z"
                data-spm-anchor-id="a313x.search_index.0.i7.20c23a81nmaFIl" fill="#cdcdcd" p-id="5856"></path>
            <path
                class="selected"
                d="M528 590.72v-320h96v320zM416 384h320v96h-320z m-128-320h576a64 64 0 0 1 64 64v640a64 64 0 0 1-64 64h-576a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64zM320 736h512v-576H320z"
                data-spm-anchor-id="a313x.search_index.0.i8.20c23a81nmaFIl" fill="#515151"
                p-id="5857"></path>
          </svg>
          <svg class="icon" height="24" p-id="4298" style="cursor: pointer"
               t="1733459272166" viewBox="0 0 1024 1024" width="24" xmlns="http://www.w3.org/2000/svg"
               @click="driver = true">
            <path
                d="M1024 693.248q0 25.6-8.704 48.128t-24.576 40.448-36.864 30.208-45.568 16.384l1.024 1.024-17.408 0-4.096 0-4.096 0-675.84 0q-5.12 1.024-16.384 1.024-39.936 0-74.752-15.36t-60.928-41.472-40.96-60.928-14.848-74.752 14.848-74.752 40.96-60.928 60.928-41.472 74.752-15.36l1.024 0q-1.024-8.192-1.024-15.36l0-16.384q0-72.704 27.648-137.216t75.776-112.128 112.128-75.264 136.704-27.648 137.216 27.648 112.64 75.264 75.776 112.128 27.648 137.216q0 37.888-8.192 74.24t-22.528 69.12q5.12-1.024 10.752-1.536t10.752-0.512q27.648 0 52.736 10.752t43.52 29.696 29.184 44.032 10.752 53.76zM665.6 571.392q20.48 0 26.624-4.608t-8.192-22.016q-14.336-18.432-31.744-48.128t-36.352-60.416-38.4-57.344-37.888-38.912q-18.432-13.312-27.136-14.336t-25.088 12.288q-18.432 15.36-35.84 38.912t-35.328 50.176-35.84 52.224-36.352 45.056q-18.432 18.432-13.312 32.768t25.6 14.336l16.384 0q9.216 0 19.968 0.512t20.992 0.512l17.408 0q14.336 1.024 18.432 9.728t4.096 24.064q0 17.408-0.512 30.72t-0.512 25.6-0.512 25.6-0.512 30.72q0 7.168 1.536 15.36t5.632 15.36 12.288 11.776 21.504 4.608l23.552 0q9.216 0 27.648 1.024 24.576 0 28.16-12.288t3.584-38.912q0-23.552 0.512-42.496t0.512-51.712q0-23.552 4.608-36.352t19.968-12.8q11.264 0 32.256-0.512t32.256-0.512z"
                fill="#707070" p-id="4299"></path>
          </svg>
        </div>
        <input ref="df" style="display: none" type="file" @change="uploadFile($event)">
      </div>
      <table>
        <thead>
        <tr style="height: 50px">
          <th style="min-width:50%">名称</th>
          <th style="width:15%">大小</th>
          <th style="width:15%">修改时间</th>
        </tr>
        <tr v-for="item in tableData" style="height: 40px" @click="handleEdit(item)"
            @contextmenu.prevent.stop="rightClick(item,$event)">
          <td>
            <svg v-if="item.name" class="icon" height="24" p-id="3269" t="1733469155365" viewBox="0 0 1024 1024"
                 width="24" xmlns="http://www.w3.org/2000/svg">
              <path class=""
                    d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z"
                    data-spm-anchor-id="a313x.search_index.0.i0.de003a81IUdwMk" fill="#FFE9B4" p-id="3270"></path>
              <path class=""
                    d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z"
                    data-spm-anchor-id="a313x.search_index.0.i1.de003a81IUdwMk" fill="#FFB02C" p-id="3271"></path>
              <path class=""
                    d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z"
                    data-spm-anchor-id="a313x.search_index.0.i2.de003a81IUdwMk" fill="#FFCA28" p-id="3272"></path>
            </svg>
            <svg
                v-if="item.fileName && ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico', 'avif'].includes(item.fileName.split('.').pop().toLowerCase())"
                class="icon" height="24" p-id="17140"
                t="1733469472428" viewBox="0 0 1024 1024" width="24" xmlns="http://www.w3.org/2000/svg">
              <path
                  class="selected"
                  d="M868.751 199.844H155.25a44.595 44.595 0 0 0-44.596 44.595v431.068h802.688V244.44a44.595 44.595 0 0 0-44.59-44.595z"
                  data-spm-anchor-id="a313x.search_index.0.i12.de003a81IUdwMk" fill="#98DCF0"
                  p-id="17141"></path>
              <path d="M609.884 496.988l-154.946 178.52h309.867l-154.92-178.52z" fill="#699B54" p-id="17142"></path>
              <path
                  d="M583.066 675.512L376.53 437.535 169.99 675.512h-59.337v104.044a44.595 44.595 0 0 0 44.596 44.6h713.497c24.627 0 44.595-19.968 44.595-44.6V675.507l-330.275 0.005z"
                  fill="#80BB67" p-id="17143"></path>
              <path
                  d="M705.234 348.488c-0.015 32.834 26.593 59.463 59.433 59.479 32.834 0.01 59.464-26.599 59.479-59.438v-0.041c0.01-32.84-26.598-59.47-59.433-59.48-32.84-0.01-59.469 26.599-59.48 59.434v0.046z"
                  fill="#FFE68E" p-id="17144"></path>
            </svg>
            <svg
                v-if="item.fileName && ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso', 'dmg', 'cab', 'zipx', 'z', 'lzh', 'ace', 'arj', 'bz', 'cbr', 'deb', 'dmg', 'gzip', 'jar', 'lz','lzma', 'lzo', 'rar', 'rpm'].includes(item.fileName.split('.').pop().toLowerCase())"
                class="icon" height="24" p-id="19153" t="1733469867511" viewBox="0 0 1024 1024"
                width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h1024v1024H0z" fill="#D8D8D8" fill-opacity="0" p-id="19154"></path>
              <path
                  d="M938.666667 384V142.08C938.666667 112.085333 914.133333 85.333333 884.992 85.333333H139.008C109.866667 85.333333 85.333333 112.085333 85.333333 142.08V384h853.333334z"
                  fill="#55C7F7" p-id="19155"></path>
              <path
                  d="M85.333333 640v241.92c0 29.994667 24.32 56.746667 53.248 56.746667h746.837334C914.346667 938.666667 938.666667 911.914667 938.666667 881.92V640H85.333333z"
                  fill="#7ECF3B" p-id="19156"></path>
              <path d="M425.045333 85.333333h169.813334v853.333334h-169.813334z" fill="#FDAF42" p-id="19157"></path>
              <path d="M85.333333 384h853.333334v256H85.333333z" fill="#F95F5D" p-id="19158"></path>
              <path
                  d="M640 469.333333v85.333334H384v-85.333334h256m28.245333-42.666666H355.754667c-5.376 0-14.421333 3.712-14.421334 9.941333v150.784c0 3.712 5.376 9.941333 14.421334 9.941333h312.490666c5.376 0 14.421333-3.712 14.421334-9.941333v-150.784c-3.541333-7.424-9.045333-9.941333-14.421334-9.941333z"
                  fill="#FFFFFF" p-id="19159"></path>
            </svg>
            <svg v-if="item.fileName && item.fileName.split('.').pop().toLowerCase()==='exe'" class="icon"
                 height="24" p-id="23071" t="1733469979507" viewBox="0 0 1024 1024" width="24"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M757.76 942.08H266.24a163.84 163.84 0 0 1-163.84-163.84V286.72a163.84 163.84 0 0 1 163.84-163.84h440.68864l214.71232 214.71232V778.24A163.84 163.84 0 0 1 757.76 942.08z"
                  fill="#90A2B7" p-id="23072"></path>
              <path
                  d="M921.88672 337.92h-174.40768a40.96 40.96 0 0 1-40.96-40.96V122.55232l215.28576 215.28576 0.08192 0.08192z"
                  fill="#C5D2E0" p-id="23073"></path>
              <path
                  d="M406.15936 737.28v-40.63232h-108.1344v-56.68864h92.07808v-40.63232H298.02496v-54.72256h108.1344v-40.63232H252.47744V737.28h153.68192z m53.248 0l44.89216-81.26464L549.51936 737.28h52.10112l-72.74496-119.6032 67.82976-113.70496h-51.44576l-40.96 75.3664-40.63232-75.3664H411.89376l67.82976 113.70496L407.30624 737.28h52.10112z m306.83136 0v-40.63232h-108.1344v-56.68864h92.07808v-40.63232h-92.07808v-54.72256h108.1344v-40.63232h-153.68192V737.28h153.68192z"
                  fill="#FFFFFF" p-id="23074"></path>
            </svg>
            <svg
                v-if="item.fileName && ['mp4', 'avi', 'wmv', 'mov', 'flv', 'rmvb', 'mkv', 'mpg', 'mpeg', '3gp', 'rm', 'dat', 'm4v', 'asf', 'vob', 'm2v', 'm3u8','ts', 'mts', 'm2ts', 'm4v'].includes(item.fileName.split('.').pop().toLowerCase())"
                class="icon" height="24" p-id="25079" t="1733470034351" viewBox="0 0 1024 1024"
                width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.655172 123.586207h988.689656v776.827586H17.655172z" fill="#7383BF" p-id="25080"></path>
              <path d="M441.37931 635.586207V388.413793l194.206897 123.586207z" fill="#FFFFFF" p-id="25081"></path>
              <path
                  d="M17.655172 123.586207h176.551725v194.206896H17.655172zM17.655172 317.793103h176.551725v194.206897H17.655172zM17.655172 512h176.551725v194.206897H17.655172zM17.655172 706.206897h176.551725v194.206896H17.655172zM829.793103 123.586207h176.551725v194.206896H829.793103zM829.793103 317.793103h176.551725v194.206897H829.793103zM829.793103 512h176.551725v194.206897H829.793103zM829.793103 706.206897h176.551725v194.206896H829.793103z"
                  fill="#556080" p-id="25082"></path>
            </svg>
            <svg
                v-if="item.fileName && ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'amr', 'ape', 'm4a', 'wma', 'aiff', 'aif', 'wavpack', 'wv', 'mp2', 'mp1', 'm3u', 'm4b', 'm4a', 'm4p', 'm4r', 'm4v', 'ra'].includes(item.fileName.split('.').pop().toLowerCase())"
                class="icon" height="24" p-id="27519" t="1733470101902" viewBox="0 0 1024 1024"
                width="24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M814.933333 914.666667H214.4c-54.933333 0-99.733333-44.8-99.733333-99.733334V214.4c0-54.933333 44.8-99.733333 99.733333-99.733333h600.533333c54.933333 0 99.733333 44.8 99.733334 99.733333v600.533333c0 54.933333-44.8 99.733333-99.733334 99.733334z"
                  fill="#FF4C5E" p-id="27520"></path>
              <path
                  d="M349.866667 741.333333h-0.533334c-33.6 0-60.8-27.2-60.8-60.8v-80.533333c0-33.6 27.2-60.8 60.8-60.8h0.533334c33.6 0 60.8 27.2 60.8 60.8v80.533333c0 33.6-27.2 60.8-60.8 60.8zM685.866667 736h-0.533334c-33.6 0-60.8-27.2-60.8-60.8v-80.533333c0-33.6 27.2-60.8 60.8-60.8h0.533334c33.6 0 60.8 27.2 60.8 60.8v80.533333c0 33.6-27.2 60.8-60.8 60.8z"
                  fill="#FDFDFD" p-id="27521"></path>
              <path
                  d="M347.2 538.666667C355.733333 451.733333 428.266667 384 517.333333 384s161.6 67.733333 170.133334 154.666667h58.666666c-8-118.933333-107.2-213.333333-228.8-213.333334s-220.266667 94.4-228.8 213.333334h58.666667zM704 538.666667h42.666667v96h-42.666667zM288 538.666667h53.333333v96H288z"
                  fill="#FDFDFD" p-id="27522"></path>
            </svg>
            {{ item.name }}{{ item.fileName }}
          </td>
          <td>{{ item.fileSize ? formatFileSize(item.fileSize) : '' }}</td>
          <td>{{ item.createdAt }}{{ item.uploadTime }}</td>
        </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 60px);
  width: 100%;

  .dialog-footer {
    display: flex;
    justify-content: end;
    gap: 10px;

    div {
      padding: 5px 15px;
      border-radius: 5px;
      background: var(--theme-color);
      color: #fff;
      cursor: pointer;
    }

    div:nth-child(1) {
      border: #d9d8d8 1px solid;
      background: #fff;
      color: #a52a2a;
    }
  }

  .contextmenu {
    position: absolute;
    background: rgb(255, 0, 0);
    color: white;
    border-radius: 5px;
    padding: 0 5px;
    z-index: 999;
    list-style: none;

    li {
      padding: 5px 10px;
      cursor: pointer;
    }
  }

  .app-content {
    padding: 20px 0;
    border-radius: 20px;
    margin: 20px auto 0;
    width: 1100px;
    min-height: 40%;
    background: #fff;

    .el-breadcrumb {
      padding-left: 20px;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 10px;

      .bread-item {
        padding: 5px 10px;
        border-radius: 5px;
        color: #333;
        cursor: pointer;
      }

      .bread-item:hover {
        background-color: #f5f5f5;
      }
    }

    table {
      color: #a7a7a7;

      thead {
        th {
          color: #333;
          text-align: left;
          font-weight: normal;
        }

        tr {
          color: #777;
          transition: background-color 0.3s;
          border-bottom: 1px solid #ebeef5;

          th:nth-child(1) {
            padding-left: 20px;
          }

          td:nth-child(1) {
            gap: 10px;
            height: 40px;
            display: flex;
            align-items: center;
            padding-left: 20px;
          }
        }

        tr:hover:nth-child(n+2) {
          background-color: #e8e8e8;
          cursor: pointer
        }
      }
    }
  }
}
</style>