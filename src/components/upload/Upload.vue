<template>
  <div class="upload">
    <div class="uploadArea" @click="triggerClick" :disabled="uploadStatus">
      <slot name="toUpload">
        <div
          class="dragArea"
          :class="{ dragOver: drag & isDrageOver }"
          @dragover="dragMove($event, true)"
          @dragleave="dragMove($event, false)"
        >
          <button>点击上传11</button>
        </div>
      </slot>
    </div>
    <input type="file" ref="fileInput" :style="{ display: 'none' }" @change="handleChange" />
    <UploadList :listType="listType" :uploadList="uploadList" @deleteFile="deleteFile">
      <template v-slot:displayMode>
        <slot name="displayMode"></slot>
      </template>
    </UploadList>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType } from "vue";
import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuid } from "uuid";
import UploadList from "./UoloadList.vue";

export interface FileObjectType {
  id?: string;
  size?: number;
  status: string;
  name: string;
  percent?: number;
  file?: File;
  url?: string;
}

type ConfigType = AxiosRequestConfig;
export type listTypeType = "text" | "picture";

export type uplodFileType = Partial<FileObjectType> & {
  name: string;
};

export default defineComponent({
  components: {
    UploadList,
  },
  props: {
    drag: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "http://localhost:3000/upload",
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<listTypeType>,
      default: "text",
    },
    fileList: {
      type: Array as PropType<uplodFileType[]>,
      default: () => [],
    },
    beforeUpload: {
      type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    },
    onProgress: {
      type: Function as PropType<(e: ProgressEvent, file: FileObjectType, fileList: FileObjectType[]) => void>,
    },
    onSuccess: {
      type: Function as PropType<(res: any, file: FileObjectType, filelist: uplodFileType[]) => void>,
    },
    onError: {
      type: Function as PropType<(err: Error, file: FileObjectType, filelist: FileObjectType[]) => void>,
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);
    let isDrageOver = ref(false);
    const uploadList = computed<uplodFileType[]>(() => {
      return props.fileList.map((item) => {
        item.id = item.id ?? uuid();
        item.status = "success";
        if (!item.url && item.file) {
          item.url = URL.createObjectURL(item.file);
        }
        return item;
      });
    });

    // const uploadList = fileList;

    console.log("uploadList", uploadList);
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
      const files = evt.target.files;
      const file = files[0];
      const formdata = new FormData();
      formdata.append("name", file.name);
      formdata.append("file", file);

      const uploadFile: FileObjectType = reactive({
        id: uuid(),
        name: file.name,
        size: file.size,
        status: "uploading",
        percent: 0,
        file,
        url: URL.createObjectURL(file),
      });

      if (props.beforeUpload) {
        try {
          const result = await props.beforeUpload(file);
          if (!result) {
            console.log("上传失败：beforeupload");
            return;
          }
        } catch (e) {
          console.log("上传失败：beforeupload");
          return;
        }
      }

      uploadList.value.push(uploadFile);
      console.log("增加一条", uploadList);

      const onUploadProgress = (progress: ProgressEvent) => {
        uploadFile.percent = Math.floor((progress.loaded * 100) / progress.total);
        // if (props.onProgress) {
        //   props.onProgress(progress, file, uploadList);
        // }
      };

      const config: ConfigType = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onUploadProgress,
      };

      axios
        .post(props.action, formdata, config)
        .then((res) => {
          if (res.status === 200) {
            uploadFile.status = "success";
            console.log("更新l", uploadList);
            if (props.onSuccess) {
              props.onSuccess(res, uploadFile, uploadList.value);
            }
          }
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        })
        .catch((err) => {
          uploadFile.status = "failed";
          if (props.onError) {
            // props.onError(err, uploadFile, uploadList);
          }
        });
    };

    const deleteFile = (id: string) => {
      const index = uploadList.value.findIndex((item) => (item.id = id));
      uploadList.value.splice(index, 1);
    };

    const dragMove = (evt: DragEvent, enter: boolean) => {
      console.log(33333);
      evt.preventDefault();
      isDrageOver.value = enter;
    };

    return {
      uploadStatus,
      fileInput,
      uploadList,
      triggerClick,
      handleChange,
      deleteFile,
      isDrageOver,
      dragMove,
    };
  },
});
</script>
<style scoped lang="less">
.upload {
  width: 400px;
  .uploadArea {
    .dragArea {
      width: 200px;
      height: 200px;
      border: 1px dashed #aaa;
      &:hover {
        border-color: blue;
      }
      &.dragOver {
        border-color: blue;
        background-color: rgba(255, 255, 0, 0.5);
      }
    }
  }
  .uploadFile {
    display: flex;
  }
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
