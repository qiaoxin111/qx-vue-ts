<template>
  <div v-for="(item, index) in list" :key="index" @click="addComponent(item)" class="componentTemplate">
    <!-- <XTest v-bind="item"></XTest> -->
    <div>{{ item.text }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { templateType } from "@/defaultTemplate";
// import XTest from "@/components/XText.vue";

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<templateType[]>,
      required: true,
    },
  },
  components: {
    // XTest,
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const addComponent = (data: any) => {
      console.log("commit");
      context.emit("on-item-click", data);
    };
    return {
      addComponent,
    };
  },
});
</script>
<style lang="less" scoped>
.componentTemplate {
  cursor: pointer;
}
</style>
