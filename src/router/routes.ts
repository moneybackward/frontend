import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/IndexLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },
  {
    path: '/auth',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'logout', component: () => import('pages/auth/LogoutPage.vue') },
      {
        path: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/app',
    meta: {
      requiresAuth: true,
    },
    component: () => import('layouts/AppLayout.vue'),
    children: [
      {
        path: 'note',
        component: () => import('pages/app/NotePage.vue'),
      },
      {
        path: 'note/stats',
        component: () => import('pages/app/StatisticPage.vue'),
      },
      {
        path: 'note/transaction',
        component: () => import('pages/app/TransactionPage.vue'),
      },
      {
        path: 'note/category',
        component: () => import('pages/app/CategoryPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
