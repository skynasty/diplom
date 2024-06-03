<script>
import { RouterLink, RouterView } from "vue-router";
import { useUserStore } from "../store/user";
import { useAuthStore } from "../store/auth";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      errors: [],
      registerData: {
        email: "",
        fullName: "",
        password: "",
      },
      loginData: {
        email: "",
        password: "",
      },
    };
  },
  watch: {
    isOpenAuth() {
      this.errors = []
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
      authStore: useAuthStore(),
    };
  },
  computed: {
    user() {
      return this.userStore.user;
    },
    isOpenAuth() {
      return this.$route.query.login;
    },
    isOpenReg() {
      return this.$route.query.register;
    },
    emailInputStyle() {
      console.log(this.errors)
      if(this.errors.includes('Неверный формат почты') || this.errors.includes('Пользователь не найден') || this.errors.includes('Пользователь уже существует')) {
        return 'border: 1.5px solid red;'
      }
      return ''
    },
    passwordInputStyle() {
      if(this.errors.includes('Пароль должен быть минимум 6 символов')) {
        return 'border: 1.5px solid red;'
      }
      return ''
    },
    nameInputStyle() {
      if(this.errors.includes('Укажите имя')) {
        return 'border: 1.5px solid red;'
      }
      return ''
    }
  },
  methods: {
    openAuthModal() {
      this.$router.replace({
        query: {
          login: 1,
        },
      });
    },
    openRegModal() {
      this.$router.replace({
        query: {
          register: 1,
        },
      });
    },
    closeAuthModal() {
      this.$router.replace({
        name: this.$route.name,
      });
      this.errors = []
    },
    async onRegister() {
      try {
        await this.authStore.onRegister(this.registerData);
      } catch (error) {
        console.log(typeof error.response.data);
        if(!error.response.data.msg) {
          this.errors = [...error.response.data].map((item) => item.msg)
        } else {
          this.errors = [error.response.data.msg]
        }
        return Promise.reject(error)
      }
      
      this.closeAuthModal();
      ElMessage({
        showClose: true,
        message: "Пользователь успешно зарегистрирован",
        type: "success",
      });
    },
    async onLogin() {
      try {
        await this.authStore.onLogin(this.loginData);
      } catch (error) {
        console.log(typeof error.response.data);
        if(!error.response.data.msg) {
          this.errors = [...error.response.data].map((item) => item.msg)
        } else {
          this.errors = [error.response.data.msg]
        }
        return Promise.reject(error)
      }
      await this.userStore.getMe();
      this.closeAuthModal();
      ElMessage({
        showClose: true,
        message: "Авторизация прошла успешно",
        type: "success",
      });
    },
    logout() {
      this.authStore.logout();
      this.$router.push("/");
    },
  },
};
</script>

<template>
  <!-- шапка -->
  <div class="root" style="position: sticky; top: 0">
    <header class="header">
      <nav class="nav">
        <router-link to="/"
          ><a href="#"
            ><img
              class="logo"
              src="../components/icons/pngtree-vector-pulse-rate-icon-png-image_857114.jpg"
              alt="logo"
              height="70px"
              style="
                pointer-events: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
              " /></a
        ></router-link>
        <ul>
          <router-link to="/">
            <li><a href="" class="katalog">Главная</a></li>
          </router-link>
          <router-link to="/favourites">
            <li><a href="" class="katalog">Избранное</a></li>
          </router-link>
          <!-- <li><a href="#about" class="katalog">О нас</a></li> -->
          <router-link to="/contacts">
            <li><a href="" class="katalog">Контакты</a></li>
          </router-link>
          <li><a href="" class="katalog">|</a></li>
          <li>
            <a class="katalog" @click="openAuthModal" v-if="!user"
              >Авторизация</a
            >
          </li>
          <li>
            <a class="katalog" @click="openRegModal" v-if="!user"
              >Регистрация</a
            >
          </li>
          <router-link to="/profile">
            <li>
              <a href="" class="katalog" v-if="user">
                Привет, {{ user?.fullName }}
                <img
                  class="strelka"
                  src="./icons/strelka.png"
                  alt="photo"
                  width="25px"
              /></a>
            </li>
          </router-link>
          <li><a class="katalog" @click="logout()" v-if="user">Выход</a></li>
        </ul>
      </nav>
    </header>

    <!-- auth -->
    <teleport to="body">
      <div
        class="modal"
        v-if="isOpenAuth"
        @wheel.prevent
        @touchmove.prevent
        @scroll.prevent
        @mousedown="closeAuthModal"
      >
        <div class="modal-content" @mousedown.stop>
          <h2>Авторизация</h2>
          <label>Электронная почта</label>
          <input type="email" v-model="loginData.email" :style="emailInputStyle"/>
          <label>Пароль</label>
          <input type="password" v-model="loginData.password" :style="passwordInputStyle"/>
          <div v-for="error in errors" :key="error">
            <p style="color: red;">{{ error }}</p>
          </div>
          <button class="exit-button" @click="onLogin">Войти</button>
          <p style="text-align: center; margin-top: 20px;">Нет аккаунта? <a @click="openRegModal">Зарегистрируйтесь</a></p>
        </div>
      </div>
    </teleport>

    <!-- register -->

    <teleport to="body">
      <div
        class="modal2"
        v-if="isOpenReg"
        @wheel.prevent
        @touchmove.prevent
        @scroll.prevent
        @mousedown="closeAuthModal"
      >
        <div class="modal-content" @mousedown.stop>
          <h2>Регистрация</h2>
          <label>Электронная почта</label>
          <input type="email" v-model="registerData.email" :style="emailInputStyle"/>
          <label>Имя пользователя</label>
          <input type="text" v-model="registerData.fullName" :style="nameInputStyle"/>
          <label>Пароль</label>
          <input type="password" v-model="registerData.password" :style="passwordInputStyle"/>
          <div v-for="error in errors" :key="error">
            <p style="color: red;">{{ error }}</p>
          </div>
          <button class="exit-button" @click="onRegister">
            Зарегистрироваться
          </button>
          <p style="text-align: center; margin-top: 20px;">Есть аккаунт? <a @click="openAuthModal">Авторизуйтесь</a></p>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
