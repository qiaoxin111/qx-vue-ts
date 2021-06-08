import { Module } from "vuex";
import { GlobalDataProps } from "./index";
export interface TemplateProps {
  id: string;
  coverImage: string;
}
const testData = [
  { id: "0", coverImage: "asdf", title: "第一 个名字" },
  { id: "1", coverImage: "fgh", title: "第二个名字" },
  { id: "2", coverImage: "asdf", title: "第3个名字" },
  { id: "3", coverImage: "fgh", title: "第4个名字" },
  { id: "4", coverImage: "asdf", title: "第5 个名字" },
  { id: "5", coverImage: "fgh", title: "第6个名字" },
  { id: "6", coverImage: "asdf", title: "第一 个名字" },
  { id: "7", coverImage: "fgh", title: "第8个名字" },
];
export interface TemplatesProps {
  data: TemplateProps[];
}
const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData,
  },
};

export default templates;
