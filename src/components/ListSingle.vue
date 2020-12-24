<template>
  <div class="hello">
    <dl class="list">
      <dt>
        <!-- :to="{ name: 'Detail', query: { id: item.id } }" -->
        <span @click="$emit('deleteById', item.id)" class="right">删除</span>
        <span class="right" style="padding: 0 10px"
          >&nbsp;&nbsp;|&nbsp;&nbsp;</span
        >
        <span @click="goToDetail(item.id, 'edit')" class="right">编辑</span>
        <span class="right" style="padding: 0 10px"
          >&nbsp;&nbsp;|&nbsp;&nbsp;</span
        >
        <span @click="goToDetail(item.id, 'view')" class="right">详情</span>
        报销单号：{{ item && item.billCode }}
      </dt>
      <dd>制单人：{{ item && item.billCreator }}</dd>
      <dd>制单类型：{{ item && item.billType }}</dd>
      <dd>制单日期：{{ item && item.billDate }}</dd>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ListSingle",
  props: {
    item: Object,
  },
  mounted: function () {
    this.listenBillType();
  },
  updated: function () {
    this.listenBillType();
  },
  methods: {
    listenBillType() {
      if (this.item.billType === "CL") {
        this.item.billType = "差旅费";
      } else if (this.item.billType === "JT") {
        this.item.billType = "交通费";
      } else if (this.item.billType === "SJ") {
        this.item.billType = "手机费";
      }
    },
    goToDetail(id: string, action: string) {
      this.$router.push({ name: "Detail", query: { id: id, action: action } });
    },
  },
});
</script>

<style scoped>
dd {
  margin: 10px 0;
}
.list {
  border-bottom: 1px solid #ddd;
  text-align: left;
  margin: 20px 0 0 0;
}
.right {
  float: right;
}
</style>