@font-face {
  font-family: "Gilroy-Regular";
  src: url(../assets/fonts/Gilroy-Regular.ttf);
}

body {
  font-family: "Gilroy-Regular";
}

* {
  padding: 0;
  margin: 0;
  font-family: "Gilroy-Regular";
}

.nav {
  align-items: center;
  display: flex;
  justify-content: space-between;
  /* position: fixed; */
  background-color: #000;
  width: 100%;
  left: 0;
}

ul li {
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  display: inline-block;
  justify-content: space-between;
  margin-right: 30px;
}

ul li {
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  display: inline-block;
  justify-content: space-between;
  margin-right: 30px;
}

a {
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

.button1 {
  padding: 10px 15px 10px 15px;
  border-radius: 15px;
  background-color: #fff;
  color: #000;
}

.button1:hover {
  background-color: #af9fff;
  color: #fff;
  transform: scale(1.1);
  transition: 0.5s;
}

a:hover {
  /* color: #af9fff; */
  transition: 0.3s;
}

li {
  position: relative;
  cursor: pointer;
  line-height: 1;
  text-decoration: none;
}

li:after {
  display: block;
  position: absolute;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ffffff;
  content: "";
  transition: width 0.3s ease-out;
}

li:focus:after,
li:hover:after {
  width: 100%;
}

.auth-dude {
  color: #af9fff;
  transition: 0.3s;
}

.logo {
  padding-left: 60px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #000;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  font-size: 17px;
}

.dropdown-content a {
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #6d6d6d;
}

.katalog1:hover .dropdown-content {
  display: block;
  color: #af9fff;
  transition: 0.3s;
}

.feather feather-user-check {
  align-items: center;
}

.katalog {
  align-items: center;
  text-align: center;
  display: flex;
}

/* modal */

.modal {
  background-color: #00000038;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal > div {
  background-color: #fff;
  padding: 60px 60px 30px 60px;
  border-radius: 10px;
}

.modal-content input {
  margin-top: 5px;
  display: flex;
  margin-bottom: 15px;
  width: 340px;
  height: 50px;
  border-radius: 7px;
  border: none;
  background-color: #ebebeb;
  font-size: 25px;
  padding-left: 15px;
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 40px;
}

.modal-content .exit-button {
  width: 355px;
  height: 50px;
  color: #fff;
  font-weight: bold;
  background-color: #202020;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  margin-top: 15px;
}

label {
  font-weight: bold;
}

.modal-content .exit-button:hover {
  background-color: #414141;
  color: #ffffff;
  transition: 0.5s;
}


.auth-reg p {
  margin-top: 40px;
  text-align: center;
}



.modal-content a {
  text-decoration: none;
  color: #000;
  text-decoration: underline;
}

.modal2 {
  background-color: #00000038;
  backdrop-filter: blur(5px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal2 > div {
  background-color: #fff;
  padding: 60px 60px 30px 60px;
  border-radius: 10px;
}

.strelka {
  color: #fff;
}
</style>
