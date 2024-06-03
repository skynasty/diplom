import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MainView from '@/views/MainView.vue'
import ReservationView from '@/views/ReservationView.vue'
import NotFoundView from "@/views/NotFoundView.vue";
import ContactsView from '@/views/ContactsView.vue';
import FavouritesView from '@/views/FavouritesView.vue'
import ApplicationsAdmin from '@/views/ApplicationsAdmin.vue';
import UserView from '@/views/UserView.vue';
import UsersList from '@/views/UsersList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },

    {
      path: '/reserv',
      name: 'reserv',
      component: ReservationView
    },
    {
      path: "/:pathMatch(.)",
      component: NotFoundView,
      meta: { title: "Page not found" },
    },
    {
      path: "/contacts",
      name: 'contacts',
      component: ContactsView,
    },
    {
      path: "/favourites",
      name: 'favourites',
      component: FavouritesView,
    },
    {
      path: "/profile",
      name: 'profile',
      component: UserView,
    },
    {
      path: "/applicationsAdmin",
      name: 'applicationsAdmin',
      component: ApplicationsAdmin,
    },
    {
      path: "/users-list",
      name: 'usersList',
      component: UsersList,
    },

  ]
})

export default router
