<template>
  <component class="x-image" :is="tag" :src="src" :style="styleProps" @click="handleClick"></component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { imageDefaultProps, pickImageStyleProps, transformToComponentProps } from "../defaultProps";
import useCommon from "@/hooks/useCommon";
const stylePropsNames = pickImageStyleProps(imageDefaultProps);
const componentsProps = transformToComponentProps(imageDefaultProps);
export default defineComponent({
  name: "XImage",
  props: {
    tag: {
      type: String,
      default: "img",
    },
    src: {
      type: String,
    },
    ...componentsProps,
  },
  setup(props) {
    const { styleProps, handleClick } = useCommon(props, stylePropsNames);
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style scoped lang="less">
.x-image {
  width: 200px;
  height: 200px;
}
</style>
