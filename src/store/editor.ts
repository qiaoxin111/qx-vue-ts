import { GlobalDataProps } from "./index";
import { Module } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { AllPropsType } from "@/defaultProps";
import { cloneDeep } from "lodash-es";

export type totalComponentType = ComponentData | AllPropsType;
export interface ComponentData {
  id: string;
  name: string;
  layerName: string;
  isShow: boolean; //是否展示
  isLock: boolean; //是否锁定
  props: {
    [P in keyof AllPropsType]?: AllPropsType[P];
  };
}
export interface pagePropsType {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
export interface pageType {
  title: string;
  props: pagePropsType;
}
export interface historyDataType {
  id: string;
  type: "add" | "update" | "delete";
  data: any;
  operateIndex?: number;
}
export interface EditorProps {
  components: ComponentData[];
  currentElementId: string;
  page: pageType;
  copiedElement: ComponentData | null;
  historyList: historyDataType[];
  historyIndex: number;
  initText?: string;
}

const testComponents: ComponentData[] = [];
const testPage = {
  title: "testtitle",
  props: {
    backgroundColor: "yellow",
    backgroundImage: "url(https://qxxexample.oss-cn-beijing.aliyuncs.com/yun/1-52887.jpeg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: "500px",
  },
};
let timmer: ReturnType<typeof setTimeout> = setTimeout(() => "", 1000);
const checkHistory = (state: EditorProps) => {
  // 处理如果是undo中途添加了新操作，需要先把当前状态后面的 history 删除掉 在将当前操作push到historyList
  if (state.historyIndex !== state.historyList?.length - 1) {
    state.historyList.splice(state.historyIndex + 1);
  }
  // 限制历史列表长度最多为10
  if (state.historyList.length >= 10) {
    state.historyList.unshift();
  }
};
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElementId: "",
    page: testPage,
    copiedElement: null,
    historyList: [],
    historyIndex: -1,
    initText: "",
  },
  getters: {
    currentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElementId);
    },
  },
  mutations: {
    addComp(state, comp) {
      // TODO 从左侧新增加的时候需要更改
      const componentsLength = state.components.length;
      let newComp;
      if (comp.id) {
        // 从现有图层中复制的
        newComp = cloneDeep(comp);
      } else {
        // 从左侧列表添加的，只有props的信息
        const name = comp.tag === "img" ? "x-image" : "x-text";
        newComp = {
          name: name,
          isShow: true,
          isLock: false,
          props: {
            ...comp,
          },
        };
      }
      newComp.id = uuidv4();
      newComp.layerName = `图层${componentsLength + 1}`;
      state.components.push(newComp);
      // 向historyList 中添加记录
      const histtoryData: historyDataType = {
        id: newComp.id,
        type: "add",
        data: cloneDeep(newComp),
      };

      checkHistory(state);
      state.historyList.push(histtoryData);
      state.historyIndex++;
    },
    deleteComp(state, index: number) {
      const component = state.components[index];
      state.components.splice(index, 1);
      // 向historyList 中添加记录

      const histtoryData: historyDataType = {
        id: component.id,
        type: "delete",
        data: component,
        operateIndex: index,
      };
      checkHistory(state);
      state.historyList.push(histtoryData);
      state.historyIndex++;
    },
    changeCurEle(state, curEleId: string) {
      state.currentElementId = curEleId;
    },
    propChange(state, { key, value, id }: { key: string | string[]; value: string | boolean | string[]; id: string }) {
      // getters中的值在mutations中不可以直接用，需要重新写一遍。 要判断一下currentElement，但是不能用?.
      const currentElement = state.components.find((item) => item.id === (id || state.currentElementId));
      if (currentElement) {
        let histtoryData: historyDataType;
        if (id) {
          const newkey = key as keyof ComponentData;
          // tslint:disable-next-line
          currentElement[newkey] = value; // tslint:disable-line
        } else {
          let oldVal: string[] | string;
          // 判断传入要更新的是数组还是单个值， 如果是数组就遍历一下更改给新值。为了处理移动的时候top, left单独添加一条history数据
          // 只有更改top, left, width, height 的时候才会传数组
          if (Array.isArray(key) && Array.isArray(value)) {
            oldVal = [];
            key.forEach((itemkey, index) => {
              const newKey = itemkey as keyof totalComponentType;
              oldVal.push(currentElement.props[newKey]);
              currentElement.props[newKey] = value[index];
            });
            histtoryData = {
              id: currentElement.id,
              type: "update",
              data: { key: key, newVal: value, oldVal },
            };
          } else {
            const newKey = key as keyof totalComponentType;
            oldVal = currentElement.props[newKey];
            currentElement.props[newKey] = value;
            if (key === "text" && state.initText === "") {
              state.initText = oldVal;
            }
            histtoryData = {
              id: currentElement.id,
              type: "update",
              data: { key: key, newVal: value, oldVal },
            };
          }
          if (key === "text") {
            // 输入文本的时候防抖
            clearTimeout(timmer);
            timmer = setTimeout(function () {
              histtoryData.data.oldVal = state.initText;
              state.initText = "";
              checkHistory(state);
              state.historyList.push(histtoryData);
              state.historyIndex++;
            }, 1000);
          } else {
            checkHistory(state);
            state.historyList.push(histtoryData);
            state.historyIndex++;
          }
        }
      }
    },
    changeComponents(state, components: ComponentData[]) {
      state.components = components;
    },
    chagnePage(state, { key, value }: { key: string; value: string }) {
      const newKey = key as keyof pagePropsType;
      state.page.props[newKey] = value;
    },
    copyComp(state, component: ComponentData) {
      state.copiedElement = component;
    },
    undo(state) {
      const operateCentent = state.historyList[state.historyIndex];
      const { type, id, data } = operateCentent;
      const component = state.components.find((item) => item.id === id);
      if (type === "add") {
        const componentIndex = state.components.findIndex((item) => item.id === id);
        state.components.splice(componentIndex, 1);
      } else if (type === "delete") {
        const index = operateCentent.operateIndex as number;
        state.components.splice(index, 0, data);
      } else if (type === "update") {
        // 判断当时更新的数组是数组还是单个值
        const { oldVal, key } = data;
        if (Array.isArray(key) && Array.isArray(oldVal)) {
          key.forEach((itemkey, index) => {
            const newKey = itemkey as keyof totalComponentType;
            component.props[newKey] = oldVal[index];
          });
        } else {
          const newKey = key as keyof totalComponentType;
          component.props[newKey] = oldVal;
        }
      }
      state.historyIndex--;
    },
    redo(state) {
      state.historyIndex++;
      if (state.historyIndex === state.historyList.length) {
        state.historyList.length--;
      }
      const operateCentent = state.historyList[state.historyIndex];
      const { type, id, data } = operateCentent;
      const component = state.components.find((item) => item.id === id);
      if (type === "add") {
        state.components.push(data);
      } else if (type === "delete") {
        const componentIndex = state.components.findIndex((item) => item.id === id);
        state.components.splice(componentIndex, 1);
      } else if (type === "update") {
        // 判断当时更新的数组是数组还是单个值
        const { key, newVal } = data;
        if (Array.isArray(key) && Array.isArray(newVal)) {
          key.forEach((itemKey, index) => {
            const newKey = itemKey as keyof totalComponentType;
            component.props[newKey] = newVal[index];
          });
        } else {
          const newKey = key as keyof totalComponentType;
          component.props[newKey] = newVal;
        }
      }
    },
  },
};

export default editor;
