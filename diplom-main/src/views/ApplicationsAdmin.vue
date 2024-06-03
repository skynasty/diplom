<script setup>
import { useApplicationStore } from '@/store/application';
import { useUserStore } from '@/store/user';
import { computed, watch, onMounted } from 'vue'

const userStore = useUserStore()
const applicationStore = useApplicationStore()
const user = computed(() => {
    return userStore.user
})
const applications = computed(() => {
    return applicationStore.applications
})
const avatarUrl = computed(() => {
    return `http://localhost:3001${user?.value?.avatarUrl}`
})

</script>

<template>
    <div v-if="user?.role === 'admin'">
        <div class="container">
            <h2>Заявки пользователей</h2>
            <div class="applications" v-for="application in applications">
                <img :src="`http://localhost:3001${application.user.avatarUrl}`" alt="" width="100px" height="100px"
                    style="border-radius: 10%; object-fit: cover; pointer-events: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;">
                <table>
                    <thead>
                        <tr>
                            <th>Номер заявки:</th>
                            <th>Имя пользователя:</th>
                            <th>Телефон:</th>
                            <th>Дата заезда:</th>
                            <th>Дата выезда:</th>
                            <th>Стоимость:</th>
                            <th>Дата создания заявки:</th>
                            <th>Статус заявки:</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#{{ application._id }}</td>
                            <td>{{ application.user.fullName }}</td>
                            <td>{{ application.phone }}</td>
                            <td>{{ new Date(application.dateBegin).toLocaleString() }}</td>
                            <td>{{ new Date(application.dateEnd).toLocaleString() }}</td>
                            <td>{{ application.cost }}, ₽</td>
                            <td>{{ new Date(application.createdAt).toLocaleString() }}</td>
                            <td>{{ application.status }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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

/* заявки */

.your-applications {
    margin-top: 50px;
}

.your-applications h2 {
    font-size: 30px;
}



.applications {
    display: flex;
    border-radius: 15px;
    padding: 40px;
    margin-bottom: 40px;
    border: 2px inset rgb(104, 0, 240);
}

th {
    font-size: 20px;
}

td {
    font-size: 20px;
    text-align: center;
}
</style>