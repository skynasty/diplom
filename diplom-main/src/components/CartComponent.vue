<script setup>
import { isAuthenticated } from "@/helpers/functions";
import { computed, watch, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { useApplicationStore } from "@/store/application";
import { useApartmentsStore } from "@/store/apartments";
import FavouritesView from "@/views/FavouritesView.vue";
import ReservationView from "@/views/ReservationView.vue";
import { ElMessage } from "element-plus";
import { vMaska } from "maska"

const props = defineProps({
  card: {
    type: Object,
    default: null,
  },
  favouriteId: {
    type: String,
    default: null,
  },
});

const finalCost = computed(() => {
  const dateBegin = new Date(applicationData.dateBegin);
  const dateEnd = new Date(applicationData.dateEnd);
  const differenceMs = dateEnd.getTime() - dateBegin.getTime();
  const differenceDays = differenceMs / (1000 * 3600 * 24);
  const result = differenceDays * props.card.price;
  return result && result > 0 ? result : 0;
});
const applicationData = reactive({});
const apartmentData = reactive({});
const applicationStore = useApplicationStore();
const apartmentsStore = useApartmentsStore();
const router = useRouter();
const userStore = useUserStore();
const isOpenApplication = ref(false);
const isOpenUpdateApartment = ref(false);
const openApplicationModal = () => {
  isOpenApplication.value = true;
};
const user = computed(() => {
  return userStore.user
})
const clickUpdateApartment = () => {
  isOpenUpdateApartment.value = true
  apartmentData._id = props.card._id
  apartmentData.city = props.card.city
  apartmentData.street = props.card.street
  apartmentData.square = props.card.square
  apartmentData.house_number = props.card.house_number
  apartmentData.phone = props.card.phone
  apartmentData.price = props.card.price
  apartmentData.description = props.card.description
  apartmentData.rooms_count = props.card.rooms_count
  apartmentData.imageUrl = props.card.imageUrl
}
const uploadApartmentImage = async (event) => {
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append("image", file)
  const fileUrl = await userStore.uploadFile(formData)
  apartmentData.imageUrl = fileUrl
}
const onUpdateApartment = async () => {
  await apartmentsStore.updateApartment(apartmentData);
  isOpenUpdateApartment.value = false;
};

const openAuthModal = () => {
  router.replace({
    query: {
      login: 1,
    },
  });
};
const clickReserve = () => {
  if (!userStore.user) {
    openAuthModal();
    return;
  }
  openApplicationModal();
};

const clickFavourite = async () => {
  if (!userStore.user) {
    openAuthModal();
  }
  await userStore.createFavourite(props.card._id);
};

const onCreateApplication = async () => {
  const data = {
    dateBegin: new Date(applicationData.dateBegin).setHours(0),
    dateEnd: new Date(applicationData.dateEnd).setHours(0),
    phone: applicationData.phone,
    cost: finalCost.value,
    apartmentId: props.card._id,
  };
  await applicationStore.createApplication(data);
  closeApplicationModal();
};



const closeApplicationModal = () => {
  isOpenApplication.value = false;
};

const deleteFavourite = async () => {
  const favouriteId = props.favouriteId;
  await userStore.deleteFavourite(favouriteId);
  ElMessage({
    showClose: true,
    message: "Объявление удалено из избранных",
    type: "success",
  });
};

const deleteApartment = async () => {
  const id = props.card._id;
  await apartmentsStore.deleteApartment(id);
  ElMessage({
    showClose: true,
    message: "Помещение успешно удалено",
    type: "success",
  });
};
</script>

<template>
  <div v-if="props.card" class="cart-container">
    <div class="blocks">
      <div class="first-block" style="height: 350px; border-radius: 10px;">
        <img :src="`http://localhost:3001${props.card.imageUrl}`" alt="Photo" style="height:100%; object-fit:cover;" />
      </div>
      <div class="second-block">
        <h3>
          {{ props.card.rooms_count }} -комнт. квартира,
          {{ props.card.square }} м²
        </h3>
        <h5>
          {{ props.card.city }}, {{ props.card.street }},
          {{ props.card.house_number }}
        </h5>
        <p>{{ props.card.description }}</p>
        <div class="bottom-function">
          <a href="tel: 89155394351"><button class="tel">{{ props.card.phone }}</button></a>
          <button @click="clickReserve" class="reservation-button">
            Забронировать
          </button>
        </div>
      </div>

      <div class="third-block">
        <h3>{{ props.card.price }} ₽/день</h3>
        <button v-if="!favouriteId" class="third-block-button" @click="clickFavourite">
          В избранное
        </button>


        <el-popconfirm v-else width="320" confirm-button-text="Да" confirm-button-type="danger" cancel-button-text="Нет"
          @confirm="deleteFavourite" title="Вы точно хотите удалить это помещение из избранных?">
          <template #reference>
            <el-button class="delete-button" size="small" type="danger" style="width: 250px">Удалить из
              избранного</el-button>
          </template>
        </el-popconfirm>
        <button v-if="user?.role === 'admin'" class="edit-button" @click="clickUpdateApartment">
          Редактировать
        </button>
        <el-popconfirm width="320" confirm-button-text="Да" confirm-button-type="danger" cancel-button-text="Нет"
          @confirm="deleteApartment" title="Вы точно хотите удалить это помещение?">
          <template #reference>
            <el-button v-if="user?.role === 'admin'" class="delete-button" size="small" type="danger"
              style="width: 250px">Удалить
              помещение</el-button>

          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>

  <teleport to="body">
    <div class="modal" v-if="isOpenApplication" @wheel.prevent @touchmove.prevent @scroll.prevent
      @mousedown="closeApplicationModal">
      <div class="modal-content" @mousedown.stop>
        <h2>Бронирование</h2>
        <label>Дата заезда</label>
        <input type="date" v-model="applicationData.dateBegin" />
        <label>Дата выезда</label>
        <input type="date" v-model="applicationData.dateEnd" />
        <label>Телефон</label>
        <input v-maska data-maska="+7(###)-###-##-##" placeholder="+7(999)-999-99-99" type="tel"
          v-model="applicationData.phone" />
        <p>Стоимость: {{ finalCost }}, ₽</p>
        <button class="exit-button" @click="onCreateApplication">
          Забронировать
        </button>
      </div>
    </div>
  </teleport>

  <teleport to="body">
    <div class="modal" v-if="isOpenUpdateApartment" @wheel.prevent @touchmove.prevent @scroll.prevent
      @mousedown="isOpenUpdateApartment = false">
      <div class="modal-content" @mousedown.stop>
        <h2>Редактирование помещения</h2>
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
          <button class="exit-button" @click="onUpdateApartment">
            Сохранить
          </button>
        </div>
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

.third-block-button {
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

.edit-button {
  align-items: center;
  background-size: 20px;
  background-position: 35px;
  background-repeat: no-repeat;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  width: 250px;
  height: 40px;
  font-weight: 600;
  margin-top: 10px;
  background-color: lightskyblue;
}

.edit-button:hover {
  cursor: pointer;
  background-color: #4169b9;
  transition: 0.6s;
}

.third-block-button:hover {
  cursor: pointer;
  background-color: #9985fa;
  transition: 0.6s;
}

.delete-button {
  align-items: center;
  background-color: #fd6363;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 17px;
  width: 250px;
  height: 40px;
  font-weight: 600;
  margin-top: 10px;
}

.delete-button:hover {
  cursor: pointer;
  background-color: #ff0000;
  transition: 0.6s;
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
