<template>
  <div class="layerNameEditor">
    <a-input v-if="isFocus" v-model:value="currentLayerName" placeholder="图层名称" ref="inputEle" :id="id" />
    <div v-else @click.stop="changeName">{{ currentLayerName }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRef, ref, watch, watchEffect, nextTick } from "vue";
import { useKeyPress, isClickOutside } from "@/hooks/helper";
export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    layerName: {
      type: String,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const originLayerName = toRef(props, "layerName");
    const currentLayerName = ref<string | null>(null);
    const isFocus = ref<boolean>(false);
    let inputEle = ref<HTMLElement | null>(null);

    watchEffect(() => {
      currentLayerName.value = props.layerName;
    });
    // 回车
    useKeyPress(13, () => {
      if (!isFocus.value || !inputEle.value) return;
      context.emit("change", { id: props.id, key: "layerName", value: currentLayerName.value });
      isFocus.value = false;
    });

    // esc
    useKeyPress(27, () => {
      if (!isFocus.value || !inputEle.value) return;
      isFocus.value = false;
      currentLayerName.value = originLayerName.value;
    });

    // TODO ref获取元素有问题
    let isClickOutInput = isClickOutside(inputEle);
    watch(
      () => isClickOutInput,
      (newVal) => {
        if (!isFocus.value) return;
        if (newVal.value) {
          context.emit("change", { id: props.id, key: "layerName", value: currentLayerName.value });
          isFocus.value = false;
        }
      }
    );

    const changeName = async () => {
      isFocus.value = true;
      await nextTick();
      inputEle.value?.focus();
    };
    return {
      isFocus,
      currentLayerName,
      inputEle,
      changeName,
      originLayerName,
    };
  },
});
</script>
<style lang="less" scoped>
.layerNameEditor {
  width: 172px;
  margin-right: 10px;
}
</style>
