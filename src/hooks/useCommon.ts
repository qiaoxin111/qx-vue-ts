import { computed } from "vue";
import { pick } from "lodash-es";
import { textPropsType } from "@/defaultProps";

const useCommon = <T extends Partial<textPropsType>>(props: T, picks: string[]) => {
  const styleProps = computed(() => pick(props, picks));
  const handleClick = () => {
    if (props.actionType === "url" && props.url) {
      window.location.href = props.url;
    }
  };
  return {
    styleProps,
    handleClick,
  };
};
export default useCommon;
