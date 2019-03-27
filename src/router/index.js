import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import { LoadingBar,Spin } from 'iview';
import { setTitle,canTurnTo } from '@/libs/util'
import config from '@/config'
import { format } from 'url';
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  LoadingBar.start()
  Spin.show({
      render: (h) => {
          return h('div', [])
      }
  })


  if(to.path === '/home' && parseInt(window.localStorage.getItem('MenuName')) === 1){
    store.dispatch('hideSider',{
      siderShowType:false,
      menuName:"1"
    })
  }else if(to.path === '/home' && parseInt(window.localStorage.getItem('MenuName')) === 2){
    store.dispatch('hideSider',{
      siderShowType:true,
      menuName:"2"
    })
  }else if(to.path === '/home' && parseInt(window.localStorage.getItem('MenuName')) === 3){
    store.dispatch('hideSider',{
      siderShowType:true,
      menuName:"3"
    })
  }else if(to.path === '/home' && parseInt(window.localStorage.getItem('MenuName')) === 4){
    store.dispatch('hideSider',{
      siderShowType:true,
      menuName:"4"
    })
  }else if(to.path === '/home' && parseInt(window.localStorage.getItem('MenuName')) === 5){
    store.dispatch('hideSider',{
      siderShowType:true,
      menuName:"5"
    })
  }else if(to.path === '/home' && !window.localStorage.getItem('MenuName')){
    store.dispatch('hideSider',{
      siderShowType:false,
      menuName:"1"
    })
  }

  let companyId = window.localStorage.getItem("ueiwrhifjbidfdasnf_companyId");

  if (!companyId && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!companyId && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  }else if (companyId) {
    if(to.matched.some(record => record.meta.requireIsLogin)) {
      store.dispatch('checkLogin').then((data) => {
          if(data.data.data && data.data.data.length !== 0 ){
            if(parseInt(window.localStorage.getItem('MenuName')) === 1){
              turnTo(to, '', next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 2){
              store.dispatch('transferAccess',['leagueCheck'])
              turnTo(to, ['leagueCheck'], next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 3){
              store.dispatch('transferAccess',['indentCheck'])
              turnTo(to, ['indentCheck'], next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 4){
              store.dispatch('transferAccess',['countCheck'])
              turnTo(to, ['countCheck'], next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 5){
              store.dispatch('transferAccess',['vehicleCheck'])
              turnTo(to, ['vehicleCheck'], next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 6){
              store.dispatch('transferAccess',['customerCheck'])
              turnTo(to, ['customerCheck'], next)
            }else if(parseInt(window.localStorage.getItem('MenuName')) === 7){
              store.dispatch('transferAccess',['configureCheck'])
              turnTo(to, ['configureCheck'], next)
            }
          }else{
              next({
                name: LOGIN_PAGE_NAME // 跳转到登录页
              })
          }
      })
    }else{
      next()  // 一定要调用next()
    }
  }
  
})

router.afterEach(to => {
  setTitle(to, router.app)
  LoadingBar.finish()
  Spin.hide()
  window.scrollTo(0, 0)
})

export default router
