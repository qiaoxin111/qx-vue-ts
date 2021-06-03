<template>
  <div class="template-list-component">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="item in list.data" :key="item.id">
        <a-card class="qx-card" hoverable style="width: 240px">
          <template #cover>
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          </template>
          <a-card-meta :title="item.title"> </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { TemplatesProps } from "../store/templetes";
export default defineComponent({
  name: "template-list",
  props: {
    list: {
      type: Object as PropType<TemplatesProps[]>,
      required: true,
    },
  },
  // setup(props) {},
});
</script>
<style lang="less">
.ant-row {
  .ant-col {
    display: flex;
    justify-content: center;
  }
}
</style>
