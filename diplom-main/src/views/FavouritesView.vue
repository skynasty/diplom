<script setup>
import { useUserStore } from '@/store/user';
import { ref, onMounted, onUnmounted, computed, watch, } from 'vue';
import { useApartmentsStore } from '@/store/apartments';
import CartComponent from '@/components/CartComponent.vue';

const apartmentsStore = useApartmentsStore()

const userStore = useUserStore()
const favouriteApartments = computed(() => {
    const apartments = apartmentsStore.apartments
    const favourites = userStore.favourite
    const result = favourites.map((fav) => {
        return {
            apartment: apartments.find((ap) => ap._id === fav.apartment),
            favouriteId: fav._id
        }
    })
    return result
})

onMounted(() => {
    document.documentElement.style.overflow = "hidden";
})

onUnmounted(() => {
    document.documentElement.style.overflow = "auto";
})

</script>

<template>
    <div class="container">
        <h2 v-if="!userStore.user">Чтобы увидеть свои избранные объявления - авторизуйтесь</h2>
        <h2 v-if="userStore.user">Ваши избранные объявления</h2>
       
        <div v-if="favouriteApartments.length" id="element" class="carts">
            <CartComponent v-for="card in favouriteApartments" :key="card.favouriteId" :card="card.apartment" :favouriteId="card.favouriteId"/>
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

.carts {
    margin-top: 20px;
    padding: 0px 50px 45px 0px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    overflow-x: hidden;
    height: 650px;

}


#element::-webkit-scrollbar {
    width: 10px;
}

#element::-webkit-scrollbar-track {
    -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset;
    background-color: #f9f9fd;
    border-radius: 10px;
}

#element::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: linear-gradient(180deg, #000000, #000000);
}

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
</style>