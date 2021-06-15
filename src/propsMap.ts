import { defaultPropsType } from "./defaultProps";
export interface PropFormValueType {
  component: string;
  subComponent?: string;
  value?: string;
  valueProp?: string;
  text: string;
  extraProps?: {
    [key: string]: any;
  };
  options?: { text: string; value: any }[];
  initialTranform?: (v: string) => any;
  finalTransform?: (v: string) => any;
  eventName?: string;
  events?: {
    [key: string]: (v: any) => any;
  };
}
export type PropsFormType = {
  [P in keyof defaultPropsType]?: PropFormValueType;
};

export const propsForm: PropsFormType = {
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
    initialTranform: (v) => parseFloat(v),
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
};
