import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
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
  }

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: '工作平台',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: '工作平台', icon: 'dashboard', url: '/dashboard/index' }
  //   }]
  // }

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '工作平台',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作平台', icon: 'dashboard', url: '/dashboard/index' }
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'system', url: '/system/index' },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user', url: '/user/index' }
      },
      {
        path: 'department',
        name: '部门管理',
        component: () => import('@/views/department/index'),
        meta: { title: '部门管理', icon: 'department', url: '/department/index' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role', url: '/role/index' }
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'menu', url: '/menu/index' }
      }
    ]
  },

  {
    path: '/initialize',
    component: Layout,
    redirect: '/initialize/subject',
    name: '初始化管理',
    meta: { title: '初始化管理', icon: 'initial', url: '/initialize/index' },
    children: [
      {
        path: 'subject',
        name: '学科管理',
        component: () => import('@/views/subject/index'),
        meta: { title: '学科管理', icon: 'subject', url: '/subject/index' }
      },
      {
        path: 'class',
        name: '班级管理',
        component: () => import('@/views/teachingClass/index'),
        meta: { title: '班级管理', icon: 'class', url: '/class/index' }
      },
      {
        path: 'tutor',
        name: '导师管理',
        component: () => import('@/views/tutor/index'),
        meta: { title: '导师管理', icon: 'tutor', url: '/tutor/index' }
      },
      {
        path: 'student',
        name: '学生管理',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'student', url: '/student/index' }
      }
    ]
  }

  // { path: '*', redirect: '/404', hidden: true }

  // {
  //   path: '/topicSelect',
  //   component: Layout,
  //   meta: { title: '学生选题', icon: 'form', url: '/topicSelect/index' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: '学生选题',
  //       component: () => import('@/views/select/index')
  //     }
  //   ]
  // }

  // {
  //   path: '/submit',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '任务提交',
  //       component: () => import('@/views/submit/index'),
  //       meta: { title: '任务提交', icon: 'submit', url: '/submit/index' }
  //     }
  //   ]
  // },

  // {
  //   path: '/topicManage',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '题目管理',
  //       component: () => import('@/views/topic/index'),
  //       meta: { title: '题目管理', icon: 'form', url: '/topicManage/index' }
  //     }
  //   ]
  // },
  // {
  //   path: '/check',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '任务审核',
  //       component: () => import('@/views/check/index'),
  //       meta: { title: '任务审核', icon: 'check', url: '/check/index' }
  //     }
  //   ]
  // },

  // {
  //   path: '/dataImport',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '数据导入',
  //       component: () => import('@/views/dataImport/index'),
  //       meta: { title: '数据导入', icon: 'import', url: '/dataImport/index' }
  //     }
  //   ]
  // },

  // {
  //   path: '/adujst',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '题目调整',
  //       component: () => import('@/views/adujst/index'),
  //       meta: { title: '题目调整', icon: 'form', url: '/adujst/index' }
  //     }
  //   ]
  // },

  // {
  //   path: '/result',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '任务结果上传',
  //       component: () => import('@/views/result/index'),
  //       meta: { title: '任务结果上传', icon: 'upload', url: '/result/index' }
  //     }
  //   ]
  // },
  // {
  //   path: '/expert',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '专家组管理',
  //       component: () => import('@/views/expert/index'),
  //       meta: { title: '专家组管理', icon: 'expert', url: '/expert/index' }
  //     }
  //   ]
  // },
  // {
  //   path: '/task',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '任务管理',
  //       component: () => import('@/views/task/index'),
  //       meta: { title: '任务管理', icon: 'task', url: '/task/index' }
  //     }
  //   ]
  // }
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

export function resetRouter2(routes) {
  alert(1)
  const newRouter = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: asyncRoutes
  })
  router.matcher = newRouter.matcher
}

export default router
