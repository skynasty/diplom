<script setup>
import CartListComponent from '@/components/CartListComponent.vue';
import { ref, onMounted, onUnmounted, computed, watch, } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore()
const sortValue = ref('')
const searchValue = ref('')
const sortRooms = ref('')
const user = computed(() => {
    return userStore.user
})
onMounted(() => {
    document.documentElement.style.overflow = "hidden";
})

onUnmounted(() => {
    document.documentElement.style.overflow = "auto";
})





</script>


<template>
    <div class="main">
        <div class="container">
            <h1>Найти помещение просто!</h1>
            <div class="filters">
                <select v-model="sortValue">
                    <option selected value="">По цене</option>
                    <option value="min">Сначала дешевые</option>
                    <option value="max">Сначала дорогие</option>
                </select>
                <div class="rooms">
                    <input v-model="sortRooms" type="number" placeholder="1, 2... комнт.">
                </div>
                <div class="search">
                    <input v-model="searchValue" type="text" placeholder="Поиск...">
                </div>
                <button v-if="user?.role === 'admin'" class="add-apartment">Добавить помещение</button>
            </div>

            <CartListComponent :sortValue="sortValue" :searchValue="searchValue" :sortRooms="sortRooms" />
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0px;

}


.main {
    background: linear-gradient(#af9fff, #6346f5);
    height: 100vh;
    overflow: hidden;
}

.container {
    margin-left: 15%;
    margin-right: 15%;
    font-family: "Gilroy-Regular";

}

h1 {
    margin-top: 10px;
    color: #fff;
    padding-bottom: 30px;
    font-size: 40px;
}

.filters {
    display: flex;

}

select {
    margin-right: 30px;
    padding-left: 10px;
    width: 220px;
    height: 40px;
    font-size: 20px;
    border-radius: 5px;
    border: solid 0.5px #00000049;
    background: rgb(250, 250, 250);
}

.search input {
    background-size: 20px;
    background-position: 8px;
    background-image: url(../components/icons/search.svg);
    background-repeat: no-repeat;
    padding-left: 35px;
    width: 250px;
    height: 36px;
    border-radius: 5px;
    border: solid 0.5px #00000049;
    font-size: 20px;
}

.icon-search {
    margin-left: 30px;
    margin-top: 10px;
    position: absolute;
    width: 18px;

}

.rooms input {
    background-size: 20px;
    background-position: 8px;
    background-repeat: no-repeat;
    padding-left: 5px;
    width: 130px;
    height: 36px;
    border-radius: 5px;
    border: solid 0.5px #00000049;
    font-size: 20px;
    margin-right: 30px;
}

.add-apartment {
    font-size: 20px;
    margin-bottom: 40px;
    margin-left: 230px;
    width: 350px;
    height: 40px;
    padding: 8px 20px 7px;
    border-radius: 5px;
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
    border: none;
    transition: transform 1s;
}

.add-apartment:hover {
    background-color: #450d75;
    cursor: pointer;
    transform: scale(1.02);
    box-shadow: 0 0 15px #0000008a;
    transition: 0.4s;
}
</style>
