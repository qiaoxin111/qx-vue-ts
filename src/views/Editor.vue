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
        <handleMenu></handleMenu>
        <div class="draw-content-inner" id="draw-content-inner" :style="pageData.props">
          <EditWrapper
            class="componentCur"
            v-for="item in componentDataList"
            :isShow="item.isShow"
            :isLock="item.isLock"
            :key="item.id"
            :id="item.id"
            :active="currentCompId === item.id"
            :style="item.props"
            @changeCurEle="changeCurEle"
            @change="propChange"
          >
            <component class="componentCore" :is="item.name" v-bind="item.props"></component>
          </EditWrapper>
        </div>
      </a-col>
      <a-col class="wraper" :span="6">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="组件属性">
            <div v-if="currentElement && !currentElement.isLock">
              <a-collapse v-for="(subEle, index) in currentElementPropsList" :key="index">
                <a-collapse-panel :key="index" :header="subEle.name">
                  <FormTablue :props="subEle.props" @change="propChange"></FormTablue>
                </a-collapse-panel>
              </a-collapse>
            </div>
            <div v-if="currentElement && currentElement.isLock">组件被锁，不能设置</div>
            <div v-if="!currentElement">在画布中选择元素并开始编辑</div>
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
import { defineComponent, computed, watchEffect, watch, ref } from "vue";
import { useStore } from "vuex";
import { ComponentData } from "@/store/editor";
import { defaultTemplates } from "@/defaultTemplate";
import { propsForm } from "@/propsMap";
import { commonProps, textDefaultProps, imageDefaultProps, AllPropsType } from "@/defaultProps";
import { initHotKey, hotKeyMethods } from "../hooks/hotkeys";
import ComponentLists from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import FormTablue from "@/components/FormTable.vue";
import XText from "@/components/XText.vue";
import XImage from "@/components/XImage.vue";
import TextUpload from "@/components/TextUpload.vue";
import LayerList from "@/components/LayerList.vue";
import handleMenu from "@/components/handleMenu.vue";
import { QuestionCircleOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons-vue";

export interface currentElementSubProp {
  name: string;
  props: {
    [P in keyof AllPropsType]?: AllPropsType[P];
  };
}
export interface attrype {
  name: string;
  props: string[];
}
export default defineComponent({
  components: {
    XText,
    XImage,
    ComponentLists,
    EditWrapper,
    FormTablue,
    TextUpload,
    LayerList,
    handleMenu,
  },

  setup() {
    const store = useStore();
    // TODO 这里为什么不能自动补全
    const componentDataList = computed<ComponentData[]>(() => store.state.editor.components);
    const pageData = computed(() => store.state.editor.page);
    console.log("componentDataList", componentDataList);
    const currentCompId = computed(() => store.state.editor.currentElementId);
    const currentElement = computed(() => store.getters.currentElement);
    const currentElementPropsList = ref<currentElementSubProp[]>([]); //折叠面板需要的数据类型
    let activeKey = ref(["0"]);
    //------------------
    // 折叠面板的组合来源
    const attrList: attrype[] = [
      {
        name: "基本属性",
        props: [],
      },
      {
        name: "尺寸",
        props: ["width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
      },
      {
        name: "边框",
        props: ["borderStyle", "borderColor", "borderWidth", "borderRadius"],
      },
      // {
      //   name: "阴影与透明度",
      //   props: [],
      // },
      {
        name: "位置",
        props: ["left", "top"],
      },
      {
        name: "事件功能",
        props: ["actionType", "actionType"],
      },
    ];

    // text属性中除了公共属性之外的属性
    const textDefaultBasicPropsArray = Object.keys(textDefaultProps).filter(
      (item) => !new Set(Object.keys(commonProps)).has(item)
    );
    // img属性中除了公共属性之外的属性
    const imageDefaultPropsArray = Object.keys(imageDefaultProps).filter(
      (item) => !new Set(Object.keys(commonProps)).has(item)
    );
    // -----------------------------------------------------
    //  TODO 需要优化
    initHotKey("ctrl+c, command+c", hotKeyMethods.copy);
    initHotKey("ctrl+v, command+v", hotKeyMethods.paste);
    initHotKey("backspace, delete", hotKeyMethods.delete);
    initHotKey("esc", hotKeyMethods.deselect);
    initHotKey("up", hotKeyMethods.up);
    initHotKey("down", hotKeyMethods.down);
    initHotKey("left", hotKeyMethods.left);
    initHotKey("right", hotKeyMethods.right);
    initHotKey("shift+up", hotKeyMethods.shiftUp);
    initHotKey("shift+down", hotKeyMethods.shiftDown);
    initHotKey("shift+left", hotKeyMethods.shiftLeft);
    initHotKey("shift+right", hotKeyMethods.shiftRight);
    // -----------------------------------------------------
    watch(
      currentElement,
      (newVal) => {
        if (newVal) {
          attrList[0].props =
            currentElement.value.name === "x-text" ? textDefaultBasicPropsArray : imageDefaultPropsArray;
          currentElementPropsList.value = attrList.map((item) => {
            let subprop: Partial<AllPropsType> = {};
            item.props.forEach((prop: string) => {
              const newProp = prop as keyof AllPropsType;
              subprop[newProp] = currentElement.value.props[newProp]
                ? currentElement.value.props[newProp]
                : propsForm[newProp]?.defaultValue;
            });
            let obj = { name: item.name, props: subprop };
            return obj;
          });
        }
      },
      {
        deep: true, // 深度监听的参数
      }
    );
    const addItem = (props: any) => {
      console.log("addprops", props);
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
      currentElementPropsList,
      activeKey,
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
    padding: 60px 100px;
    height: 100vh;
    background-color: #eef0f4;
    .draw-content-inner {
      position: relative;
      width: 100%;
      height: 300px;
      background-color: #fff;
      .componentCur {
        cursor: pointer;
        .componentCore {
          position: static !important;
        }
      }
      .selectedComp {
        border: 1px solid red;
      }
    }
  }
}
</style>
