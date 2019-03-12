import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import { 
  checkLogin,
  uploadPic,
  getDriverLists,
  addDriver,
  editDriver,
  delDriver,
  getCompanyBaseConfig,
  setCompanyBaseConfig,
  getLngLat,
  changeLngLat,
  addCompanyCity,
  editCompanyCity,
  delCompanyCity,
  getCompanyCityLists,
  addUseCarType,
  editUseCarType,
  delUseCarType,
  getUseCarTypeLists,
  addCarTemplate,
  editCarTemplate,
  delCarTemplate,
  getCarTemplateLists,
  setCompanyOrderBaseConfig,
  getCompanyOrderBaseConfig,
  addOrderType,
  editOrderType,
  getOrderTypeLists,
  getPermissionLists,
  addAdminUser,
  editAdminUser,
  getAdminUserLists,
} from '@/api/data'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    siderShow:false,
    access: '',
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.app.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setAccess (state, access) {
      state.access = access
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    setSiderShow (state,showObj) {
      state.siderShow = showObj.siderShowType;
      window.localStorage.setItem('SiderShow',showObj.siderShowType);
      window.localStorage.setItem('MenuName',showObj.menuName)
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
    },
    hideSider ({ state, commit },typeObj) {
      commit('setSiderShow', typeObj)
    },
    checkLogin({ commit }){
      return new Promise((resolve, reject) => {
        checkLogin().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    uploadPic ({ commit }, { base64Img }) {
      return new Promise((resolve, reject) => {
        uploadPic({ base64Img }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //加盟司机
    getDriverLists({ commit }, { id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }) {
      return new Promise((resolve, reject) => {
        getDriverLists({ id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addDriver({ commit }, { auth_status,telephone,city_id,header_img_path,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }) {
      return new Promise((resolve, reject) => {
        addDriver({ auth_status,telephone,city_id,header_img_path,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editDriver({ commit }, { id,auth_status,telephone,city_id,header_img_path,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }) {
      return new Promise((resolve, reject) => {
        editDriver({ id,auth_status,telephone,city_id,header_img_path,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delDriver({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delDriver({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //公司信息配置
    getCompanyBaseConfig({ commit }){
      return new Promise((resolve, reject) => {
        getCompanyBaseConfig().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setCompanyBaseConfig({ commit }, { company_name,telephone,address,address_location,bussiness_path,introduction }){
      return new Promise((resolve, reject) => {
        setCompanyBaseConfig({ company_name,telephone,address,address_location,bussiness_path,introduction }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getLngLat({ commit }, { address }){
      return new Promise((resolve, reject) => {
        getLngLat({ address }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changeLngLat({ commit }, { lng,lat }){
      return new Promise((resolve, reject) => {
        changeLngLat({ lng,lat }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //城市配置
    addCompanyCity({ commit }, { city,status }){
      return new Promise((resolve, reject) => {
        addCompanyCity({ city,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editCompanyCity({ commit }, { id,status }){
      return new Promise((resolve, reject) => {
        editCompanyCity({ id,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delCompanyCity({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delCompanyCity({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCompanyCityLists({ commit }, { id,search,offset,limit,status }){
      return new Promise((resolve, reject) => {
        getCompanyCityLists({ id,search,offset,limit,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //车型配置
    addUseCarType({ commit }, { name,status }){
      return new Promise((resolve, reject) => {
        addUseCarType({ name,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editUseCarType({ commit }, { id,name,status }){
      return new Promise((resolve, reject) => {
        editUseCarType({ id,name,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delUseCarType({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delUseCarType({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUseCarTypeLists({ commit }, { id,status,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getUseCarTypeLists({ id,status,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addCarTemplate({ commit }, { use_car_type_id,brand,model,status }){
      return new Promise((resolve, reject) => {
        addCarTemplate({ use_car_type_id,brand,model,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editCarTemplate({ commit }, { id,use_car_type_id,brand,model,status }){
      return new Promise((resolve, reject) => {
        editCarTemplate({ id,use_car_type_id,brand,model,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    delCarTemplate({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delCarTemplate({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getCarTemplateLists({ commit }, { id,status,use_car_type_id,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getCarTemplateLists({ id,status,use_car_type_id,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    setCompanyOrderBaseConfig({ commit }, { pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time }){
      return new Promise((resolve, reject) => {
        setCompanyOrderBaseConfig({ pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getCompanyOrderBaseConfig({ commit }){
      return new Promise((resolve, reject) => {
        getCompanyOrderBaseConfig().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    addOrderType({ commit }, { order_type,use_car_type_id,amount,status,limit_km,addition_amount, }){
      return new Promise((resolve, reject) => {
        addOrderType({ order_type,use_car_type_id,amount,status,limit_km,addition_amount, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editOrderType({ commit }, { id,order_type,use_car_type_id,amount,status }){
      return new Promise((resolve, reject) => {
        editOrderType({ id,order_type,use_car_type_id,amount,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getOrderTypeLists({ commit }, { id,status,use_car_type_id,order_type,offset,limit,type, }){
      return new Promise((resolve, reject) => {
        getOrderTypeLists({ id,status,use_car_type_id,order_type,offset,limit,type, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getPermissionLists({ commit }){
      return new Promise((resolve, reject) => {
        getPermissionLists().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    addAdminUser({ commit }, { name,telephone,role,password,permission,status, }){
      return new Promise((resolve, reject) => {
        addAdminUser({ name,telephone,role,password,permission,status, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editAdminUser({ commit }, { id,name,telephone,role,password,permission,status, }){
      return new Promise((resolve, reject) => {
        editAdminUser({ id,name,telephone,role,password,permission,status, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getAdminUserLists({ commit }, { id,status,search,offset,limit, }){
      return new Promise((resolve, reject) => {
        getAdminUserLists({ id,status,search,offset,limit, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // getDriverList({ commit }, { driverId,search,offset,limit,status,type,sex,driveType,authCustomerStatus,authCarType,authCarTemplateId,authCarStatus,noticeBt }){
    //   return new Promise((resolve, reject) => {
    //     getDriverList({ driverId,search,offset,limit,status,type,sex,driveType,authCustomerStatus,authCarType,authCarTemplateId,authCarStatus,noticeBt }).then(res => {
    //       resolve(res)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    
    
    transferAccess({commit},access){
      commit('setAccess', access)
    }
    
  }
}
