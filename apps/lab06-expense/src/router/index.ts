import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/list'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/list'
      },
      {
        path: 'list',
        component: () => import('@/views/ExpenseListPage.vue')
      },
      {
        path: 'add',
        component: () => import('@/views/AddExpensePage.vue')
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/EditExpensePage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;