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
  height: {
    component: "a-input-number",
    text: "高度",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
  },
  text: {
    component: "a-input",
    text: "文本",
  },
  fontSize: {
    component: "a-input-number",
    text: "字号",
    initialTranform: (v) => parseInt(v),
    finalTransform: (v) => `${v}px`,
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
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "对齐方式",
    options: [
      { text: "宋体", value: "'SimSun','STSong'" },
      { text: "黑体", value: "'SimHei', 'STHeiti'" },
      { text: "楷体", value: "'KaiTi', 'STKaiti'" },
      { text: "仿宋", value: "'FangSong', 'STFangsong'" },
    ],
  },
  color: {
    component: "ColorPicker",
    text: "字体颜色",
  },
  src: {
    component: "q-image",
    text: "图片",
  },
  backgroundImage: {
    component: "q-image",
    text: "背景图片",
  },
  backgroundColor: {
    component: "ColorPicker",
    text: "背景颜色",
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
  },
};
