/**
 * 公用的一些和业务无关方法
 */
import { onMounted, onUnmounted, ref, Ref } from "vue";

// 判断是否按下按下某个键
const useKeyPress = (keyNumber: number, cb: () => any) => {
  const handler = (event: KeyboardEvent) => {
    if (event.keyCode === keyNumber) {
      cb();
    }
  };
  onMounted(() => {
    document.addEventListener("keydown", handler);
  });
  onUnmounted(() => {
    document.removeEventListener("keydown", handler);
  });
};

// 判断是否在某个元素之外执行点击事件
const isClickOutside = (element: Ref<HTMLElement | null>) => {
  const isOutsizede = ref(true);
  const handler = (event: MouseEvent) => {
    if (element.value) {
      if (element.value.contains(event.target as HTMLElement)) {
        isOutsizede.value = false;
      } else {
        isOutsizede.value = true;
      }
    }
  };
  onMounted(() => {
    document.addEventListener("click", handler);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handler);
  });
  return isOutsizede;
};

export { useKeyPress, isClickOutside };
