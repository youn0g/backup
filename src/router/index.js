import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 导入 store
import store from '@/store'
import { Notification } from 'element-ui'

/**
 * Note: sub-menu only appear when route children. Length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will become nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will not redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制面板', icon: 'dashboard' }
    }]
  },
  // 大屏设置
  {
    path: '/screen',
    component: () => import('@/views/screen'),
    name: 'Screen',
    meta: { title: '大屏', icon: 'screen' }
  },
  // Waf 路由设置
  {
    path: '/waf',
    component: Layout,
    redirect: '/waf/info',
    name: 'Waf',
    meta: { title: 'Waf', icon: 'waf' },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/waf/info/index'),
        meta: { title: 'Waf 信息', icon: 'wafInfo' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/waf/log/index'),
        meta: { title: '处理日志', icon: 'log' }
      }
    ]
  },
  // User 路由设置
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/info',
    name: 'Staff',
    meta: {
      title: '用户',
      icon: 'user'
    },
    children: [
      {
        path: 'info',
        component: () => import('@/views/staff/info/index'),
        name: 'UserInfo',
        meta: { title: '用户信息', icon: 'userInfo' }
      },
      {
        path: 'test',
        component: () => import('@/views/staff/test/index'),
        name: 'Test',
        meta: { title: 'Test' }
      }
    ]
  },
  // 新建 路由设置
  {
    // 这里设置嵌套路由，设为 创建人员 和 导入 Waf
    path: '/new',
    component: Layout,
    redirect: '/new/person',
    name: 'New',
    meta: { title: '新建', icon: 'new' },
    children: [
      {
        path: 'person',
        name: 'newPerson',
        component: () => import('@/views/new/person'),
        meta: { title: '人员注册', icon: 'newUser' }
      },
      {
        path: 'waf',
        name: 'newWaf',
        component: () => import('@/views/new/waf'),
        meta: { title: '导入 Waf', icon: 'import' }
      }
    ],
    beforeEnter: (to, from, next) => {
      if (store.getters.roles !== 'admin') {
        Notification.error({
          title: 'Permission Denied',
          message: 'You are not allowed to access this page.',
          duration: 5000
        })
        // TODO：上线删除
        // router.push(from.fullPath)
        next()
      } else {
        next()
      }
    }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
