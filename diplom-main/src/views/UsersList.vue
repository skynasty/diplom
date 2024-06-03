<script setup>
import { useUserStore } from "@/store/user";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useApartmentsStore } from "@/store/apartments";
import CartComponent from "@/components/CartComponent.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

const users = computed(() => {
  if (search.value) {
    const keyword = search.value.toLowerCase().trim();
    return userStore.users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }
  return userStore.users;
});

const user = computed(() => {
  return userStore.user;
});

const role = computed(() => {
  return userStore.user?.role || null;
});

const status = computed(() => {
  return userStore.status;
});

const handleEdit = () => {};

const handleDelete = async (id) => {
  ElMessageBox.confirm(
    'Вы точно хотите удалить этого пользователя?',
    'Предупреждение',
    {
      confirmButtonText: 'Да',
      cancelButtonText: 'Отмена',
      type: 'warning',
    }
  )
    .then(() => {
      userStore.deleteUser(id);
      ElMessage({
        type: 'success',
        message: 'Пользователь удален',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Удаление отменено',
      })
    })
  
  
};

const search = ref("");

const changeRole = async (id, role) => {
  await userStore.changeRole(id, role)
}

watch(status, async (val) => {
  if (val && (!user.value || (user.value && user.value.role !== "admin"))) {
    router.push("/");
  }
});

watch(role, async (val) => {
  if (val && val !== 'admin') {
    router.push("/");
  }
});
</script>

<template>
  <div v-if="user?.role === 'admin'" class="container">
    <h2>Список пользователей</h2>
    <el-table :data="users" style="border-radius: 10px">
      <el-table-column label="Имя пользователя"
        ><template #default="{ row }"
          ><div style="display: flex; gap: 7px; align-items: center">
            <img
              :src="`http://localhost:3001${row.avatarUrl}`"
              alt=""
              width="30px"
              height="30px"
              style="
                border-radius: 50%;
                object-fit: cover;
                pointer-events: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
              "
            /><span>{{ row.fullName }}</span>
          </div></template
        ></el-table-column
      >
      <el-table-column label="Email пользователя"
        ><template #default="{ row }">{{
          row.email
        }}</template></el-table-column
      >
      <el-table-column label="Роль"
        ><template #default="{ row }"
          ><el-dropdown
            :disabled="user.role !== 'admin'"
            trigger="click"
            placement="bottom"
          
          >
          <el-tag
            :type="row.role === 'admin' ? 'success' : ''"
            disable-transitions
            style="font-weight: bold;
            cursor: pointer;"
            size="large"
            
            >{{ row.role }}</el-tag
          >

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="changeRole(row._id, 'admin')"
                  :disabled="row.role === 'admin'"
                >
                  admin
                </el-dropdown-item>
                <el-dropdown-item
                  @click="changeRole(row._id, 'user')"
                  :disabled="row.role === 'user'"
                >
                  user
                </el-dropdown-item>
              </el-dropdown-menu>
            </template> </el-dropdown
          ></template
        ></el-table-column
      >
      <el-table-column label="Дата создания аккаунта"
        ><template #default="{ row }">{{
          new Date(row.createdAt).toLocaleString()
        }}</template></el-table-column
      >
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Поиск..." />
        </template>
        <template #default="{ row }">
          <el-button type="danger" plain @click="handleDelete(row._id)"
            >Удалить</el-button
          >
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
}

h2 {
  font-size: 30px;
}
</style>
