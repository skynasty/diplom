<script setup>
import { RouterLink, RouterView } from "vue-router";
import HomeView from "./views/HomeView.vue";
import { onMounted, computed, watch } from "vue";
import * as api from "./services/auth";
import { useUserStore } from "./store/user";
import { isAuthenticated } from "./helpers/functions";
import { useApplicationStore } from "./store/application";
import { useApartmentsStore } from "./store/apartments";

const applicationStore = useApplicationStore();
const apartmentsStore = useApartmentsStore();
const userStore = useUserStore();
const user = computed(() => userStore.user);
onMounted(async () => {
  if (isAuthenticated()) {
    await userStore.getMe();
    loadData();
  }
  await apartmentsStore.getAllApartments();
});
watch(user, async () => {
  await apartmentsStore.getAllApartments();
  loadData();
});
const loadData = async () => {
  if (user.value) {
    user.value.role === "admin"
      ? await applicationStore.getAllApplications()
      : await applicationStore.getMyApplications();
  await userStore.getMyFavourites();
  await userStore.getAllUsers();
  }
  userStore.changeLoadStatus(true);

};
</script>

<template>
  <HomeView><router-view /></HomeView>
</template>

<style scoped></style>
