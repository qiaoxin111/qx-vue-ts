<template>
  <component :is="tag" :style="styleProps" @click="handleClick">{{ text }}</component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { textDefaultProps, pickTextStyleProps, transformToComponentProps } from "../defaultProps";
import useCommon from "@/hooks/useCommon";
const stylePropsNames = pickTextStyleProps(textDefaultProps);

const componentsProps = transformToComponentProps(textDefaultProps);
export default defineComponent({
  name: "XText",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    ...componentsProps,
  },
  setup(props) {
    //TODO toRefs 使用
    const { styleProps, handleClick } = useCommon(props, stylePropsNames);
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style></style>
