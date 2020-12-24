<template>
  <div class="home">
    <div
      class="right"
      v-if="
        ($route && $route.query && $route.query.action === 'edit') ||
        ($route && $route.query && $route.query.action === 'add')
      "
    >
      <button @click="save()">保存</button>
    </div>
    <table>
      <tr>
        <td class="left">单据编号：</td>
        <td class="right">{{ bxdDetail.billCode }}</td>
      </tr>
      <tr>
        <td class="left">部门：</td>
        <td class="right">
          <input
            type="text"
            class="com-input"
            v-model="bxdDetail.dept"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
      </tr>
      <tr>
        <td class="left">制单人：</td>
        <td class="right">
          <input
            type="text"
            class="com-input"
            v-model="bxdDetail.billCreator"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
      </tr>
      <tr>
        <td class="left">报账金额：</td>
        <td class="right">
          {{ amount }}
        </td>
      </tr>
      <tr>
        <td class="left">单据状态：</td>
        <td class="right">
          <select
            class="com-input"
            v-model="bxdDetail.billStatus"
            v-bind:disabled="
              $route && $route.query && $route.query.action === 'view'
            "
          >
            <option value="Billing">制 单</option>
            <option value="SubmitBill">提交审批</option>
            <option value="PassedBill">审批通过</option>
            <option value="RejectBill">审批驳回</option>
          </select>
        </td>
      </tr>
      <tr>
        <td class="left">报销类型：</td>
        <td class="right">
          <select
            class="com-input"
            v-model="bxdDetail.billType"
            v-bind:disabled="
              $route && $route.query && $route.query.action === 'view'
            "
          >
            <option value="PL">请选择</option>
            <option value="CL">差旅费</option>
            <option value="JT">交通费</option>
            <option value="SJ">手机费</option>
          </select>
        </td>
      </tr>
      <tr>
        <td class="left">制单日期：</td>
        <td class="right">
          <input
            type="Date"
            class="com-input"
            v-model="bxdDetail.billDate"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
      </tr>
      <tr>
        <td class="left">报销说明：</td>
        <td class="right">
          <input
            type="text"
            class="com-input"
            v-model="bxdDetail.note"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
      </tr>
      <tr>
        <td class="left">稽核状态：</td>
        <td class="right">
          <select
            class="com-input"
            v-model="bxdDetail.auditStatus"
            v-bind:disabled="
              $route && $route.query && $route.query.action === 'view'
            "
          >
            <option value="UN">未稽核</option>
            <option value="PSD">稽核通过</option>
            <option value="RED">稽核不通过</option>
          </select>
        </td>
      </tr>
    </table>
    <h4 class="h4">
      <span
        class="fright"
        @click="addExpenseDetail()"
        v-if="
          ($route && $route.query && $route.query.action === 'edit') ||
          ($route && $route.query && $route.query.action === 'add')
        "
        >新增费用明细</span
      >费用明细
    </h4>
    <table class="sub_table">
      <tr>
        <td>报销发票号</td>
        <td>报销金额</td>
        <td>发票日期</td>
        <td>发票说明</td>
      </tr>
      <tr v-for="sub in bxdDetailSub" v-bind:key="sub['id']">
        <td>
          <input
            type="text"
            class="center-input"
            v-model="sub.invoiceNO"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
        <td>
          <input
            type="number"
            class="center-input"
            v-model="sub.billDetailAmount"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
        <td>
          <input
            type="Date"
            class="com-input pr-20"
            v-model="sub.billDetailDate"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
        <td>
          <input
            type="text"
            class="center-input"
            v-model="sub.billDetailNote"
            v-bind:readonly="
              $route && $route.query && $route.query.action === 'view'
            "
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
interface BXDDETAIL {
  id: string;
  pid?: string;
  billDetailDate?: string;
  billDetailAmount?: number;
  billDetailNote?: string;
  invoiceNO?: string;
}

interface BXDLIST {
  id: string;
  billCreator: string;
  dept: string;
  billCode: string;
  totalSum: number;
  billType: string;
  billStatus: string;
  billDate: string;
  note: string;
  auditStatus: string;
  bxdDetail: BXDDETAIL[];
}

import Vue from "vue";
const Mock = require("mockjs");

export default Vue.extend({
  name: "Detail",
  components: {},
  data: function () {
    return {
      bxdDetail: {} as BXDLIST,
      bxdDetailSub: [] as BXDDETAIL[],
    };
  },
  mounted: function () {
    // console.log(this.$route, this.$router);
    if (this.$route.query.action === "add") {
      this.add();
    } else {
      this.query();
    }
  },
  methods: {
    save() {
      let data = this.bxdDetail;
      this.bxdDetail.bxdDetail = this.bxdDetailSub;
      this.axios
        .get("http://localhost:8080/fybxd/save", { data: data })
        .then((res) => {
          this.$router.push({
            name: "Detail",
            query: { action: "view", id: res["data"]["id"] },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    add() {
      this.axios
        .get("http://localhost:8080/fybxd/add")
        .then((res) => {
          if (res && res["data"] && res["data"]["content"]) {
            this.bxdDetail = res["data"]["content"];
            this.bxdDetailSub = [];
            if (!this.bxdDetail["billStatus"]) {
              this.bxdDetail["billStatus"] = "Billing";
            }
            if (!this.bxdDetail["billType"]) {
              this.bxdDetail["billType"] = "PL";
            }
            if (!this.bxdDetail["auditStatus"]) {
              this.bxdDetail["auditStatus"] = "UN";
            }
            if (!this.bxdDetail["billDate"]) {
              this.bxdDetail["billDate"] =
                new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    query() {
      this.axios
        .get("http://localhost:8080/fybxd/detail", {
          data: { id: this.$route.query.id },
        })
        .then((res) => {
          if (res && res["data"] && res["data"]["content"]) {
            this.bxdDetail = res["data"]["content"];
            this.bxdDetailSub = this.bxdDetail.bxdDetail;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addExpenseDetail() {
      /* istanbul ignore next */
      this.bxdDetailSub.push({
        id: Mock.Random.uuid(),
        pid: this.bxdDetail.id,
      });
    },
  },
  computed: {
    amount: function () {
      let amount = 0;
      this.bxdDetailSub.forEach((item) => {
        amount += Number(item["billDetailAmount"]);
      });

      return amount;
    },
  },
});
</script>

<style scoped>
.home {
  padding: 0 15px;
}
table {
  width: 100%;
}
table td {
  border-bottom: 1px solid #dfdfdf;
  height: 2rem;
}
.left {
  text-align: left;
  padding-left: 12px;
}
.right {
  text-align: right;
  padding-right: 12px;
}
.fright {
  float: right;
  font-weight: normal;
}
.h4 {
  margin: 20px 0;
  color: #f40;
  text-align: left;
}
.com-input {
  border: none;
  height: 26px;
  line-height: 26px;
  text-align: right;
  font-size: 16px;
  font-family: Microsoft yahei;
  outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="date"] {
  margin-right: -38px;
}

select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  direction: rtl;
  padding: 0 6px;
  margin-right: -6px;
  color: #000;
}
.center-input {
  border: none;
  height: 26px;
  line-height: 26px;
  text-align: center;
  font-size: 16px;
  font-family: Microsoft yahei;
  outline: none;
}

.sub_table input[type="text"],
.sub_table input[type="number"] {
  width: 100px;
  overflow: hidden;
}
.pr-20 {
  padding-right: 38px;
}
</style>
