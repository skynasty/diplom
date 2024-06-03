import { defineStore, getActivePinia } from "pinia";
import * as api from "../services/auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("authStore", {
  actions: {
    async onRegister(data) {
      await api.register(data);
    },
    async onLogin(data) {
      await api.login(data);
    },
    logout() {
      localStorage.removeItem("accessToken");
      getActivePinia()._s.forEach((store) => store.$reset());
    },
  },
});
