import { GlobalDataProps } from "./index";
import { Module } from "vuex";
import { v4 as uuidv4 } from "uuid";

export interface ComponentData {
  id: string;
  name: string;
  props: {
    [key: string]: string;
  };
}

export interface EditorProps {
  components: ComponentData[];
  currentElementId: string;
}

const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "x-text",
    props: { text: "hello", fontSize: "12px", color: "red" },
  },
  {
    id: uuidv4(),
    name: "x-text",
    props: { text: "hello1", fontSize: "14px", lineHeight: "1", color: "#000", textAlign: "center" },
  },
  { id: uuidv4(), name: "x-text", props: { text: "hello2", fontSize: "18px", lineHeight: "2", textAlign: "left" } },
  { id: uuidv4(), name: "x-text", props: { text: "hello3", fontSize: "14px", lineHeight: "1", fontFamily: "SimSun" } },
  {
    id: uuidv4(),
    name: "x-text",
    props: {
      text: "hello",
      fontSize: "18px",
      actionType: "url",
      url: "http://www.baidu.com",
    },
  },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElementId: "",
  },
  getters: {
    currentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElementId);
    },
  },
  mutations: {
    addComp(state, comp) {
      const name = comp.tag === "img" ? "x-image" : "x-text";
      const newComp = {
        id: uuidv4(),
        name: name,
        props: {
          ...comp,
        },
      };
      state.components.push(newComp);
    },
    changeCurEle(state, curEleId: string) {
      state.currentElementId = curEleId;
    },
    propChange(state, { key, value }) {
      // getters中的值在mutations中不可以直接用，需要重新写一遍。 要判断一下currentElement，但是不能用?.
      const currentElement = state.components.find((item) => item.id === state.currentElementId);
      if (currentElement) {
        currentElement.props[key] = value;
      }
    },
  },
};

export default editor;
