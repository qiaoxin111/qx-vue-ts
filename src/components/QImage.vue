<template>
  <div class="q-image">
    <div v-if="isBackgroundImage && !value">
      <Upload :drag="true" :onSuccess="onSuccess" :showFileList="false"></Upload>
    </div>
    <div v-else class="showBackImg">
      <div class="pic"><img :src="urlValue" /></div>
      <div class="oper">
        <div class="uploadBtn">
          <Upload :onSuccess="onSuccess" :showFileList="false"></Upload>
        </div>
        <ImageCropper :imgEle="imgEle" :url="urlValue" @change="cropperImage"></ImageCropper>
        <button v-if="isBackgroundImage" @click="deletePageBackgroundImg">删除图片</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watchEffect } from "vue";
import Upload from "@/components/upload/Upload.vue";
import ImageCropper from "@/components/ImageCropper.vue";
export default defineComponent({
  components: {
    Upload,
    ImageCropper,
  },
  props: {
    value: String,
    isPage: Boolean,
  },
  emits: ["change"],
  setup(props, context) {
    let urlValue = ref<string | undefined>("");
    let isBackgroundImage = computed(() => props.isPage);
    let imgEle = ref<HTMLImageElement | HTMLElement | null>(null);
    // 正则匹配url路径
    watchEffect(() => {
      if (isBackgroundImage.value && props.value?.includes("url")) {
        const pattern = /(url\()(.+)(\))/;
        const res = props.value?.match(pattern);
        if (res) {
          urlValue.value = res[2];
        }
      } else {
        urlValue.value = props.value;
      }
    });
    onMounted(() => {
      const imgElement = document.getElementById("image");
      imgEle.value = imgElement;
    });
    const onSuccess = (res: any) => {
      if (res.data.errno !== 0) return;
      const url = res.data.data.url;
      if (isBackgroundImage.value) {
        context.emit("change", `url(${url})`);
      } else {
        context.emit("change", url);
      }
    };
    const cropperImage = (val: string) => {
      if (isBackgroundImage.value) {
        context.emit("change", `url(${val})`);
      } else {
        context.emit("change", val);
      }
    };
    const deletePageBackgroundImg = () => {
      context.emit("change", "");
    };
    return {
      imgEle,
      isBackgroundImage,
      onSuccess,
      cropperImage,
      urlValue,
      deletePageBackgroundImg,
    };
  },
});
</script>
<style lang="less" scoped>
.q-image {
  .showBackImg {
    display: flex;
    .pic {
      img {
        width: 120px;
        height: 100px;
      }
    }
    .oper {
      width: calc(100% - 120px);
      box-sizing: border-box;
      padding: 0 10px;
      .uploadBtn {
        display: flex;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
