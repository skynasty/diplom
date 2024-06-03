import { defineStore } from "pinia";
import * as api from "../services/user";
import { useApplicationStore } from "./application";
import { getMyFavourites } from "@/services/favourite";
import * as favouriteApi from "../services/favourite";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    favourite: [],
    status: false,
    users: []
  }),
  actions: {
    async getMe() {
      const user = await api.getMe();
      this.user = user;
      return user;
    },
    async updateMe(data) {
      this.user = data;
      await api.updateMe(data);
    },
    async uploadFile(formData) {
      const URL = await api.uploadFile(formData);
      return URL;
    },
    async getMyFavourites() {
      const favourites = await favouriteApi.getMyFavourites();
      this.favourite = favourites;
      return favourites;
    },
    async createFavourite(apartmentId) {
      const favourite = await favouriteApi.create(apartmentId);
      this.favourite.push(favourite);
      return favourite;
    },
    async deleteFavourite(favouriteId) {
      await favouriteApi.remove(favouriteId);
      const index = this.favourite.findIndex((fav) => fav._id === favouriteId);
      if (index !== -1) {
        this.favourite.splice(index, 1);
      }
    },
    async getAllUsers() {
      const users = await api.getAllUsers();
      this.users = users;
      return users;
    },
    async deleteUser(userId) {
      await api.deleteUser(userId);
      const index = this.users.findIndex((user) => user._id === userId);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    },
    changeLoadStatus(status) {
      this.status = status;
    },
    async changeRole(id, role) {
      await api.changeRole(id, role);
      const user = this.users.find((user) => user._id === id);
      user.role = role;
      if (id === this.user._id) {
        this.user.role = role
      }
    },
    changePassword(id, password) {
      api.changePassword(id, password);
    },
  },
});
