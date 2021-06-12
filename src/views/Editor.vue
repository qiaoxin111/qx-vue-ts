<template>
  <div class="editor">
    <Upload :beforeUpload="beforeUpload" :> </Upload>
    <a-row>
      <a-col class="wraper" :span="6">
        组件列表
        <ComponentLists :list="defaultTemplates" @onItemClick="addItem"></ComponentLists>
      </a-col>
      <a-col :span="12" class="draw-content">
        <div>画布区域</div>
        <div class="draw-content-inner">
          <EditWrapper
            class="componentCur"
            v-for="item in componentDataList"
            :key="item.id"
            :id="item.id"
            :active="currentCompId === item.id"
            @changeCurEle="changeCurEle"
          >
            <component :is="item.name" v-bind="item.props"></component>
          </EditWrapper>
        </div>
      </a-col>
      <a-col class="wraper" :span="6">
        <div class="title">组件属性</div>
        {{ currentElement }}
        <FormTablue v-if="currentElement" :props="currentElement.props" @change="propChange"></FormTablue>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { ComponentData } from "@/store/editor";
import { defaultTemplates } from "@/defaultTemplate";
import ComponentLists from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import FormTablue from "@/components/FormTable.vue";
import XText from "@/components/XText.vue";
import Upload from "@/components/Upload.vue";

export default defineComponent({
  components: {
    XText,
    ComponentLists,
    EditWrapper,
    FormTablue,
    Upload,
  },

  setup() {
    const store = useStore();
    // TODO 这里为什么不能自动补全

    const componentDataList = computed<ComponentData[]>(() => store.state.editor.components);
    const currentCompId = computed(() => store.state.editor.currentElementId);
    const currentElement = computed(() => store.getters.currentElement);

    console.log("当前的", currentElement);
    const addItem = (props: any) => {
      store.commit("addComp", props);
    };
    const changeCurEle = (id: string) => {
      store.commit("changeCurEle", id);
    };
    const propChange = (data: any) => {
      store.commit("propChange", data);
    };
    const beforeUpload = (file: File) => {
      console.log("file", file);
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 0.1;
      if (!isJPG) {
        alert("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        alert("上传头像图片大小不能超过 2MB!");
      }
      return new Promise((resolve, reject) => {
        reject("err");
      });
    };
    
    return {
      currentElement,
      currentCompId,
      componentDataList,
      defaultTemplates,
      addItem,
      changeCurEle,
      propChange,
      beforeUpload,
    };
  },
});
</script>
<style lang="less" scoped>
.editor {
  .wraper {
    display: block;
  }
  .draw-content {
    display: block !important;
    box-sizing: border-box;
    padding: 100px;
    height: 100vh;
    background-color: #eef0f4;
    .draw-content-inner {
      width: 100%;
      height: 300px;
      background-color: #fff;
      .componentCur {
        cursor: pointer;
      }
      .selectedComp {
        border: 1px solid red;
      }
    }
  }
}
</style>
