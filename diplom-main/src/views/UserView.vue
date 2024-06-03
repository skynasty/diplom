<script setup>
import { useUserStore } from "@/store/user";
import { computed, watch, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/helpers/functions";
import { useApplicationStore } from "@/store/application";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const applicationStore = useApplicationStore();
const router = useRouter();
const user = computed(() => {
  return userStore.user;
});
const users = computed(() => {
  return userStore.users || [];
});

const applications = computed(() => {
  return applicationStore.applications;
});
const avatarUrl = computed(() => {
  return `http://localhost:3001${user?.value?.avatarUrl}`;
});
watch(user, async (val) => {
  if (!val) {
    router.push("/reserv");
  }
});
onMounted(async () => {
  if (!isAuthenticated()) {
    router.push("/reserv");
  }
});

const checkUserExisting = (userId) => {
  console.log(users.value);
  console.log(userId);
  return !!users.value.find((user) => user._id === userId);
};

const changeAvatar = async (event) => {
  console.log(event.target.files);
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append("image", file);
  console.log(formData);
  const avatarURL = await userStore.uploadFile(formData);
  console.log(avatarURL);
  const userData = {
    ...user.value,
    avatarUrl: avatarURL,
  };
  await userStore.updateMe(userData);
  console.log(userData);
};

const getButtonType = (status) => {
  if (status === "Одобрено") return "success";
  if (status === "Отклонено") return "danger";
  if (status === "В ожидании") return "info";
  return "info";
};

const changeStatus = (_id, status) => {
  applicationStore.changeStatus({ _id, status });
  ElMessage({
    showClose: true,
    message: "Статус заявки изменен",
    type: "success",
  });
};

const handleDelete = (_id) => {
  applicationStore.delete(_id);
  ElMessage({
    showClose: true,
    message: "Заявка успешно удалена",
    type: "success",
  });
};

const changePassword = async () => {
  error.value = "";
  const pass = newPassword.value;
  if (pass.length < 6) {
    error.value = "Длинна пароля должна быть не менее 6 символов!";
    return;
  }
  await userStore.changePassword(user.value._id, pass);
  showPasswordModal.value = false;
};

const newPassword = ref("");
const error = ref("");
const showPasswordModal = ref(false);

const search = ref("");
const filteredApplications = computed(() => {
  let filteredApps = applications.value.filter((app) => {
    return checkUserExisting(app.user._id);
  });
  if (search.value) {
    const keyword = search.value.toLowerCase().trim();
    filteredApps = filteredApps.filter((app) => {
      return app.user.fullName.toLowerCase().includes(keyword);
    });
  }
  return filteredApps;
});
</script>

<template>
  <div class="container">
    <h1>Личный кабинет</h1>
    <div class="blocks">
      <div class="block1">
        <img :src="avatarUrl" alt="" width="300px" height="300px" style="
            border-radius: 10%;
            object-fit: cover;
            pointer-events: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
          " />
        <div class="change-photo">
          <label for="change-photo" class="label">
            Загрузить фото
            <input class="main-change" type="file" accept=".jpg, .png, .gif" id="change-photo"
              @change="changeAvatar($event)" style="color: transparent; width: 115px" />
          </label>
        </div>
      </div>
      <div class="block2">
        <div class="block2-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 48 48">
            <path d="M0 0h48v48H0z" fill="none" />
            <g id="Shopicon">
              <path
                d="M33.843,26.914L24,36l-9.843-9.086C8.674,30.421,5,36.749,5,44h38C43,36.749,39.326,30.421,33.843,26.914z" />
              <path
                d="M24,28c3.55,0,6.729-1.55,8.926-4C34.831,21.876,36,19.078,36,16c0-6.627-5.373-12-12-12S12,9.373,12,16   c0,3.078,1.169,5.876,3.074,8C17.271,26.45,20.45,28,24,28z" />
            </g>
          </svg>
          <p><b>Имя</b></p>
        </div>
        <p style="margin-bottom: 15px">{{ user?.fullName }}</p>

        <div class="block2-inner">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="20px" height="20px" viewBox="0 -3.5 32 32"
            version="1.1">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
              <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-414.000000, -261.000000)"
                fill="#000000">
                <path
                  d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z"
                  id="mail" sketch:type="MSShapeGroup"></path>
              </g>
            </g>
          </svg>
          <p><b>Почта</b></p>
        </div>
        <p style="margin-bottom: 15px">{{ user?.email }}</p>

        <div class="block2-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="23px" height="23px" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10M20 10V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V10M20 10H4M8 3V7M16 3V7"
              stroke="#000000" stroke-width="2" stroke-linecap="round" />
            <rect x="6" y="12" width="3" height="3" rx="0.5" fill="#000000" />
            <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="#000000" />
            <rect x="15" y="12" width="3" height="3" rx="0.5" fill="#000000" />
          </svg>
          <p><b>Дата создания</b></p>
        </div>
        <p style="margin-bottom: 15px">
          {{ new Date(user?.createdAt).toLocaleString() }}
        </p>

        <div class="block2-inner">
          <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512"
            xml:space="preserve">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M213.3,384c0-87,65.2-158.7,149.3-169.2c0-0.9,0-1.5,0-1.5c5.5-8,21.3-21.3,21.3-42.7s-21.3-42.7-21.3-53.3 C362.7,32,319.2,0,256,0c-60.5,0-106.7,32-106.7,117.3c0,10.7-21.3,32-21.3,53.3s15.2,35.4,21.3,42.7c0,0,0,21.3,10.7,53.3 c0,10.7,21.3,21.3,32,32c0,10.7,0,21.3-10.7,42.7L64,362.7C21.3,373.3,0,448,0,512h271.4C235.9,480.7,213.3,435,213.3,384z M384,256 c-70.7,0-128,57.3-128,128s57.3,128,128,128s128-57.3,128-128S454.7,256,384,256z M469.3,405.3h-64v64h-42.7v-64h-64v-42.7h64v-64 h42.7v64h64V405.3z">
              </path>
            </g>
          </svg>
          <p><b>Роль</b></p>
        </div>
        <p style="margin-bottom: 15px">
          {{ user?.role === "admin" ? "Администратор" : "Пользователь" }}
        </p>
      </div>
      <div class="block3">
        <div v-if="user?.role === 'admin'" class="admin-button">
          <router-link to="/users-list"><button>Пользователи</button></router-link>
          <router-link to="/reserv"><button>Помещения</button></router-link>
        </div>
        <div v-if="user?.role === 'user'" class="user-button">
          <router-link to="/favourites"><button>Избранное</button></router-link>
        </div>
        <div class="button-change">
          <button @click="showPasswordModal = true">Сменить пароль</button>
        </div>
      </div>
    </div>
    <div class="your-applications">
      <h2 v-if="user?.role === 'user'">Ваши заявки</h2>
    </div>

    <el-table :data="filteredApplications" style="width: 100%; border-radius: 10px">
      <el-table-column label="Номер заявки"><template #default="{ row }">
          <el-popover placement="top-start" title="Номер заявки" :width="200" trigger="hover" :content="row._id">
            <template #reference>
              <el-button class="m-2">Показать</el-button>
            </template>
          </el-popover>
        </template></el-table-column>

      <el-table-column label="Имя пользователя"><template #default="{ row }">
          <div style="display: flex; gap: 7px; align-items: center">
            <img :src="`http://localhost:3001${row.user._id === user._id ? user.avatarUrl : row.user.avatarUrl
              }`" alt="" width="30px" height="30px" style="
                border-radius: 50%;
                object-fit: cover;
                pointer-events: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
              " /><span>{{ row.user.fullName }}</span>
          </div>
        </template></el-table-column>
      <el-table-column label="Номер помещения"><template #default="{ row }">
          <el-popover placement="top-start" title="Номер помещения" :width="200" trigger="hover"
            :content="row.apartment">
            <template #reference>
              <el-button class="m-2">Показать</el-button>
            </template>
          </el-popover>
        </template></el-table-column>
      <el-table-column label="Телефон" prop="phone" />
      <el-table-column label="Дата заезда"><template #default="{ row }">{{
        new Date(row.dateBegin).toLocaleString()
      }}</template></el-table-column>
      <el-table-column label="Дата выезда"><template #default="{ row }">{{
        new Date(row.dateEnd).toLocaleString()
      }}</template></el-table-column>
      <el-table-column label="Стоимость, ₽" prop="cost" />
      <el-table-column label="Дата создания заявки"><template #default="{ row }">{{
        new Date(row.createdAt).toLocaleString()
      }}</template></el-table-column>
      <el-table-column label="Статус заявки"><template #default="{ row }">
          <el-dropdown :disabled="user.role !== 'admin'" trigger="click" placement="bottom">
            <el-button size="small" :type="getButtonType(row.status)">
              <div class="w-[100px]">
                {{ row.status }}
              </div>
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeStatus(row._id, 'Одобрено')" :disabled="row.status === 'Одобрено'">
                  Одобрена
                </el-dropdown-item>
                <el-dropdown-item @click="changeStatus(row._id, 'В ожидании')" :disabled="row.status === 'В ожидании'">
                  Ожидание
                </el-dropdown-item>
                <el-dropdown-item @click="changeStatus(row._id, 'Отклонено')" :disabled="row.status === 'Отклонено'">
                  Отменена
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template></el-table-column>

      <el-table-column align="left">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Поиск..." />
        </template>
        <template #default="{ row }">
          <el-popconfirm width="260" confirm-button-text="Да" confirm-button-type="danger" cancel-button-text="Нет"
            @confirm="handleDelete(row._id)" title="Вы точно хотите удалить заявку?">
            <template #reference>
              <el-button size="small" type="danger" style="width: 100%">Удалить</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div></div>
  </div>
  <teleport to="body">
    <div class="modal" v-if="showPasswordModal" @wheel.prevent @touchmove.prevent @scroll.prevent
      @mousedown="showPasswordModal = false">
      <div class="modal-content" @mousedown.stop>
        <h2>Смена пароля</h2>
        <label>Новый пароль</label>
        <input type="password" v-model="newPassword" autocomplete="off" />
        <p v-if="error.length" style="color: red; font-size: 15px; margin-top: 15px">
          {{ error }}
        </p>
        <button class="exit-button" @click="changePassword()">
          Подтвердить
        </button>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.container {
  margin: 3% 10% 3% 10%;
  background-color: #e2e2e2;
  border-radius: 20px;
  padding: 20px 40px 20px 40px;
  box-shadow: 0 0 15px #00000065;
}

h1 {
  margin-bottom: 40px;
  text-align: center;
  font-size: 45px;
  font-weight: bold;
}

.blocks {
  justify-content: center;
  display: flex;
}

.block1 {
  margin-right: 2%;
}

.change-photo {
  margin-top: 15px;
  text-align: center;
}

p {
  font-size: 30px;
}

input {
  color: aqua;
}

.label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 260px;
  height: 42px;
  margin: 11px 0 0;
  padding: 8px 20px 7px;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  background-color: #000000;
  color: #ffffff;
  cursor: pointer;
  font-weight: 800;
  transition: transform 1s;
}

.main-change {
  display: none;
}

.user-button,
.admin-button,
.button-change {
  display: grid;
  margin-left: 70px;
}

.user-button {
  margin-top: 70px;
}

.button-change button,
.user-button button,
.admin-button button {
  font-size: 18px;
  margin-bottom: 40px;
  width: 200px;
  height: 40px;
  padding: 8px 20px 7px;
  border-radius: 5px;
  background-color: #000000;
  color: #ffffff;
  cursor: pointer;
  border: none;
  transition: transform 1s;
}

.button-change button:hover,
.user-button button:hover,
.admin-button button:hover {
  background-color: #450d75;
  cursor: pointer;
  transform: scale(1.02);
  box-shadow: 0 0 15px #0000008a;
  transition: 0.4s;
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

/* modal */

.modal {
  background-color: #00000038;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal>div {
  background-color: #fff;
  padding: 30px 60px 30px 60px;
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
  color: #000;
}

.modal-content h2 {
  margin-top: 0px;
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

.modal p {
  margin-top: 40px;
  text-align: center;
}

.modal-content a {
  text-decoration: none;
  color: #000;
  text-decoration: underline;
}

.block2 p {
  display: flex;
  flex-direction: column;
  font-size: 26px;
}

.block2-inner {
  display: flex;
  align-items: center;
  gap: 5px;
}

.block2-inner p {
  font-size: 30px;
}

.block2 p {
  margin: 0;
}

.block2-name {
  margin-bottom: 15px;
}

.block3 {

  margin-bottom: auto;
}
</style>
