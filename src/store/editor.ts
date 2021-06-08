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
  currentElement: string;
}

const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "x-text",
    props: { text: "hello", fontSize: "12px", color: "red" },
  },
  { id: uuidv4(), name: "x-text", props: { text: "hello", fontSize: "14px", lineHeight: "1" } },
  { id: uuidv4(), name: "x-text", props: { text: "hello", fontSize: "16px", lineHeight: "2" } },
  { id: uuidv4(), name: "x-text", props: { text: "hello", fontSize: "18px", lineHeight: "1" } },
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
    currentElement: "",
  },
  getters: {
    currentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement);
    },
  },
  mutations: {
    addComp(state, comp) {
      const newComp = {
        id: uuidv4(),
        name: "x-text",
        // ...comp,
        props: {
          ...comp,
        },
      };
      state.components.push(newComp);
    },
    changeCurEle(state, curEleId: string) {
      state.currentElement = curEleId;
    },
  },
};

export default editor;
