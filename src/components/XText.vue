<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "XText",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    fontSize: {
      type: String,
    },
  },
});
</script>

<style></style>
