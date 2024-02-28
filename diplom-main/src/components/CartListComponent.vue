<script setup>
import CartComponent from './CartComponent.vue';
import { computed, onMounted, ref } from 'vue';
import * as api from '../services/apartments'

const cards = ref([])

onMounted(async () => {
    const apartmentsResponse = await api.getAllApartments()
    console.log(apartmentsResponse)
    cards.value = apartmentsResponse

});

const props = defineProps({
    sortValue: {
        type: String,
        default: ''
    },
    searchValue: {
        type: String,
        default: ''
    },
    sortRooms: {
        type: Number,
        default: ''
    }
})


const sortedCards = computed(() => {
    return cards.value.sort((a, b) => props.sortValue === 'max' ? b.price - a.price : a.price - b.price).filter((card) => {
        return (card.city.toLowerCase().includes(props.searchValue.toLowerCase()) || card.street.toLowerCase().includes(props.searchValue.toLowerCase())) &&
            (card.rooms_count === parseInt(props.sortRooms) || card.rooms_count.toString().includes(props.sortRooms))
    })
})


</script>

<template>
        <div id="element" class="carts">
            <CartComponent v-for="card in sortedCards" :key="card._id" :rooms_count="card.rooms_count" :square="card.square"
                :city="card.city" :street="card.street" :house_number="card.house_number" :description="card.description"
                :price="card.price" :phone="card.phone" :apartmentId="card._id" />
        </div>
</template>

<style scoped>
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
</style>