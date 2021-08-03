<template>
  <div class="handleMenu">
    {{ historyIndex }}
    <div
      v-for="(item, index) in historyList"
      :key="index"
      :style="{ fontWeight: index === historyIndex ? 'bold' : 'normal' }"
    >
      {{ item.type }} --- {{ item.data }}
    </div>
    <div class="tip">
      <a-tooltip class="tipItem" placement="top" @click="openShortcut">
        <template v-slot:title>
          <span>快捷键提示</span>
        </template>
        <a-icon type="eye-invisible" theme="twoTone" />
        <a-button shape="circle">
          <template #icon><QuestionOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-modal class="shoutCutOper" v-model:visible="shortcutVisible" :footer="null" title="快捷键操作">
        <div class="shoutCut" v-for="(item, index) in shortcutList" :key="index">
          <span class="name">{{ item.name }}</span
          ><span class="key">{{ item.key }}</span>
        </div>
      </a-modal>
      <a-tooltip class="tipItem" placement="top" @click="undo">
        <template v-slot:title>
          <span>撤销</span>
        </template>
        <a-icon type="eye-invisible" theme="twoTone" />
        <a-button shape="circle" :disabled="isUndoDisable">
          <template #icon><UndoOutlined /></template>
        </a-button>
      </a-tooltip>
      <a-tooltip class="tipItem" placement="top" @click="redo">
        <template v-slot:title>
          <span>重做</span>
        </template>
        <a-icon type="eye-invisible" theme="twoTone" />

        <a-button :disabled="isRedoDisable" shape="circle">
          <template #icon><RedoOutlined /></template>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { QuestionOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    QuestionOutlined,
    RedoOutlined,
    UndoOutlined,
  },
  setup(props, context) {
    const shortcutList = [
      { name: "拷贝图层", key: "⌘C/Ctrl+C" },
      { name: "粘贴图层", key: "⌘V/Ctrl+V" },
      { name: "删除图层", key: "Backspace/Delete" },
      { name: "取消选中", key: "ESC" },
      { name: "撤销", key: "⌘Z/Ctrl+Z" },
      { name: "重做", key: "⌘⇧Z/Ctrl+Shift+Z" },
      { name: "上下左右移动一像素", key: "↑↓→←" },
      { name: "上下左右移动十像素", key: "Shift+↑↓→←" },
    ];
    const shortcutVisible = ref(false);
    const isUndoDisable = ref(false);
    const isRedoDisable = ref(false);
    const store = useStore();
    const historyList = computed(() => store.state.editor.historyList);
    const historyIndex = computed(() => store.state.editor.historyIndex);
    watch(
      [historyList, historyIndex],
      () => {
        isUndoDisable.value = historyList.value.length === 0 || historyIndex.value <= -1;
        isRedoDisable.value = historyList.value.length === 0 || historyIndex.value === historyList.value.length - 1;
        // historyList.value.length === 1;
      },
      {
        immediate: true,
      }
    );
    const openShortcut = () => {
      shortcutVisible.value = true;
    };
    const undo = () => {
      store.commit("undo");
    };
    const redo = () => {
      store.commit("redo");
    };
    return {
      shortcutVisible,
      isUndoDisable,
      isRedoDisable,
      historyList,
      historyIndex,
      openShortcut,
      undo,
      redo,
      shortcutList,
    };
  },
});
</script>
<style lang="less" scoped>
.handleMenu {
  .tip {
    font-size: 20px;
    .tipItem {
      margin-right: 10px;
    }
  }
}
.shoutCutOper {
  width: 400px !important;
  .shoutCut {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 3px;
    .name {
      color: #c7c7c7;
    }
    .key {
      color: #4091f7;
    }
  }
}
</style>
