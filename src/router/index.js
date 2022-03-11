import { createWebHistory, createRouter } from "vue-router";


import Home from "../views/Home.vue";
import ViewProile from "../views/ViewProfile.vue";

import { authGuard } from '../helpers/auth';

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: ViewProile, beforeEnter: authGuard },

  // otherwise redirect to home
  { path: '/:pathMatch(.*)*', redirect: '/' }
];


export const router = createRouter({
    history: createWebHistory(),
    routes,
});
