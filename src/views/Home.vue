<template>
  <div class="home">
    <!-- <button @click="getUserInfo">获取用户信息</button>
    <button @click="getCityInfo">获取城市信息</button> -->
    <table>
      <tr>
        <td align="right">请输入报销单号：</td>
        <td align="left"><input type="text" v-model="searchCode" /></td>
        <td>
          <button @click="query">查询</button
          ><button @click="LoadAndAdd">新增</button>
        </td>
      </tr>
      <tr>
        <td align="right">报销类型：</td>
        <td align="left">
          <select v-model="searchType">
            <option value="PL">请选择</option>
            <option value="CL">差旅费</option>
            <option value="JT">交通费</option>
            <option value="SJ">手机费</option>
          </select>
        </td>
        <td></td>
      </tr>
      <tr>
        <td align="right">制单人：</td>
        <td align="left">
          <input type="text" v-model="searchPerson" />
        </td>
        <td></td>
      </tr>
    </table>
    <div style="height: 1px; background: #ddd; margin-top: 20px"></div>
    <list-single
      @deleteById="deleteItem"
      v-for="item in bxdList"
      v-bind:key="item.id"
      :item="item"
    ></list-single>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ListSingle from "@/components/ListSingle.vue"; // @ is an alias to /src

export default Vue.extend({
  name: "Home",
  components: {
    ListSingle,
  },
  data: function () {
    return {
      searchCode: "",
      searchType: "PL",
      searchPerson: "",
      bxdList: [],
    };
  },
  mounted: function () {
    this.requestQuery({});
  },
  methods: {
    LoadAndAdd() {
      this.$router.push({
        name: "Detail",
        query: { action: "add" },
      });
    //   this.axios
    //     .get("http://localhost:8080/fybxd/add")
    //     .then((res) => {
    //       if (res && res["data"] && res["data"]["content"]) {
    //         this.bxdList = res["data"]["content"];
    //         if (res["data"]["msg"] === "success") {
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    },
    deleteItem(id: string) {
      if (window.confirm("确认删除该条数据？")) {
        this.axios
          .get("http://localhost:8080/fybxd/delete", { data: { id: id } })
          .then((res) => {
            if (res && res["data"] && res["data"]["content"]) {
              this.bxdList = res["data"]["content"];
              if (res["data"]["msg"] === "success") {
                alert("删除成功");
              } else {
                alert("删除失败");
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    query() {
      let data: any = {};

      if (!!this.searchCode) {
        data["billCode"] = this.searchCode;
      }

      if (!!this.searchType && this.searchType !== "PL") {
        data["billType"] = this.searchType;
      }

      if (!!this.searchPerson) {
        data.billCreator = this.searchPerson;
      }

      this.requestQuery(data);
    },
    requestQuery(data: any) {
      if (Object.keys(data).length) {
        this.axios
          .get("http://localhost:8080/fybxd/list", { data: data })
          .then((res) => {
            if (res && res["data"] && res["data"]["content"]) {
              this.bxdList = res["data"]["content"];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.axios
          .get("http://localhost:8080/fybxd/list")
          .then((res) => {
            if (res && res["data"] && res["data"]["content"]) {
              this.bxdList = res["data"]["content"];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getCityInfo() {},
  },
});
</script>

<style scoped>
.home {
  padding: 0 15px;
}
</style>