import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store';
import Song from '../views/Song.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/manage-music',
    meta: {
      requiredAuth: true,
    },
    name: 'Manage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "manage" */ '../views/Manage.vue'),
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});
router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiredAuth)) {
    next();
  }
  if (store.state.userLogin) {
    next();
  } else {
    next({ name: 'Home' });
  }
});
export default router;
