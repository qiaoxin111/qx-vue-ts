<template>
  <div class="upload">
    <div class="uploadArea" @click="triggerClick" :disabled="uploadStatus">
      <slot name="toUpload">
        <button>点击上传11</button>
      </slot>
    </div>
    <input type="file" ref="fileInput" :style="{ display: 'none' }" @change="handleChange" />
    <slot name="displayMode">
      <div v-for="(item, index) in uploadList" :key="index" :class="`uploadFile upload-${item.status}`">
        <span>{{ item.name }} -- {{ item.status }}</span>
        <span @click="deleteFile(item.id)">delete</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType } from "vue";
import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuid } from "uuid";

interface FileObjectType {
  id: string;
  size: number;
  status: string;
  name: string;
  file: File;
}

type ConfigType = AxiosRequestConfig;

export default defineComponent({
  props: {
    action: {
      type: String,
      default: "http://localhost:3000/upload",
    },
    beforeUpload: {
      type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    },
    onProgress: {
      type: Function as PropType<() => void>,
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);

    const uploadList = ref<FileObjectType[]>([]);
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

      const uploadFile: FileObjectType = reactive({
        id: uuid(),
        name: file.name,
        size: file.size,
        status: "uploading",
        file,
      });

      if (props.beforeUpload) {
        try {
          const result = await props.beforeUpload(file);
          if (!result) {
            // message 上传失败
            return;
          }
        } catch (e) {
          // message 上传失败
          return;
        }
      }

      uploadList.value.push(uploadFile);

      const config: ConfigType = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (props.onProgress) {
        config.onUploadProgress = props.onProgress;
      }

      console.log(config);

      axios.post(props.action, formdata, config).then((res) => {
        if (res.status === 200) {
          uploadFile.status = "success";
          console.log(1111, uploadFile);
        } else {
          uploadFile.status = "failed";
        }
        if (fileInput.value) {
          fileInput.value.value = "";
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
