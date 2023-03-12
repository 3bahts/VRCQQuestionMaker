import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/',
    meta: { requiresAuth: true },
    redirect: '/questions',
    component: () => import('pages/HomePage.vue'),
    children: [
      {
        path: 'questions',
        component: () => import('pages/QuestionsPage.vue'),
      },
      {
        path: 'questions/:id',
        component: () => import('pages/EditQuestionPage.vue'),
        props: (route) => {
          return { id: Number(route.params.id) };
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
