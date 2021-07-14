<template>
  <div v-if="isShow" :class="{ active: active }" @click="changeCurrentComponent()">
    <slot></slot>
  </div>
  <div v-else></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import { useStore } from "vuex";
export default defineComponent({
  props: {
    id: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
    isLock: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["changeCurEle"],
  setup(props, context) {
    const changeCurrentComponent = () => {
      context.emit("changeCurEle", props.id);
    };

    return {
      changeCurrentComponent,
    };
  },
});
</script>
<style lang="less" scoped>
.active {
  border: 1px solid red;
}
</style>
