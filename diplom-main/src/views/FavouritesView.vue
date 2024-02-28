<script setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore()
</script>

<template>
    <div class="container">
        <h2 v-if="!userStore.user">Чтобы увидеть свои избранные объявления - авторизуйтесь</h2>
        <h2 v-if="userStore.user">Ваши избранные объявления</h2>
    </div>
</template>

<style scoped>
.container {
    margin: 3% 10% 3% 10%;
    background-color: #e2e2e2;
    border-radius: 20px;
    padding: 20px 40px 20px 40px;
}

h2 {
    font-size: 30px;
}
</style>