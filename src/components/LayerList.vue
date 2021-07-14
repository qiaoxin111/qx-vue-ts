<template>
  <div class="layerList">
    <a-card
      class="layer"
      v-for="(item, index) in componentsList"
      :key="index"
      size="small"
      style="width: 100%"
      draggable="true"
      @dragstart="dragstartHandler($event, index)"
      @dragenter="dragenterHandler($event, index)"
      @drop="dropHandler"
      @dragover="dragoverHandler"
      @mousedown="mousedownHandler($event, item.id)"
    >
      <div class="opeShow operate">
        <a-tooltip v-if="item.isShow" placement="top" @click="changeShow(item.isShow, item.id)">
          <template v-slot:title>
            <span>隐藏</span>
          </template>
          <a-icon type="eye-invisible" theme="twoTone" />
          <EyeInvisibleOutlined twoToneColor="#eb2f96" />
        </a-tooltip>
        <a-tooltip v-else placement="top" @click="changeShow(item.isShow, item.id)">
          <template v-slot:title>
            <span>显示</span>
          </template>
          <a-icon type="eye-invisible" theme="twoTone" />
          <EyeOutlined twoToneColor="#eb2f96" />
        </a-tooltip>
      </div>
      <div class="opeLock operate">
        <a-tooltip v-if="!item.isLock" placement="top" @click="changeLock(item.isLock, item.id)">
          <template v-slot:title>
            <span>锁定</span>
          </template>
          <a-icon type="eye-invisible" theme="twoTone" />
          <UnlockOutlined twoToneColor="#eb2f96" />
        </a-tooltip>
        <a-tooltip v-else placement="top" @click="changeLock(item.isLock, item.id)">
          <template v-slot:title>
            <span>解锁</span>
          </template>
          <a-icon type="eye-invisible" theme="twoTone" />
          <LockOutlined twoToneColor="#eb2f96" />
        </a-tooltip>
      </div>
      <LayerNameEditor :id="item.id" :layerName="item.layerName" @change="changeLayerName"></LayerNameEditor>
      <a-tooltip placement="top">
        <template v-slot:title>
          <span>排序</span>
        </template>
        <DragOutlined class="dragEle handle" :id="item.id" />
      </a-tooltip>
    </a-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from "vue";
import { EyeInvisibleOutlined, EyeOutlined, UnlockOutlined, LockOutlined, DragOutlined } from "@ant-design/icons-vue";
import { ComponentData } from "@/store/editor";
import LayerNameEditor from "@/components/LayerNameEditor.vue";

export default defineComponent({
  components: {
    EyeInvisibleOutlined,
    EyeOutlined,
    UnlockOutlined,
    LockOutlined,
    DragOutlined,
    LayerNameEditor,
  },
  props: {
    components: {
      type: Array as PropType<ComponentData[]>,
      required: true,
    },
  },
  emits: ["change", "changComponentsList"],
  setup(props, context) {
    const componentsList = ref<ComponentData[]>([]);
    const target = ref<HTMLElement | null>(null);
    const targetId = ref<string>("");
    watchEffect(() => {
      componentsList.value = props.components;
    });
    const currentDragbleEleIndex = ref(-1);
    const changeShow = (showStatus: boolean, id: string) => {
      context.emit("change", { id, key: "isShow", value: !showStatus });
    };
    const changeLock = (lockStatus: boolean, id: string) => {
      context.emit("change", { id, key: "isLock", value: !lockStatus });
    };
    const changeLayerName = (data: any) => {
      context.emit("change", data);
    };
    const dragstartHandler = (event: DragEvent, index: number) => {
      const handle = document.getElementById(targetId.value);
      if (!handle) return;
      // 判断是否是在DragOutlined上触发的拖拽 是：触发正常拖拽 否：阻止默认事件，拖拽不能触发
      if (handle.contains(target.value)) {
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
        }
        currentDragbleEleIndex.value = index;
      } else {
        event.preventDefault();
      }
    };
    const dropHandler = (event: DragEvent) => {
      event.preventDefault();
      context.emit("changComponentsList", componentsList);
    };
    const dragoverHandler = (event: DragEvent) => {
      event.preventDefault();
    };
    const dragenterHandler = (event: DragEvent, index: number) => {
      if (currentDragbleEleIndex.value === index) {
        return;
      }
      // 进入新元素，拖拽元素和新进入元素互换位置
      [componentsList.value[currentDragbleEleIndex.value], componentsList.value[index]] = [
        componentsList.value[index],
        componentsList.value[currentDragbleEleIndex.value],
      ];
      currentDragbleEleIndex.value = index;
    };
    const mousedownHandler = (event: MouseEvent, id: string) => {
      target.value = event.target as HTMLElement;
      targetId.value = id;
    };
    return {
      componentsList,
      changeShow,
      changeLock,
      changeLayerName,
      dragstartHandler,
      dropHandler,
      dragoverHandler,
      dragenterHandler,
      mousedownHandler,
    };
  },
});
</script>
<style lang="less" scoped>
.layerList {
  .layer {
    /deep/ .ant-card-body {
      display: flex;
    }
    .operate {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
    }
    .anticon {
      margin-right: 6px;
      font-size: 20px;
    }
    &:hover {
      background-color: #e9f6fe;
    }
    .dragEle {
      cursor: move;
      cursor: -webkit-grabbing;
    }
  }
}
</style>
