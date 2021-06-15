<template>
  <div>
    <button @click="trigger">点击</button>
    <input type="file" ref="fileInput" :style="{ display: 'none' }" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const fileInput = ref<null | HTMLInputElement>(null);
    const trigger = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    return {
      fileInput,
      trigger,
    };
  },
});
</script>
