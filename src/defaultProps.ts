import { without, mapValues } from "lodash-es";

export const commonProps = {
  actionType: "",
  url: "",
  // size
  width: "",
  height: "30px",
  paddingLeft: "0px",
  paddingRight: "0px",
  paddingTop: "0px",
  paddingBottom: "0px",
  // border type
  borderStyle: "none",
  borderColor: "#000",
  borderWidth: "0",
  borderRadius: "0",
};

export const textDefaultProps = {
  text: "正文内容",
  fontSize: "12px",
  fontStyle: "normal",
  fontFamily: "SimSun",
  lineHeight: "1",
  textAlign: "left",
  color: "#000",
  backgroundColor: "",
  ...commonProps,
};

export const imageDefaultProps = {
  src: "",
  ...commonProps,
};

// defaultProps
export type textPropsType = typeof textDefaultProps;
export type imagePropsType = typeof imageDefaultProps;

export type AllPropsType = textPropsType & imagePropsType;
// export const pickStyleProps = <T extends textPropsType | imagePropsType>(props: T) =>
//   without(Object.keys(props), "actionType", "url");

export const pickImageStyleProps = <T extends imagePropsType>(props: T) =>
  without(Object.keys(props), "actionType", "url", "src");
export const pickTextStyleProps = <T extends textPropsType>(props: T) =>
  without(Object.keys(props), "actionType", "url");

export const transformToComponentProps = (props: textPropsType | imagePropsType) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor as StringConstructor,
      value: item,
    };
  });
};

// export default defaultProps;
