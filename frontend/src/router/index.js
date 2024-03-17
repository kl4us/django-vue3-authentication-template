import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store';

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistrationView from '@/views/RegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,    
      meta: {
        requiresAuth: true 
      }  
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,      
    }, 
    {
      path: '/register',
      name: 'register',
      component: RegistrationView,      
    },         
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },    
    { 
      // otherwise redirect to home
      path: '/:pathMatch(.*)*', 
      redirect: '/' 
    }    
  ],
  linkActiveClass: "active"
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated){
      return {
        path: '/login',
        query: { returnUrl: to.href }
      };
    }
  }
});

export default router