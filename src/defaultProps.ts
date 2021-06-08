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

export const defaultProps = {
  text: "正文内容",
  fontSize: "12px",
  fontStyle: "normal",
  lineHeight: "1",
  textAlign: "left",
  color: "#000",
  backgroundColor: "",
  ...commonProps,
};

export type defaultPropsType = typeof defaultProps;

const obj = { a: "aa", b: "BBB" };

export interface testProps {
  a: string;
  b: string;
}
const test = <T extends testProps>(o: T): string[] => Object.keys(o);
test(obj);

export const pickStyleProps = <T extends defaultPropsType>(props: T) =>
  without(Object.keys(props), "actionType", "url");

// const mapValues = <T extends Partial<defaultPropsType>, K extends keyof T>(
//   props: T
// ): {
//   [key in K]: {
//     type: () => void;
//     value: string;
//   };
// } => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const result = {} as any;
//   Object.entries(props).forEach(([key, value]) => {
//     result[key] = {
//       type: value && value.constructor,
//       value: value,
//     };
//   });
//   return result;
// };

export const transformToComponentProps = (props: defaultPropsType) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor as StringConstructor,
      value: item,
    };
  });
};

export default defaultProps;
