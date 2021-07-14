import { GlobalDataProps } from "./index";
import { Module } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { AllPropsType } from "@/defaultProps";

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
export interface EditorProps {
  components: ComponentData[];
  currentElementId: string;
  page: pageType;
}

const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "x-text",
    layerName: "图层1",
    isShow: true,
    isLock: false,
    props: { text: "hello", fontSize: "12px", color: "red" },
  },
  {
    id: uuidv4(),
    name: "x-text",
    layerName: "图层2",
    isShow: true,
    isLock: false,
    props: { text: "hello1", fontSize: "14px", lineHeight: "1", color: "#000", textAlign: "center" },
  },
  {
    id: uuidv4(),
    name: "x-text",
    layerName: "图层3",
    isShow: true,
    isLock: false,
    props: { text: "hello2", fontSize: "18px", lineHeight: "2", textAlign: "left" },
  },
  {
    id: uuidv4(),
    name: "x-text",
    layerName: "图层4",
    isShow: true,
    isLock: false,
    props: { text: "hello3", fontSize: "14px", lineHeight: "1", fontFamily: "SimSun" },
  },
  {
    id: uuidv4(),
    name: "x-text",
    layerName: "图层5",
    isShow: true,
    isLock: false,
    props: {
      text: "hello",
      fontSize: "18px",
      actionType: "url",
      url: "http://www.baidu.com",
    },
  },
];
const testPage = {
  title: "testtitle",
  props: {
    backgroundColor: "#f00",
    backgroundImage: "url(https://qxxexample.oss-cn-beijing.aliyuncs.com/yun/1-52887.jpeg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: "500px",
  },
};
const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElementId: "",
    page: testPage,
  },
  getters: {
    currentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElementId);
    },
  },
  mutations: {
    addComp(state, comp) {
      const name = comp.tag === "img" ? "x-image" : "x-text";
      const componentsLength = state.components.length;
      const newComp = {
        id: uuidv4(),
        name: name,
        layerName: `图层${componentsLength + 1}`,
        isShow: true,
        isLock: false,
        props: {
          ...comp,
        },
      };
      state.components.push(newComp);
    },
    changeCurEle(state, curEleId: string) {
      state.currentElementId = curEleId;
    },
    propChange(state, { key, value, id }: { key: string; value: string | boolean; id: string }) {
      // getters中的值在mutations中不可以直接用，需要重新写一遍。 要判断一下currentElement，但是不能用?.
      const currentElement = state.components.find((item) => item.id === (id || state.currentElementId));
      if (currentElement) {
        if (id) {
          const newkey = key as keyof ComponentData;
          // tslint:disable-next-line
          currentElement[newkey] = value; // tslint:disable-line
        } else {
          const newKey = key as keyof totalComponentType;
          // tslint:disable-next-line
          currentElement.props[newKey] = value;
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
  },
};

export default editor;
