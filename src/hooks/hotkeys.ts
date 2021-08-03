import hotkeys, { HotkeysEvent } from "hotkeys-js";
import store from "../store/index";
import { computed } from "vue";
const initHotKey = (key: string, callback: () => void) => {
  const wrapFun = hotkeys(key, function (event: KeyboardEvent, handler: HotkeysEvent) {
    // Prevent the default refresh event under WINDOWS system
    event.preventDefault();
    callback();
  });
  return wrapFun;
};

const currentElement = computed(() => store.getters.currentElement);
const oldLeft = computed(() => currentElement.value.props.left);
const oldTop = computed(() => currentElement.value.props.top);

const hotKeyMethods = {
  copy: () => {
    if (currentElement.value) {
      store.commit("copyComp", currentElement);
      alert("复制成功");
    }
  },
  paste: () => {
    if (store.state.editor.copiedElement) {
      store.commit("addComp", store.state.editor.copiedElement);
      alert("粘贴成功");
    }
  },
  delete: () => {
    if (currentElement.value) {
      const comIndex = store.state.editor.components.findIndex((item) => item.id === currentElement.value.id);
      store.commit("deleteComp", comIndex);
      alert("删除成功");
    }
  },
  deselect: () => {
    if (currentElement.value) {
      store.commit("changeCurEle", "");
      alert("取消选中");
    }
  },
  up: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "top", value: parseFloat(oldTop.value) - 1 + "px" });
  },
  down: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "top", value: parseFloat(oldTop.value) + 1 + "px" });
  },
  left: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "left", value: parseFloat(oldLeft.value) - 1 + "px" });
  },
  right: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "left", value: parseFloat(oldLeft.value) + 1 + "px" });
  },
  shiftUp: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "top", value: parseFloat(oldTop.value) - 10 + "px" });
  },
  shiftDown: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "top", value: parseFloat(oldTop.value) + 10 + "px" });
  },
  shiftLeft: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "left", value: parseFloat(oldLeft.value) - 10 + "px" });
  },
  shiftRight: () => {
    if (!currentElement.value) return;
    store.commit("propChange", { key: "left", value: parseFloat(oldLeft.value) + 10 + "px" });
  },
};

export { initHotKey, hotKeyMethods };
