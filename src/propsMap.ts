import { textPropsType, imagePropsType } from "./defaultProps";
import { pagePropsType } from "./store/editor";
export interface PropFormValueType {
  component: string;
  subComponent?: string;
  value?: string;
  valueProp?: string;
  text: string;
  extraProps?: {
    [key: string]: any;
  };
  isPic?: boolean;
  options?: { text: string; value: any }[];
  initialTranform?: (v: string) => any;
  finalTransform?: (v: string) => any;
  eventName?: string;
  events?: {
    [key: string]: (v: any) => any;
  };
  defaultValue: any;
}
// type L = {
//   a: string;
//   b: string;
// };
// type K = {
//   a: string;
//   c: string;
// };
// export type M = L & K;
// type Text = {};
export type AllPropsType = textPropsType & imagePropsType & pagePropsType;
export type PropsFormType = {
  [P in keyof AllPropsType]?: PropFormValueType;
  // [K in keyof imagePropsType]?: PropFormValueType;
};

export const propsForm: PropsFormType = {
  width: {
    component: "a-input-number",
    text: "宽度",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "50",
  },
  height: {
    component: "a-input-number",
    text: "高度",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "30",
  },
  paddingLeft: {
    component: "a-input-number",
    text: "左边距",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  paddingRight: {
    component: "a-input-number",
    text: "右边距",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  paddingTop: {
    component: "a-input-number",
    text: "上边距",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  paddingBottom: {
    component: "a-input-number",
    text: "下边距",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  borderStyle: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "边框类型",
    options: [
      { text: "无", value: "none" },
      { text: "实线", value: "solid" },
      { text: "破折线", value: "dashed" },
      { text: "点状线", value: "dotted" },
    ],
    defaultValue: "none",
  },
  borderColor: {
    component: "ColorPicker",
    text: "边框颜色",
    defaultValue: "#fff",
  },
  borderWidth: {
    component: "a-input-number",
    text: "边框宽度",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  borderRadius: {
    component: "a-input-number",
    text: "边框圆角",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  left: {
    component: "a-input-number",
    text: "x轴坐标",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  top: {
    component: "a-input-number",
    text: "y轴坐标",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "0",
  },
  actionType: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "点击",
    options: [
      { text: "无", value: "" },
      { text: "跳转到url", value: "url" },
    ],
    defaultValue: "",
  },
  url: {
    component: "a-input",
    text: "文本",
    defaultValue: "",
  },
  text: {
    component: "a-input",
    text: "文本",
    defaultValue: "",
  },
  fontSize: {
    component: "a-input-number",
    text: "字号",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
    defaultValue: "14",
  },
  lineHeight: {
    component: "a-slider",
    text: "行号",
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
    initialTranform: (v: string) => parseFloat(v),
    defaultValue: "1",
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐方式",
    options: [
      { text: "左对齐", value: "left" },
      { text: "居中", value: "center" },
      { text: "右对齐", value: "right" },
    ],
    defaultValue: "left",
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [
      { text: "宋体", value: "'SimSun','STSong'" },
      { text: "黑体", value: "'SimHei', 'STHeiti'" },
      { text: "楷体", value: "'KaiTi', 'STKaiti'" },
      { text: "仿宋", value: "'FangSong', 'STFangsong'" },
    ],
    defaultValue: "SimSun",
  },
  color: {
    component: "ColorPicker",
    text: "字体颜色",
    defaultValue: "#fff",
  },
  src: {
    component: "q-image",
    text: "图片",
    defaultValue: "",
  },
  backgroundImage: {
    component: "q-image",
    text: "背景图片",
    defaultValue: "",
  },
  backgroundColor: {
    component: "ColorPicker",
    text: "背景颜色",
    defaultValue: "#ffffff",
  },
  backgroundRepeat: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "背景重复",
    options: [
      { text: "无重复", value: "no-repeat" },
      { text: "x轴重复", value: "repeat-x" },
      { text: "y轴重复", value: "repeat-y" },
      { text: "全部重复", value: "repeat" },
    ],
    defaultValue: "no-repeat",
  },
  backgroundSize: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "背景大小",
    options: [
      { text: "自动缩放", value: "contain" },
      { text: "自动填充", value: "cover" },
      { text: "默认", value: "" },
    ],
    defaultValue: "",
  },
};
