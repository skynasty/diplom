<script setup>
import { isAuthenticated } from '@/helpers/functions';
import { computed, watch, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useApplicationStore } from '@/store/application'



const props = defineProps({
    rooms_count: Number,
    square: Number,
    city: String,
    street: String,
    house_number: Number,
    description: String,
    price: Number,
    phone: String,
    apartmentId: Number,

})

const finalCost = computed(() => {
    const dateBegin = new Date(applicationData.dateBegin);
    const dateEnd = new Date(applicationData.dateEnd);
    const differenceMs = dateEnd.getTime() - dateBegin.getTime();
    const differenceDays = differenceMs / (1000 * 3600 * 24);
    const result = differenceDays * props.price
    return result && result > 0 ? result : 0
})
const applicationData = reactive({

})
const applicationStore = useApplicationStore()
const router = useRouter()
const userStore = useUserStore()
const isOpenApplication = ref(false)
const openApplicationModal = () => {
    isOpenApplication.value = true
}

const openAuthModal = () => {
    router.replace({
        query: {
            login: 1
        }
    })
}
const clickReserve = () => {
    if (!userStore.user) {
        openAuthModal()
        return
    }
    openApplicationModal()
}

const clickFavourite = () => {
    if (!userStore.user) {
        openAuthModal()
    }
}

const onCreateApplication = async () => {
    const data = {
        dateBegin: new Date(applicationData.dateBegin).setHours(0),
        dateEnd: new Date(applicationData.dateEnd).setHours(0),
        phone: applicationData.phone,
        cost: finalCost.value,
        apartmentId: props.apartmentId
    }
    await applicationStore.createApplication(data)
    closeApplicationModal()
}

const closeApplicationModal = () => {
    isOpenApplication.value = false
}
</script>

<template>
    <div class="cart-container">
        <div class="blocks">
            <div class="first-block">
                <img src="../components/icons/kv1-1.jpg" alt="Photo" />
            </div>
            <div class="second-block">
                <h3>{{ props.rooms_count }} -комнт. квартира, {{ props.square }} м²</h3>
                <h5>{{ props.city }}, {{ props.street }}, {{ props.house_number }} </h5>
                <p>{{ props.description }}</p>
                <div class="bottom-function">
                    <a href="tel: 89155394351"><button class="tel">{{ props.phone }}</button></a>
                    <button @click="clickReserve" class="reservation-button">Забронировать</button>
                </div>
            </div>

            <div class="third-block">
                <h3>{{ props.price }} ₽/день</h3>
                <button @click="clickFavourite"> В избранное</button>
            </div>
        </div>
    </div>

    <teleport to='body'>
        <div class="modal" v-if="isOpenApplication" @wheel.prevent @touchmove.prevent @scroll.prevent
            @click="closeApplicationModal">
            <div class="modal-content" @click.stop>
                <h2>Бронирование</h2>
                <label>Дата заезда</label>
                <input type="date" v-model="applicationData.dateBegin">
                <label>Дата выезда</label>
                <input type="date" v-model="applicationData.dateEnd">
                <label>Телефон</label>
                <input type="tel" v-model="applicationData.phone">
                <p>Стоимость: {{ finalCost }}, ₽ </p>
                <button class="exit-button" @click="onCreateApplication">Забронировать</button>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.cart-container {
    margin-top: 30px;
    width: 100%;
    background-color: #fff;
    height: 390px;
    border-radius: 15px;
    transition: transform 1s;
}

.cart-container:hover {
    cursor: pointer;
    transform: scale(0.98);
    box-shadow: 0 0 15px #0000008a;
    transition: 0.7s;
}

.blocks {
    display: flex;
}

.first-block img {
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 10px;
    width: 40%;
    width: 350px;
}

.second-block {
    margin-left: 25px;
    margin-top: 20px;
    width: 42%;
}

.second-block h3 {
    margin: 0;
    font-size: 30px;
    margin-bottom: 20px;

}

.second-block h5 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 20px;
}

.second-block p {
    font-size: 19px;
    margin-bottom: 20px;
    color: #807f7f;
}

.bottom-function {
    margin-top: 40px;
}

.tel {
    border-radius: 5px;
    border: none;
    font-size: 17px;
    width: 200px;
    height: 45px;
    background-color: #55b349;
    color: #fff;
    font-weight: 600;
}

.tel:hover {
    cursor: pointer;
    background-color: #448b3a;
    transition: 0.7s;
}

.reservation-button {
    border-radius: 5px;
    border: solid 1px #00000049;
    font-size: 17px;
    margin-left: 10px;
    width: 250px;
    height: 45px;
    font-weight: 600;
}

.reservation-button:hover {
    cursor: pointer;
    background-color: #cecece;
    transition: 0.7s;
}

.third-block {
    margin-left: 30px;
    margin-top: 20px;
    width: 23%;
}

.third-block h3 {
    margin: 0;
    font-size: 35px;

}

.third-block button {
    align-items: center;
    background-size: 20px;
    background-position: 35px;
    background-repeat: no-repeat;
    background-image: url(../components/icons/like.svg);
    background-color: #af9fff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 17px;
    width: 250px;
    height: 40px;
    font-weight: 600;
    margin-top: 10px;

}

.third-block button:hover {
    cursor: pointer;
    background-color: #9985fa;
    transition: 0.6s;

}

/* modal */

.modal {
    background-color: #000000c4;
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
    text-align: center;
}
</style>