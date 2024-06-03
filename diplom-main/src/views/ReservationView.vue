<script setup>
import CartListComponent from '@/components/CartListComponent.vue';
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { useApartmentsStore } from "@/store/apartments";
import { vMaska } from "maska"

const userStore = useUserStore()
const sortValue = ref('')
const apartmentData = reactive({});
const apartmentsStore = useApartmentsStore();
const searchValue = ref('')
const isOpenCreateApartment = ref(false);
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

const uploadApartmentImage = async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    const fileUrl = await userStore.uploadFile(formData)
    apartmentData.imageUrl = fileUrl
}
const onCreateApartment = async () => {
    await apartmentsStore.createApartment(apartmentData);
    isOpenCreateApartment.value = false;
};




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
                <button v-if="user?.role === 'admin'" class="add-apartment"
                    @click="isOpenCreateApartment = true">Добавить помещение</button>
            </div>

            <CartListComponent :sortValue="sortValue" :searchValue="searchValue" :sortRooms="String(sortRooms)" />
        </div>
    </div>
    <teleport to="body">
        <div class="modal" v-if="isOpenCreateApartment" @wheel.prevent @touchmove.prevent @scroll.prevent
            @mousedown="isOpenCreateApartment = false">
            <div class="modal-content" @mousedown.stop>
                <h2>Добавление помещения</h2>
                <div style="display: flex; gap: 20px;">
                    <div>
                        <label>Город</label>
                        <input type="text" v-model="apartmentData.city" />
                        <label>Улица</label>
                        <input type="text" v-model="apartmentData.street" />
                        <label>Номер дома</label>
                        <input type="text" v-model="apartmentData.house_number" />
                        <label>Количество комнат</label>
                        <input type="number" v-model="apartmentData.rooms_count" />
                    </div>
                    <div>
                        <label>Площадь</label>
                        <input type="number" v-model="apartmentData.square" />
                        <label>Стоимость за сутки</label>
                        <input type="number" v-model="apartmentData.price" />
                        <label>Телефон</label>
                        <input v-maska data-maska="+7(###)-###-##-##" placeholder="+7(999)-999-99-99" type="tel"
                            v-model="apartmentData.phone" />
                        <label>Изображение</label>
                        <input type="file" @change="uploadApartmentImage($event)" />
                    </div>
                </div>
                <div style="width: 100%; display: flex; flex-direction:column; gap:10px; margin-bottom: 20px;">
                    <label>Описание</label>
                    <textarea type="text" v-model="apartmentData.description" />
                </div>
                <div style="display: flex; justify-content: center; width: 100%;">
                    <button class="exit-button" @click="onCreateApartment">
                        Создать
                    </button>
                </div>
            </div>
        </div>
    </teleport>
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

/* modal */

.modal {
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

.modal>div {
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

.modal-content textarea {
    margin-top: 5px;
    display: flex;
    margin-bottom: 15px;
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
}

label {
    font-weight: bold;
}

.modal-content .exit-button:hover {
    background-color: #414141;
    color: #ffffff;
    transition: 0.5s;
}

p {
    margin-top: 40px;
}
</style>
