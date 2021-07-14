<template>
  <div class="editor">
    <!-- <TextUpload></TextUpload> -->
    <a-row>
      <a-col class="wraper" :span="6">
        <h3>组件列表</h3>
        <ComponentLists :list="defaultTemplates" @onItemClick="addItem"></ComponentLists>
      </a-col>
      <a-col :span="12" class="draw-content">
        <div>画布区域</div>
        <div class="draw-content-inner" :style="pageData.props">
          <EditWrapper
            class="componentCur"
            v-for="item in componentDataList"
            :isShow="item.isShow"
            :isLock="item.isLock"
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
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="组件属性">
            {{ currentElement }}
            <FormTablue
              v-if="currentElement"
              :isLock="currentElement.isLock"
              :props="currentElement.props"
              @change="propChange"
            ></FormTablue>
          </a-tab-pane>
          <a-tab-pane key="2" tab="图层设置" force-render>
            <LayerList
              :components="componentDataList"
              @change="propChange"
              @changComponentsList="changComponentsList"
            ></LayerList>
          </a-tab-pane>
          <a-tab-pane key="3" tab="页面设置">
            <FormTablue :props="pageData.props" @change="pageChange" :isPage="true"></FormTablue>
          </a-tab-pane>
        </a-tabs>
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
import XImage from "@/components/XImage.vue";
import TextUpload from "@/components/TextUpload.vue";
import LayerList from "@/components/LayerList.vue";
export default defineComponent({
  components: {
    XText,
    XImage,
    ComponentLists,
    EditWrapper,
    FormTablue,
    TextUpload,
    LayerList,
  },

  setup() {
    const store = useStore();
    // TODO 这里为什么不能自动补全
    const componentDataList = computed<ComponentData[]>(() => store.state.editor.components);
    const pageData = computed(() => store.state.editor.page);
    console.log("componentDataList", componentDataList);
    const currentCompId = computed(() => store.state.editor.currentElementId);
    const currentElement = computed(() => store.getters.currentElement);

    const addItem = (props: any) => {
      store.commit("addComp", props);
    };
    const changeCurEle = (id: string) => {
      store.commit("changeCurEle", id);
    };
    const propChange = (data: any) => {
      store.commit("propChange", data);
    };
    const changComponentsList = (data: ComponentData[]) => {
      store.commit("changeComponents", data);
    };
    const pageChange = (data: any) => {
      store.commit("chagnePage", data);
    };

    return {
      currentElement,
      currentCompId,
      componentDataList,
      defaultTemplates,
      addItem,
      changeCurEle,
      propChange,
      changComponentsList,
      pageData,
      pageChange,
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
