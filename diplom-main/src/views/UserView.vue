<script setup>
import { useUserStore } from '@/store/user';
import { computed, watch, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '@/helpers/functions';
import { useApplicationStore } from '@/store/application';


const userStore = useUserStore()
const applicationStore = useApplicationStore()
const router = useRouter()
const user = computed(() => {
    return userStore.user
})
const applications = computed(() => {
    return applicationStore.applications
})
const avatarUrl = computed(() => {
    return `http://localhost:3001${user?.value?.avatarUrl}`
})
watch(user, async (val) => {
    if (!val) {
        router.push('/reserv')
    }
})
onMounted(async () => {
    if (!isAuthenticated()) {
        router.push('/reserv')
    }

})

const changeAvatar = async (event) => {
    console.log(event.target.files)
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    console.log(formData)
    const avatarURL = await userStore.uploadAvatar(formData)
    console.log(avatarURL)
    const userData = {
        ...user.value,
        avatarUrl: avatarURL
    }
    await userStore.updateMe(userData)
    console.log(userData)
}


const getButtonType = (status) => {
      if (status === 'Одобрено') return 'success'
      if (status === 'Отклонено') return 'danger'
      if (status === 'В ожидании') return 'info'
return 'info'
    }

const changeStatus = (_id, status) => {
    applicationStore.changeStatus({ _id, status })
}

const handleDelete = (_id) => {
    applicationStore.delete(_id)
}

const search = ref('')
const filteredApplications = computed(() => {
      let filteredApps = applications.value

      if (search.value) {
        const keyword = search.value.toLowerCase().trim()
        filteredApps = filteredApps .filter((app) => {
          return (
            app.user.fullName.toLowerCase().includes(keyword)
          )
        })
      }
      return filteredApps 
    })
</script>


<template>
    <div class="container">
        <h1>Личный кабинет</h1>
        <div class="blocks">
            <div class="block1">
                <img :src="avatarUrl" alt="" width="300px" height="300px"
                    style="border-radius: 10%; object-fit: cover; pointer-events: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;">
                <div class="change-photo">
                    <label for="change-photo" class="label"> Загрузить фото
                        <input class="main-change" type="file" id="change-photo" @change="changeAvatar($event)"
                            style="color: transparent; width:115px">
                    </label>
                </div>
            </div>
            <div class="block2">
                <p><b>Имя пользователя:</b> {{ user?.fullName }}</p>
                <p><b>Почта пользователя:</b> {{ user?.email }}</p>
                <p><b>Дата создания аккаунта:</b> {{ new Date(user?.createdAt).toLocaleString() }}</p>
                <p><b>Роль:</b> {{ user?.role }}</p>
            </div>
            <div class="block3">
                <div v-if="user?.role === 'admin'" class="admin-button">
                    <button>Список пользователей</button>
                    <router-link to="/reserv"><button>Список помещений</button></router-link>
                </div>
                <div v-if="user?.role === 'user'" class="user-button">
                    <button>Избранное</button>
                    <button>Сменить пароль</button>
                </div>
            </div>
        </div>
        <div class="your-applications">
            <h2 v-if="user?.role === 'user'">Ваши заявки</h2>
        </div>
        <el-table :data="filteredApplications" style="width: 100%">
                    <el-table-column label="Номер заявки" prop="_id" />
                    <el-table-column label="Имя пользователя"><template #default="{ row }"><div style="display: flex; gap: 7px; align-items: center;"><img :src="`http://localhost:3001${row.user.avatarUrl}`" alt="" width="30px" height="30px"
                    style="border-radius: 50%; object-fit: cover; pointer-events: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;"><span>{{ row.user.fullName }}</span></div></template></el-table-column>
                    <el-table-column label="Телефон" prop="phone" />
                    <el-table-column label="Дата заезда"><template #default="{ row }">{{ new Date(row.dateBegin).toLocaleString() }}</template></el-table-column>
                    <el-table-column label="Дата выезда"><template #default="{ row }">{{ new Date(row.dateEnd).toLocaleString() }}</template></el-table-column>
                    <el-table-column label="Стоимость, ₽" prop="cost"/>
                    <el-table-column label="Дата создания заявки"><template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template></el-table-column>
                    <el-table-column label="Статус заявки"><template #default="{ row }">
              <el-dropdown :disabled="user.role !== 'admin'" trigger="click" placement="bottom">
                <el-button size="small" :type="getButtonType(row.status)">
                  <div class="w-[100px]">
                    {{ row.status }}
                  </div>
                </el-button>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="changeStatus(row._id, 'Одобрено')"
                      :disabled="row.status === 'Одобрено'"
                    >
                      Одобрена
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="changeStatus(row._id, 'В ожидании')"
                      :disabled="row.status === 'В ожидании'"
                    >
                      Ожидание
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="changeStatus(row._id, 'Отклонено')"
                      :disabled="row.status === 'Отклонено'"
                    >
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
                            <el-button size="small" type="danger" style="width: 100%;"
                                @click="handleDelete(row._id)">Удалить</el-button>
                        </template>
                    </el-table-column>
                </el-table>
    </div>
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
    font-size: 40px;
}

.blocks {
    display: flex;
}

.block1 {
    margin-right: 5%;
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
.admin-button {
    display: grid;
    margin-left: 70px;
}

.user-button {
    margin-top: 70px;
}

.user-button button,
.admin-button button {
    font-size: 20px;
    margin-bottom: 40px;
    width: 350px;
    height: 70px;
    padding: 8px 20px 7px;
    border-radius: 10px;
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
    border: none;
    transition: transform 1s;

}

.user-button button:hover,
.admin-button button:hover,
label:hover {
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
</style>