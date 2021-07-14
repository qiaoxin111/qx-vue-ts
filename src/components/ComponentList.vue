<template>
  <div v-for="(item, index) in list" :key="index" @click="addComponent(item)" class="componentTemplate">
    <Upload v-if="item.tag === 'img'" :showFileList="false" :onSuccess="onSuccess"></Upload>
    <div v-else>{{ item.text }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { templateType } from "@/defaultTemplate";
import Upload from "@/components/upload/Upload.vue";

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<templateType[]>,
      required: true,
    },
  },
  components: {
    Upload,
    // XTest,
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const currentProp = ref<templateType | null>(null);
    const addComponent = (data: any) => {
      currentProp.value = data;
      if (data.tag !== "img") {
        context.emit("on-item-click", data);
      }
    };
    const onSuccess = (res: any) => {
      if (res.data.errno !== 0) {
        return;
      }
      const url = res.data.data.url;
      if (currentProp.value) {
        currentProp.value.src = url;
      }
      context.emit("on-item-click", currentProp.value);
      // console.log("上传接口返回值", res);
    };
    return {
      addComponent,
      onSuccess,
    };
  },
});
</script>
<style lang="less" scoped>
.componentTemplate {
  cursor: pointer;
}
</style>
