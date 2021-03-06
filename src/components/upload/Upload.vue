<template>
  <div class="upload">
    <div class="uploadArea" @click="triggerClick" :disabled="uploadStatus">
      <slot name="toUpload">
        <div v-if="drag">
          <div
            class="dragArea"
            :class="{ dragOver: drag && isDrageOver }"
            @dragover="dragMove($event, true)"
            @dragleave="dragMove($event, false)"
            @drop="dropEvent"
          >
            <button>点击上传或者拖拽上传</button>
          </div>
        </div>
        <div v-else>
          <button>点击上传</button>
        </div>
      </slot>
    </div>
    <input type="file" :multiple="multiple" ref="fileInput" :style="{ display: 'none' }" @change="handleChange" />
    <UploadList v-if="showFileList" :listType="listType" :uploadList="uploadList" @deleteFile="deleteFile">
      <template v-slot:displayMode>
        <slot name="displayMode"></slot>
      </template>
    </UploadList>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType, watch } from "vue";
import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuid } from "uuid";
import UploadList from "./UoloadList.vue";
import { cloneDeep } from "lodash-es";

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
export type ListTypeType = "text" | "picture";

export type ParentCompFileType = Partial<FileObjectType> & {
  name: string;
  url: string;
};

export type UploadFileType = Partial<FileObjectType> & {
  id: string;
  name: string;
  status: string;
  url: string;
};

export default defineComponent({
  components: {
    UploadList,
  },
  props: {
    multiple: {
      type: Boolean,
      default: true,
    },
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
      type: String as PropType<ListTypeType>,
      default: "text",
    },
    fileList: {
      type: Array as PropType<ParentCompFileType[]>,
      default: () => [],
    },
    beforeUpload: {
      type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    },
    onProgress: {
      type: Function as PropType<(e: ProgressEvent, file: FileObjectType, fileList: FileObjectType[]) => void>,
    },
    onSuccess: {
      type: Function as PropType<(res: any, file: FileObjectType, filelist: UploadFileType[]) => void>,
    },
    onError: {
      type: Function as PropType<(err: Error, file: FileObjectType, filelist: FileObjectType[]) => void>,
    },
  },
  setup(props) {
    const fileInput = ref<HTMLInputElement | null>(null);
    const uploadList = ref<UploadFileType[]>([]);
    let isDrageOver = ref(false);

    // 即便上传文件的时候父组件没有传入新的fileList,uploadList 也应该是响应式的，
    watch(
      () => props.fileList,
      (fileList: ParentCompFileType[]) => {
        uploadList.value = fileList.map((file) => {
          if (!file.url && file.file) {
            file.url = URL.createObjectURL(file.file);
          }
          const cloneFile = cloneDeep(file);
          return {
            ...cloneFile,
            id: file.id || uuid(),
            status: file.status || "success",
          };
        });
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const uploadStatus = computed(() => {
      return uploadList.value.some((item) => item.status === "uploading");
    });

    const triggerClick = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const postUoload = async (file: File) => {
      const formdata = new FormData();
      formdata.append("name", file.name);
      formdata.append("file", file);

      const uploadFile: UploadFileType = reactive({
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
    const handleChange = (evt: Event) => {
      const files = (evt.target as HTMLInputElement).files;
      if (!files) return;
      isMutileUpload(files);
    };

    const deleteFile = (id: string) => {
      const index = uploadList.value.findIndex((item) => (item.id = id));
      uploadList.value.splice(index, 1);
    };

    const dragMove = (evt: DragEvent, enter: boolean) => {
      evt.preventDefault();
      isDrageOver.value = enter;
    };

    const isMutileUpload = (files: FileList) => {
      if (!files) return;
      if (props.multiple) {
        const postFiles = Array.from(files);
        postFiles.forEach((file) => {
          postUoload(file);
        });
      } else {
        const file = files[0];
        postUoload(file);
      }
    };

    const dropEvent = (evt: DragEvent) => {
      evt.preventDefault();
      isDrageOver.value = false;
      const files = evt.dataTransfer?.files;
      if (!files) return;
      isMutileUpload(files);
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
      dropEvent,
      isMutileUpload,
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
