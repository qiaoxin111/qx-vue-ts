<template>
  <div v-for="(item, index) in list" :key="index" @click="addComponent(item)" class="componentTemplate">
    <XTest v-bind="item"></XTest>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import XTest from "@/components/XText.vue";

export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    XTest,
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
<style lang="less">
.componentTemplate {
  cursor: pointer;
}
</style>
