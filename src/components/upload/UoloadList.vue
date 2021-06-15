<template>
  <div class="upload-list">
    <slot name="displayMode">
      <div v-for="(item, index) in uploadList" :key="index" :class="`uploadFile upload-${item.status}`">
        <div>{{ index }}</div>
        <div class="uploadForShow uploadType-text" v-if="listType === 'text'">
          <div v-if="item.status === 'uploading'">
            <span class="upload-fileName">{{ item.name }} </span>
            <a-progress class="upload-progress" :percent="item.percent" />
            <span class="upload-delete" @click="deleteFile(item.id)">delete</span>
          </div>
          <div v-else>
            <span class="upload-fileName">{{ item.name }} </span>
            <span class="upload-delete" @click="deleteFile(item.id)">delete</span>
          </div>
        </div>
        <div class="uploadForShow uploadType-picture" v-else-if="listType === 'picture'">
          <div v-if="item.status === 'uploading'">
            <img :src="item.url" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div v-else>
            <img :src="item.url" alt="" />
            <span>{{ item.name }}</span>
            <span class="upload-delete" @click="deleteFile(item.id)">delete</span>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { uplodFileType, listTypeType } from "./Upload.vue";
export default defineComponent({
  props: {
    uploadList: {
      type: Array as PropType<uplodFileType[]>,
    },
    listType: {
      type: String as PropType<listTypeType>,
    },
  },
  emits: ["deleteFile"],
  setup(props, context) {
    const deleteFile = (id: string) => {
      context.emit("deleteFile", id);
    };
    return {
      deleteFile,
    };
  },
});
</script>
