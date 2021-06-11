[
<template>
  <div class="upload">
    <button @click="triggerClick" :disabled="uploadStatus">点击上传</button>
    <input type="file" ref="fileInput" :style="{ display: 'none' }" @change="handleChange" />
    <div v-for="(item, index) in uploadList" :key="index" :class="`uploadFile upload-${item.status}`">
      <span>{{ item.name }} -- {{ item.status }}</span>
      <span @click="deleteFile(item.id)">delete</span>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from "vue";
import axios from "axios";
import { v4 as uuid } from "uuid";
interface fileObjectType {
  id: string;
  size: number;
  status: string;
  name: string;
  file: File;
}
export default defineComponent({
  props: {
    action: {
      type: String,
      default: "http://localhost:3000/upload",
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);

    const uploadList = ref<fileObjectType[]>([]);
    const uploadStatus = computed(() => {
      return uploadList.value.some((item) => item.status === "uploading");
    });

    const triggerClick = () => {
      console.log(fileInput.value);
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleChange = async (evt: any) => {
      const fileList = evt.target.files;
      const file = fileList[0];
      const formdata = new FormData();
      formdata.append("name", file.name);
      formdata.append("file", file);
      const uploadFile: fileObjectType = reactive({
        id: uuid(),
        name: file.name,
        size: file.size,
        status: "uploading",
        file,
      });
      uploadList.value.push(uploadFile);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      axios.post(props.action, formdata, config).then((res) => {
        if (res.status === 200) {
          uploadFile.status = "success";
          console.log(1111, uploadFile);
        } else {
          uploadFile.status = "failed";
        }
      });
    };
    const deleteFile = (id: string) => {
      const index = uploadList.value.findIndex((item) => (item.id = id));
      uploadList.value.splice(index, 1);
    };
    return {
      uploadStatus,
      fileInput,
      uploadList,
      triggerClick,
      handleChange,
      deleteFile,
    };
  },
});
</script>
<style scoped lang="less">
.upload {
  .upload-uploading span {
    color: yellow;
  }
  .upload-success span {
    color: green;
  }
  .upload-failed span {
    color: red;
  }
}
</style>
