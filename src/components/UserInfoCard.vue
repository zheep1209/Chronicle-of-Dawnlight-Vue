<script setup>
import {ref,watch} from "vue";
const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});
const style = ref(computeStyle(props.userData));
function computeStyle(userData) {
  return userData.role === 1 ? "background-color: #2c006b" :
      (userData.role === 2 ? "background-color: #5ec069" :
          (userData.role === 3 ? "background-color: #817e00" : "background:#ff7089"));
}
watch(() => props.userData, (newUserData) => {
  style.value = computeStyle(newUserData);
}, { deep: true });
</script>

<template>
  <div class="avatarBorder">
    <img :src="props.userData.avatar" alt="" class="avatar">
    <div class="userCard">
      <div class="info">
        <div class="header">
          <div class="name">{{ props.userData.username }}</div>
          <div :style="style" class="role">
            {{
              props.userData.role === 1 ? "开发者" :
                  (props.userData.role === 2 ? "管理员" :
                      (props.userData.role === 3 ? "会　员" : "用　户"))
            }}
          </div>
        </div>
        <div class="email">{{ props.userData.email }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatarBorder {
  width: 75px;
  border-radius: 50%;
  z-index: 2;
  position: relative;
  box-sizing: border-box;
  .avatar {
    box-shadow: #a7a7a7 0 0 10px 1px;
    width:75px;
    border-radius: 50%;
    transition: transform 0.5s ease;
  }
}
.userCard {
  background-color: #fff;
  transition: 0.3s;
  z-index: -1;
  opacity: 0;
  transform: translateX(20%);
  position: absolute;
  top: -17px;
  left: -160px;
  max-width: 13em;
  padding: 10px;
  margin: 15px 15px 15px 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  box-shadow: #b9b9b9 5px 0 10px 1px;
  border-radius: 10px;
  .info {
    padding-right: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
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
  }
}
.avatarBorder:hover {
  .avatar{
    transform: rotate(360deg);
  }
  .userCard{
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
