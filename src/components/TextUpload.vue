<template>
  <div>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      on-success="eleOnSuccess"
      :on-error="eleOnError"
    >
      <el-button size="small" type="primary">点击上传3333</el-button>
    </el-upload>
    <Upload
      :multiple="false"
      :drag="true"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :onProgress="onprgress"
      :onSuccess="onSuccess"
    >
      <!-- <template v-slot:displayMode> jalksjdkaljdkaljdkl </template> -->
      <!-- <template v-slot:displayMode>222222</template> -->
    </Upload>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import Upload from "@/components/upload/Upload.vue";

import { uplodFileType } from "@/components/upload/Upload.vue";

interface fileShowType {
  url: string;
  name: string;
  file?: File;
  id?: string;
}
export default defineComponent({
  components: {
    Upload,
  },
  setup() {
    const fileList = reactive<fileShowType[]>([
      {
        name: "food.jpeg",
        url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
      },
      {
        name: "food2.jpeg",
        url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
      },
    ]);
    const beforeUpload = (file: File) => {
      console.log("file", file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        alert("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        alert("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    };
    const onprgress = (progress: ProgressEvent) => {
      console.log("onprogress", progress);
    };
    const onSuccess = (res: any, file: uplodFileType) => {
      console.log("onsuccess", res, file);
      // fileList.push(res.data);
    };
    const eleOnSuccess = (response: any, file: File, fileList: FileList) => {
      console.log("res", response);
      console.log("file", file);
      console.log("filelist", fileList);
    };

    const eleOnError = (err: any, file: File, fileList: FileList) => {
      console.log("shibai");
      console.log("res", err);
      console.log("file", file);
      console.log("filelist", fileList);
    };
    return {
      fileList,
      beforeUpload,
      onprgress,
      eleOnSuccess,
      onSuccess,
    };
  },
});
</script>
