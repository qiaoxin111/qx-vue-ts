<template>
  <div class="iamgeCropper">
    <a-button @click="showModal"> 裁剪图片 </a-button>
    <a-modal title="裁剪图片" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <div class="cropperBox"><img :src="originUrl" id="image" alt="" /></div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, nextTick } from "vue";
import Cropper from "cropperjs";

export interface croperPramsType {
  w: number;
  h: number;
  x: number;
  y: number;
}
export default defineComponent({
  props: {
    imgEle: {
      type: HTMLElement,
    },
    url: {
      type: String,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const originUrl = computed(() => props.url.split("?x-oss-process")[0]);
    let visible = ref<boolean>(false);
    let cropper = ref<Cropper>();
    const croperPrams = ref<croperPramsType>({ w: 0, h: 0, x: 0, y: 0 });
    const showModal = async () => {
      visible.value = true;
      // 等图片元素加载完成
      await nextTick();
      const image: HTMLElement | null = document.getElementById("image");
      cropper.value = new Cropper(image as HTMLImageElement, {
        aspectRatio: 16 / 9,
        crop(event: any) {
          const { x, y, width, height } = event.detail;
          croperPrams.value = {
            x: Math.floor(x),
            y: Math.floor(y),
            w: Math.floor(width),
            h: Math.floor(height),
          };
        },
      });
    };
    const handleOk = () => {
      const { x, y, w, h } = croperPrams.value;
      const url = `${originUrl.value}?x-oss-process=image/crop,x_${x},y_${y},w_${w},h_${h}`;
      context.emit("change", url);
      if (cropper.value) {
        cropper.value.destroy();
      }
      visible.value = false;
    };
    const handleCancel = () => {
      visible.value = false;
      if (cropper.value) {
        cropper.value.destroy();
      }
    };
    return {
      originUrl,
      visible,
      showModal,
      handleOk,
      handleCancel,
    };
  },
});
</script>
<style lang="less" scoped>
img {
  display: block;

  max-width: 100%;
}
.cropperBox {
  display: flex;
  justify-content: center;
  max-height: 200px;
  #image {
    max-height: 200px;
  }
}
</style>
