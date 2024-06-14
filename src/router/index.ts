import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NetworkAccess from '@/views/NetworkAccess.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/networkAccess',
    name: 'networkAccess',
    component: NetworkAccess
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
