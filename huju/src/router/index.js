import { createRouter,createWebHistory }  from "vue-router";


import landing from "../views/admin/landing.vue";   
import login from "../views/admin/login.vue";
import info from "../views/admin/info.vue";
import banner from "../views/admin/banner.vue"; 
import list from "../views/admin/list.vue";
import channel from "../views/admin/channel.vue";

const routes = [
  { 
    path: '/admin/landing',
    component: landing,
    },
    {
        path: '/admin/login',
        component: login,
    },
    {
        path: '/admin/info',
        component: info,
    },
    {
        path: '/admin/banner',
        component: banner,
    },
    {
        path:'/admin/list',
        component:list,
    },
    {
        path:'/admin/channel',
        component:channel,
    },
    {
        path: '/',
        redirect:'/admin/login'
    },
    
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router;