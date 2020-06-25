import Vue from 'vue'
import VueRouter from 'vue-router'

import Header from '@/components/Header.vue';
import Login from '@/components/Login.vue';
import Home from '@/components/Home.vue';
import Board from '@/components/Board.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home
  },
  {
    path: '/board/:id',
    name: 'board',
    component: Board
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
