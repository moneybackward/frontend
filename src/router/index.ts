import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useQuasar } from 'quasar';
import { verify } from 'src/api/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext }*/) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    // if not protected route, continue
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
      next();
      return;
    }

    // if protected route, check if user is logged in
    const $q = useQuasar();
    const jwt_token = $q.cookies.get('jwt_token');
    // if jwt_token is not present, redirect to login page
    if (!jwt_token) {
      $q.notify({
        message: "You're not logged in. Please login first.",
        position: 'top',
        type: 'negative',
      });
      next({
        path: '/auth/login',
      });
      return;
    }

    // if jwt_token is present, verify it
    verify(jwt_token)
      .then((res) => res)
      .catch((err) => {
        console.error(err);
        $q.cookies.remove('jwt_token');
        $q.notify({
          message: 'Your session has expired. Please login again.',
          position: 'top',
          type: 'negative',
        });
        next({
          path: '/auth/login',
        });
      });

    // if jwt_token is valid, continue
    next();
  });

  return Router;
});
