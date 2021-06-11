import { defaultPropsType } from "./defaultProps";

export interface propFormType {
    component: string;
    value?: string;
    text: string;
    extraProps?: {
      [key: string]: any;
    };
    initialTransform?: (v:string) => any 
}

export type PropsFormType = {
  [P in keyof defaultPropsType]?: propFormType
};

export const propsForm: PropsFormType = {
  text: {
    component: "a-input",
    text: "文本",
  },
  fontSize: {
    component: "a-input-number",
    text: "字号",
  },
  lineHeight: {
    component: "a-slider",
    text: "行号",
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
    initialTransform : (v) => parseFloat(v)
  },
  // textAlign: {

  // }
};
