export interface templateType {
  text: string;
  tag: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  actionType?: string;
  url?: string;
  backgroundColor?: string;
  src?: string;
}
export const defaultTemplates: templateType[] = [
  {
    text: "大标题",
    fontSize: "30px",
    fontWeight: "bold",
    tag: "h2",
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
