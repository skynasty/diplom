<script setup>
import { RouterLink, RouterView } from "vue-router";
import HomeView from './views/HomeView.vue'
import { onMounted, computed, watch } from "vue";
import * as api from './services/auth'
import { useUserStore } from './store/user'
import { isAuthenticated } from './helpers/functions'
import { useApplicationStore } from "./store/application";

const applicationStore = useApplicationStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)
onMounted(async () => {
    if (isAuthenticated()) {
        await userStore.getMe()
        loadData()
    }

});
watch(user, () => {
    loadData()
})
const loadData = async () => {
    user.value.role === 'admin' ? await applicationStore.getAllApplications() :
        await applicationStore.getMyApplications()
}

</script>

<template>
    <HomeView><router-view /></HomeView>
</template>

<style scoped></style>
