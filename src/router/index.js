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
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '工作平台',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作平台', icon: 'dashboard' }
    }]
  },

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

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'department',
        name: '部门管理',
        component: () => import('@/views/department/index'),
        meta: { title: '部门管理', icon: 'department' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'menu' }
      }
    ]
  },

  {
    path: '/initialize',
    component: Layout,
    redirect: '/initialize/subject',
    name: '初始化管理',
    meta: { title: '初始化管理', icon: 'initial' },
    children: [
      {
        path: 'subject',
        name: '学科管理',
        component: () => import('@/views/tree/index'),
        meta: { title: '学科管理', icon: 'subject' }
      },
      {
        path: 'class',
        name: '班级管理',
        component: () => import('@/views/tree/index'),
        meta: { title: '班级管理', icon: 'class' }
      },
      {
        path: 'tutor',
        name: '导师管理',
        component: () => import('@/views/tree/index'),
        meta: { title: '导师管理', icon: 'tutor' }
      },
      {
        path: 'student',
        name: '学生管理',
        component: () => import('@/views/tree/index'),
        meta: { title: '学生管理', icon: 'student' }
      }
    ]
  },

  {
    path: '/topicSelect',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '学生选题',
        component: () => import('@/views/select/index'),
        meta: { title: '学生选题', icon: 'form' }
      }
    ]
  },

  {
    path: '/submit',
    component: Layout,
    redirect: '/submit/paper',
    name: '我的提交',
    meta: { title: '我的提交', icon: 'submit' },
    children: [
      {
        path: 'paper',
        name: '论文提交',
        component: () => import('@/views/paper/index'),
        meta: { title: '论文提交', icon: 'paper' }
      },
      {
        path: 'plan',
        name: '实验计划提交',
        component: () => import('@/views/tree/index'),
        meta: { title: '实验计划提交', icon: 'plan' }
      },
      {
        path: 'project',
        name: '实验项目提交',
        component: () => import('@/views/tree/index'),
        meta: { title: '实验项目提交', icon: 'project' }
      }
    ]
  },

  {
    path: '/topicManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '题目管理',
        component: () => import('@/views/topic/index'),
        meta: { title: '题目管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/check',
    component: Layout,
    redirect: '/check/paper',
    name: '我的审核',
    meta: { title: '我的审核', icon: 'check' },
    children: [
      {
        path: 'paper',
        name: '论文审核',
        component: () => import('@/views/tree/index'),
        meta: { title: '论文审核', icon: 'paper' }
      },
      {
        path: 'plan',
        name: '实验计划审核',
        component: () => import('@/views/tree/index'),
        meta: { title: '实验计划审核', icon: 'plan' }
      },
      {
        path: 'project',
        name: '实验项目审核',
        component: () => import('@/views/tree/index'),
        meta: { title: '实验项目审核', icon: 'project' }
      }
    ]
  },

  {
    path: '/topicAdujst',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '题目调整',
        component: () => import('@/views/form/index'),
        meta: { title: '题目调整', icon: 'form' }
      }
    ]
  },

  {
    path: '/resultUpload',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '答辩结果上传',
        component: () => import('@/views/result/index'),
        meta: { title: '答辩结果上传', icon: 'upload' }
      }
    ]
  },
  {
    path: '/expertManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '专家组管理',
        component: () => import('@/views/form/index'),
        meta: { title: '专家组管理', icon: 'expert' }
      }
    ]
  },
  {
    path: '/taskManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '任务管理',
        component: () => import('@/views/task/index'),
        meta: { title: '任务管理', icon: 'task' }
      }
    ]
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
