<template>
  <div
    class="componentInner"
    v-if="isShow"
    :class="{ active: active }"
    :style="compWrapPosiProp"
    ref="contentBoxWrapper"
    @mousedown="mousedownHandler"
  >
    <slot></slot>
    <div class="dots">
      <span class="top-left dott" @mousedown.stop="dotMouseDown($event, 'top-left')"></span>
      <span class="top-right dott" @mousedown.stop="dotMouseDown($event, 'top-right')"></span>
      <span class="bottom-left dott" @mousedown.stop="dotMouseDown($event, 'bottom-left')"></span>
      <span class="bottom-right dott" @mousedown.stop="dotMouseDown($event, 'bottom-right')"></span>
    </div>
  </div>
  <div v-else></div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, reactive, watchEffect } from "vue";
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
    style: {
      type: Object,
      required: true,
    },
  },
  emits: ["changeCurEle", "change"],
  setup(props, context) {
    console.log("props.style", props.style);
    const propsStyle = computed(() => props.style);
    const contentBoxWrapper = ref<HTMLElement | null>(null);
    // 组件的位置属性
    const compWrapPosiProp = reactive({
      position: propsStyle.value.position,
      left: propsStyle.value.left,
      top: propsStyle.value.top,
      width: propsStyle.value.width,
      height: propsStyle.value.height,
    });
    watchEffect(() => {
      compWrapPosiProp.position = propsStyle.value.position;
      compWrapPosiProp.left = propsStyle.value.left;
      compWrapPosiProp.top = propsStyle.value.top;
      compWrapPosiProp.width = propsStyle.value.width;
      compWrapPosiProp.height = propsStyle.value.height;
    });
    const changeCurrentComponent = () => {
      context.emit("changeCurEle", props.id);
    };

    const mousedownHandler = (e: MouseEvent) => {
      changeCurrentComponent();
      const initOffset = {
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      };
      const mousemoveHandler = (event: MouseEvent) => {
        // 编辑器外层盒子到网页左侧及顶部距离
        const editBox = document.getElementById("draw-content-inner") as HTMLElement;
        const editWrapperBoundingData = editBox?.getBoundingClientRect();
        const style = {
          top: event.clientY - editWrapperBoundingData.y - initOffset.offsetY,
          left: event.clientX - editWrapperBoundingData.x - initOffset.offsetX,
        };
        compWrapPosiProp.left = style.left + "px";
        compWrapPosiProp.top = style.top + "px";
      };
      const mouseupHandler = () => {
        if (compWrapPosiProp.top !== props.style.top && compWrapPosiProp.left !== props.style.left) {
          context.emit("change", { key: ["top", "left"], value: [compWrapPosiProp.top, compWrapPosiProp.left] });
        } else if (compWrapPosiProp.top !== props.style.top) {
          context.emit("change", { key: "top", value: compWrapPosiProp.top });
        } else if (compWrapPosiProp.left !== props.style.left) {
          context.emit("change", { key: "left", value: compWrapPosiProp.left });
        }
        document.removeEventListener("mousemove", mousemoveHandler);
        document.removeEventListener("mouseup", mouseupHandler);
      };
      document.addEventListener("mouseup", mouseupHandler);

      document.addEventListener("mousemove", mousemoveHandler);
    };

    const dotMouseDown = (e: MouseEvent, position: string) => {
      const editBox = document.getElementById("draw-content-inner") as HTMLElement;
      const editWrapperBoundingData = editBox?.getBoundingClientRect();
      let width: number, height: number, left: number, top: number;
      const dotMousemoveHandler = (event: MouseEvent) => {
        if (position === "bottom-right") {
          width = event.clientX - editWrapperBoundingData.x - parseFloat(compWrapPosiProp.left);
          height = event.clientY - editWrapperBoundingData.y - parseFloat(compWrapPosiProp.top);
        } else if (position === "bottom-left") {
          left = event.clientX - editWrapperBoundingData.x;
          height = event.clientY - editWrapperBoundingData.y - parseFloat(compWrapPosiProp.top);
          width = parseFloat(compWrapPosiProp.left) - left + parseFloat(compWrapPosiProp.width);
        } else if (position === "top-right") {
          top = event.clientY - editWrapperBoundingData.y;
          height = parseFloat(compWrapPosiProp.top) - top + parseFloat(compWrapPosiProp.height);
          width = event.clientX - editWrapperBoundingData.x - parseFloat(compWrapPosiProp.left);
        } else if (position === "top-left") {
          top = event.clientY - editWrapperBoundingData.y;
          left = event.clientX - editWrapperBoundingData.x;
          width = parseFloat(compWrapPosiProp.left) - left + parseFloat(compWrapPosiProp.width);
          height = parseFloat(compWrapPosiProp.top) - top + parseFloat(compWrapPosiProp.height);
        }
        compWrapPosiProp.width = width + "px";
        compWrapPosiProp.height = height + "px";
        compWrapPosiProp.top = top ? top + "px" : compWrapPosiProp.top;
        compWrapPosiProp.left = left ? left + "px" : compWrapPosiProp.left;
      };
      const dotMouseupHandler = () => {
        if (position === "bottom-left") {
          context.emit("change", {
            key: ["width", "height", "left"],
            value: [compWrapPosiProp.width, compWrapPosiProp.height, compWrapPosiProp.left],
          });
        } else if (position === "top-right") {
          context.emit("change", {
            key: ["width", "height", "top"],
            value: [compWrapPosiProp.width, compWrapPosiProp.height, compWrapPosiProp.top],
          });
        } else if (position === "top-left") {
          context.emit("change", {
            key: ["width", "height", "top", "left"],
            value: [compWrapPosiProp.width, compWrapPosiProp.height, compWrapPosiProp.top, compWrapPosiProp.left],
          });
        } else if (position === "bottom-right") {
          context.emit("change", {
            key: ["width", "height"],
            value: [compWrapPosiProp.width, compWrapPosiProp.height],
          });
        }
        document.removeEventListener("mousemove", dotMousemoveHandler);
        document.removeEventListener("mouseup", dotMouseupHandler);
      };
      document.addEventListener("mouseup", dotMouseupHandler);
      document.addEventListener("mousemove", dotMousemoveHandler);
    };

    return {
      changeCurrentComponent,
      mousedownHandler,
      compWrapPosiProp,
      contentBoxWrapper,
      dotMouseDown,
    };
  },
});
</script>
<style lang="less" scoped>
// .componentInner {
//   position: relative;
// }
.active {
  border: 1px solid red;
}
.dots {
  .dott {
    width: 10px;
    height: 10px;
    background: #fff;
    border: 1px solid blue;
    border-radius: 50%;
    position: absolute;
    &.top-left {
      left: -5px;
      top: -5px;
      cursor: nwse-resize;
    }
    &.top-right {
      right: -5px;
      top: -5px;
      cursor: nesw-resize;
    }
    &.bottom-left {
      left: -5px;
      bottom: -5px;
      cursor: nesw-resize;
    }
    &.bottom-right {
      right: -5px;
      bottom: -5px;
      cursor: nwse-resize;
    }
  }
}
</style>
