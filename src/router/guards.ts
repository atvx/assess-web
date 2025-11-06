import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 智审云`
    }

    // 如果是后台路由，检查登录状态
    if (to.path.startsWith('/admin')) {
      if (!userStore.isLoggedIn) {
        message.warning('请先登录')
        next({
          path: '/login',
          query: { redirect: to.fullPath }, // 保存目标路由，登录后跳转
        })
        return
      }
    }

    // 如果已登录，访问登录页，跳转到后台首页
    if (to.path === '/login' && userStore.isLoggedIn) {
      next('/admin/dashboard')
      return
    }

    next()
  })

  // 全局后置守卫
  router.afterEach(() => {
    // 可以在这里处理一些全局的后置逻辑，比如取消加载动画
  })
}
