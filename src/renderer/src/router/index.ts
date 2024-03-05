import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@renderer/layout/index.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/404',
      component: () => import('../views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      redirect: '/home',
      meta: { icon: 'icon-shouye', name: '/home' },
      component: Layout,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@renderer/views/home/index.vue'),
          meta: { title: '首页' }
        }
      ]
    },
    {
      path: '/notice',
      redirect: '/notice',
      meta: { icon: 'icon-gonggao', name: '/notice' },
      component: Layout,
      children: [
        {
          path: 'notice',
          name: 'Notice',
          component: () => import('@renderer/views/notice/index.vue'),
          meta: { title: '网站公告' }
        }
      ]
    },

    { path: '/:catchAll(.*)', redirect: '/404', meta: { hidden: true } }
  ]
})

export default router
