import { commonProps } from "./defaultProps";
export interface templateType {
  text: string;
  tag: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontFamily?: string;
  textAlign?: string;
  color?: string;
  actionType?: string;
  url?: string;
  backgroundColor?: string;
  src?: string;
}
let defaultTemplates: templateType[] = [
  {
    text: "大标题",
    fontSize: "30px",
    fontStyle: "normal",
    fontWeight: "bold",
    fontFamily: "SimSun",
    textAlign: "center",
    tag: "h2",
    color: "#000",
    backgroundColor: "rgba(255,255,255,0)",
  },
  {
    text: "正文内容",
    tag: "p",
  },
  {
    text: "链接内容",
    color: "#f00",
    tag: "p",
    actionType: "url",
    url: "https://www.baidu.com",
  },
  {
    text: "按钮",
    tag: "p",
    backgroundColor: "#ff0",
    color: "#fff",
  },
  {
    text: "图片",
    tag: "img",
    src: "@/assets/logo.png",
  },
];
defaultTemplates = defaultTemplates.map((item) => {
  return {
    ...item,
    ...commonProps,
  };
});
console.log("defaultTemplates", defaultTemplates);
export { defaultTemplates };
