<template>
  <div :class="{ active: active }" @click="changeCurrentComponent()">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
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
  },
  emits: ["changeCurEle"],
  setup(props, context) {
    const store = useStore();
    const changeCurrentComponent = () => {
      context.emit("changeCurEle", props.id);
    };

    return {
      changeCurrentComponent,
    };
  },
});
</script>
<style lang="less">
.active {
  border: 1px solid red;
}
</style>
