<template>
  <component :is="tag" :style="styleProps" @click="handleClick">{{ text }}</component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import defaultProps, { pickStyleProps, transformToComponentProps } from "../defaultProps";
import useCommon from "@/hooks/useCommon";
const stylePropsNames = pickStyleProps(defaultProps);
const componentsProps = transformToComponentProps(defaultProps);
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
    const { styleProps, handleClick } = useCommon(props, stylePropsNames);
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style></style>
