<template>
  <div class="editor">
    <a-row>
      <a-col class="componentList" :span="6">
        组件列表
        <ComponentLists :list="defaultTemplates" @onItemClick="addItem"></ComponentLists>
      </a-col>
      <a-col :span="12" class="draw-content">
        <div>画布区域</div>
        <div class="draw-content-inner">
          <component
            class="componentCur"
            v-for="item in componentDataList"
            :key="item.id"
            :is="item.name"
            v-bind="item.props"
            :class="{ selectedComp: currentCompId === item.id }"
            @click="getCurrentComponent(item)"
          ></component>
        </div>
      </a-col>
      <a-col :span="6"> 组件属性 </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { ComponentData } from "@/store/editor";
import { defaultTemplates } from "@/defaultTemplate";
import ComponentLists from "@/components/ComponentList.vue";
import XText from "@/components/XText.vue";

export default defineComponent({
  components: {
    XText,
    ComponentLists,
  },

  setup() {
    const store = useStore();
    // console.log("333", store.state.editor.components[0]);
    // TODO 这里为什么不能自动补全
    const componentDataList = computed<ComponentData[]>(() => store.state.editor.components);
    const currentCompId = computed(() => store.state.editor.currentElement);
    const addItem = (props: any) => {
      store.commit("addComp", props);
    };
    const getCurrentComponent = (item: ComponentData) => {
      store.commit("changeCurEle", item.id);
    };
    return {
      currentCompId,
      componentDataList,
      defaultTemplates,
      addItem,
      getCurrentComponent,
    };
  },
});
</script>
<style lang="less">
.editor {
  .componentList {
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
