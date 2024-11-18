<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
import useLoginStore from "@/stores/index.js";
const store = useLoginStore()
const userData = useLoginStore().getUserData
const style = ref(computeStyle(userData));

function computeStyle(userData) {
  return userData.role === 1 ? "background-color: #2c006b" :
      (userData.role === 2 ? "background-color: #5ec069" :
          (userData.role === 3 ? "background-color: #817e00" : "background:#ff7089"));
}
const signOut = () => {
  store.clearSession()
  router.push("/login")
}
const inUserCenter = ()=>{
  router.push("/userCenter");
}
</script>

<template>
  <div class="avatarBorder">
    <img @click="inUserCenter" :src="userData.avatar?userData.avatar:''" alt="" class="avatar">
    <div class="userCard">
      <div class="userCard-info">
        <div class="header">
          <div class="name">{{ userData.username }}</div>
          <div :style="style" class="role">
            {{
              userData.role === 1 ? "开发者" :
                  (userData.role === 2 ? "管理员" :
                      (userData.role === 3 ? "会　员" : "用　户"))
            }}
          </div>
        </div>
        <div class="email">{{ userData.email }}</div>
        <div class="signOut" @click="signOut">登出</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: 800px) {
  .avatarBorder {
    transform: scale(.7);
  }
}

.avatarBorder {
  width: 75px;
  border-radius: 50%;
  position: relative;
  z-index: 100;
  box-sizing: border-box;

  .avatar {
    position: relative;
    z-index: 100;
    box-shadow: #a7a7a7 0 0 10px 1px;
    width: 75px;
    border-radius: 50%;
    transition: transform 0.5s ease;
  }
}

.userCard {
  box-sizing: initial;
  background-color: #fff;
  transition: 0.3s;
  z-index: 99;
  opacity: 0;
  transform: translateX(20%) translateY(-50%);
  position: absolute;
  top: 50%;
  left: -200px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow: #b9b9b9 5px 0 10px 1px;
  border-radius: 10px;

  .userCard-info {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    margin-right: 40px;
    .header {
      display: flex;
      align-items: center;

      .name {
        font-size: 20px;
        font-weight: 600;
      }

      .role {
        line-height: 90%;
        height: 1.3rem;
        margin-left: 8px;
        text-align: center;
        color: white;
        font-size: 14px;
        border-radius: 5px;
        padding: 5px;
        background-color: #2c006b;
      }
    }

    .email {
      font-size: 14px;
      font-weight: 100;
      color: #757575;
    }

    .signOut {
      width: 35px;
      font-size: 14px;
      color: white;
      background-color: #a52a2a;
      display: inline-block;
      border-radius: 5px;
      text-align: center;
    }
  }
}

.avatarBorder:hover {
  .avatar {
    transform: rotate(360deg);
  }

  .userCard {
    opacity: 1;
    transform: translateX(0) translateY(-50%);
  }
}


</style>
