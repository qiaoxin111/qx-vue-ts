import { computed } from "vue";
import { pick } from "lodash-es";
import { defaultPropsType } from "@/defaultProps";

const useCommon = <T extends Partial<defaultPropsType>>(props: T, picks: string[]) => {
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
