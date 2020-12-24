<template>
  <div class="about">
    <template v-if="!$store.state.sessionId">
      <h1>LOGIN PAGE</h1>
      用户名：<input type="text" v-model="user" class="border" />
      <br />
      密码：<input type="password" v-model="pwd" class="border" />
      <br />
      <button @click="login">登录</button>
    </template>
    <template v-else>
      用户名： {{ $store.state.userName }}， <span @click="logout">退出</span>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
  data: function () {
    return {
      user: "",
      pwd: "",
    };
  },
  mounted: function () {
    if (window.sessionStorage.getItem("sessionId")) {
      this.setState(
        "modifySessionId",
        window.sessionStorage.getItem("sessionId")
      );
      this.setState(
        "modifyUserName",
        window.sessionStorage.getItem("userName")
      );
    }
  },
  methods: {
    login() {
      let _this = this;
      if (!this.user || !this.pwd) {
        alert("用户名或密码必填");
        return;
      }
      this.axios
        .get("http://localhost:8080/login/login", {
          data: { userName: this.user, pwd: this.pwd },
        })
        .then(function (res: any) {
          const data = res["data"];
          if (data && data["msg"] === "success") {
            alert("登录成功！");
            window.sessionStorage.setItem("sessionId", data["sessionId"]);
            window.sessionStorage.setItem("userName", data["userName"]);
            _this.setState("modifySessionId", data["sessionId"]);
            _this.setState("modifyUserName", data["userName"]);
          } else {
            alert("登录失败，用户名或密码错误");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    logout() {
      if (window.confirm("确定要退出？")) {
        window.sessionStorage.removeItem("sessionId");
        window.sessionStorage.removeItem("userName");
        this.setState("modifySessionId", "");
        this.setState("modifyUserName", "");
        alert("退出成功")!;
      }
    },
    setState(state: string, value: any) {
      this.$store.commit(state, value);
    },
  },
});
</script>
<style scoped>
.border {
  color: 1px solid #ddd;
}
</style>