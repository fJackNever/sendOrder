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
  getIndexHost,
  getIndexLists,
  getDriverHost,
  getDriverLists,
  addDriver,
  editDriver,
  delDriver,
  bindingCar,
  unbindingCar,
  authDriverStatus,
  editDriverStatus,
  getFleetLists,
  addMemberToFleet,
  removeMemberToFleet,
  getCanJoinFleetDriverLists,
  delFleet,
  addFleet,
  editFleet,
  getOrderLists,
  getOrderHost,
  getWorkReminder,
  cancelOrder,
  getOrderDriverLists,
  getOrderInfo,
  orderToDriver,
  changeOrderToGrab,
  checkOrderGetAmount,
  addOrder,
  editOrder,
  getResaaignHost,
  getReassignApplyLists,
  reassignOrder,
  rejectReassignApply,
  getAbnormalHost,
  getAbnormalOrderLists,
  forcedEndOrder,
  getSettleHost,
  getSettleOrderLists,
  preDriverSettle,
  driverSettle,
  getDriverReconciliayionLists,
  delDriverReconciliation,
  createDriverReconciliation,
  getDriverId,
  getDriverAmountLists,
  rewardDriver,
  fineDriver,
  getDriverInoutLists,
  getDriverWithdrawHost,
  getDriverWithdrawLists,
  manageDriverWithdraw,
  rejectDriverWithdraw,
  getCutsomerReconciliationHost,
  createCustomerReconciliation,
  getCustomerReconciliayionLists,
  payCustomerReconciliation,
  confirmCustomerReconciliation,
  delCustomerReconciliation,
  getCustomerId,
  getFinanceHost,
  getFinanceLists,
  getCarLists,
  addCar,
  editCar,
  delCar,
  authCarStatus,
  bindingDriver,
  unbindingDriver,
  getCustomerLists,
  addCustomer,
  editCustomer,
  authCustomerStatus,
  delCustomer,
  getCompanyBaseConfig,
  setCompanyBaseConfig,
  getDriverRegisterUrl,
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
  getTemplateHost,
  setCompanyOrderBaseConfig,
  getCompanyOrderBaseConfig,
  addOrderType,
  editOrderType,
  getOrderTypeLists,
  setCompanySettleConfig,
  getCompanySettleConfig,
  getPermissionLists,
  addAdminUser,
  editAdminUser,
  editAdminUserNoPwdSuper,
  editAdminUserSuper,
  editAdminUserNoPwd,
  getAdminUserLists,
  getAdminUserHost,
  getCustomerInfo,
  setCustomer,
  getChangeCustomerPassword,
  getOrderDescription,
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
    topMenuName:'1',
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.app.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setMenuName (state, menuName) {
      state.topMenuName = menuName
    },
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
    //首页工作台
    getIndexHost({ commit }){
      return new Promise((resolve, reject) => {
        getIndexHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getIndexLists({ commit },{ start_time,end_time,date_type }){
      return new Promise((resolve, reject) => {
        getIndexLists({ start_time,end_time,date_type }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //加盟司机
    getDriverHost({ commit }){
      return new Promise((resolve, reject) => {
        getDriverHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDriverLists({ commit }, { id,fleet_id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }) {
      return new Promise((resolve, reject) => {
        getDriverLists({ id,fleet_id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }).then(res => {
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
    bindingCar({ commit }, { car_id,driver_id }){
      return new Promise((resolve, reject) => {
        bindingCar({ car_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    unbindingCar({ commit }, { car_id,driver_id }){
      return new Promise((resolve, reject) => {
        unbindingCar({ car_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    authDriverStatus({ commit }, { id,auth_status,is_server,auth_comment }){
      return new Promise((resolve, reject) => {
        authDriverStatus({ id,auth_status,is_server,auth_comment }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editDriverStatus({ commit }, { id,status,server_comment }){
      return new Promise((resolve, reject) => {
        editDriverStatus({ id,status,server_comment }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //车队管理
    getFleetLists({ commit }, { id,status,fleet_no,fleet_name,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getFleetLists({ id,status,fleet_no,fleet_name,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addMemberToFleet({ commit }, { fleet_id,driver_id }){
      return new Promise((resolve, reject) => {
        addMemberToFleet({ fleet_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    removeMemberToFleet({ commit }, { fleet_id,driver_id }){
      return new Promise((resolve, reject) => {
        removeMemberToFleet({ fleet_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCanJoinFleetDriverLists({ commit }, { id,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getCanJoinFleetDriverLists({ id,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delFleet({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delFleet({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addFleet({ commit }, { fleet_name,comment,logo_path,max_member,status }){
      return new Promise((resolve, reject) => {
        addFleet({ fleet_name,comment,logo_path,max_member,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editFleet({ commit }, { id,fleet_name,comment,logo_path,max_member,status }){
      return new Promise((resolve, reject) => {
        editFleet({ id,fleet_name,comment,logo_path,max_member,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //订单管理
    getOrderHost({ commit }){
      return new Promise((resolve, reject) => {
        getOrderHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getWorkReminder({ commit }){
      return new Promise((resolve, reject) => {
        getWorkReminder().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrderLists({ commit }, { id,entity_id,customer_id,city_id,use_car_type_id,status,other_status,start_start_time,start_end_time,create_start_time,create_end_time,driver_name,customer_name,passenger_tel,offset,limit }){
      return new Promise((resolve, reject) => {
        getOrderLists({ id,entity_id,customer_id,city_id,use_car_type_id,status,other_status,start_start_time,start_end_time,create_start_time,create_end_time,driver_name,customer_name,passenger_tel,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    cancelOrder({ commit }, { entity_id }){
      return new Promise((resolve, reject) => {
        cancelOrder({ entity_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrderDriverLists({ commit }, { order_id,key_words,car_color }){
      return new Promise((resolve, reject) => {
        getOrderDriverLists({ order_id,key_words,car_color  }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrderInfo({ commit }, { order_id }){
      return new Promise((resolve, reject) => {
        getOrderInfo({ order_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    orderToDriver({ commit }, { entity_id,driver_id }){
      return new Promise((resolve, reject) => {
        orderToDriver({ entity_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changeOrderToGrab({ commit }, { entity_id }){
      return new Promise((resolve, reject) => {
        changeOrderToGrab({ entity_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    checkOrderGetAmount({ commit }, { order_type,use_car_type_id,city_id,customer_id,start_date,start_time,start_location,end_location }){
      return new Promise((resolve, reject) => {
        checkOrderGetAmount({ order_type,use_car_type_id,city_id,customer_id,start_date,start_time,start_location,end_location }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addOrder({ commit }, { order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }){
      return new Promise((resolve, reject) => {
        addOrder({ order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editOrder({ commit }, { id,order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }){
      return new Promise((resolve, reject) => {
        editOrder({ id,order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //改派订单
    getResaaignHost({ commit }){
      return new Promise((resolve, reject) => {
        getResaaignHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getReassignApplyLists({ commit }, { order_id,order_entity_id,city_id,reassign_manage_status,start_time,end_time,driver_name,customer_name,passenger_tel,offset,limit }){
      return new Promise((resolve, reject) => {
        getReassignApplyLists({ order_id,order_entity_id,city_id,reassign_manage_status,start_time,end_time,driver_name,customer_name,passenger_tel,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    reassignOrder({ commit },{ entity_id }){
      return new Promise((resolve, reject) => {
        reassignOrder({ entity_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    rejectReassignApply({ commit },{ id }){
      return new Promise((resolve, reject) => {
        rejectReassignApply({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //异常订单
    getAbnormalHost({ commit }){
      return new Promise((resolve, reject) => {
        getAbnormalHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAbnormalOrderLists({ commit }, { entity_id,status,city_id,driver_name,customer_name,start_start_time,start_end_time,create_start_time,create_end_time }){
      return new Promise((resolve, reject) => {
        getAbnormalOrderLists({ entity_id,status,city_id,driver_name,customer_name,start_start_time,start_end_time,create_start_time,create_end_time }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    forcedEndOrder({ commit },{ entity_id }){
      return new Promise((resolve, reject) => {
        forcedEndOrder({ entity_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //订单结算列表
    getSettleHost({ commit }){
      return new Promise((resolve, reject) => {
        getSettleHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getSettleOrderLists({ commit }, { id,order_entity_id,driver_name,customer_name,driver_tel,driver_settle_status,customer_settle_status,start_time,end_time,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getSettleOrderLists({ id,order_entity_id,driver_name,customer_name,driver_tel,driver_settle_status,customer_settle_status,start_time,end_time,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    preDriverSettle({ commit },{ id }){
      return new Promise((resolve, reject) => {
        preDriverSettle({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    driverSettle({ commit },{ id,order_amount,driver_amount,plat_amount,driver_settle_comment }){
      return new Promise((resolve, reject) => {
        driverSettle({ id,order_amount,driver_amount,plat_amount,driver_settle_comment }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //司机账单
    getDriverReconciliayionLists({ commit },{ id,name,telephone,start_time,end_time,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getDriverReconciliayionLists({ id,name,telephone,start_time,end_time,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delDriverReconciliation({ commit },{ id }){
      return new Promise((resolve, reject) => {
        delDriverReconciliation({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    createDriverReconciliation({ commit },{ driver_id,start_date,end_date }){
      return new Promise((resolve, reject) => {
        createDriverReconciliation({ driver_id,start_date,end_date }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDriverId({ commit },{ name,telephone }){
      return new Promise((resolve, reject) => {
        getDriverId({ name,telephone }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //司机钱包
    getDriverAmountLists({ commit }, { driver_id,id_name,telephone,offset,limit }){
      return new Promise((resolve, reject) => {
        getDriverAmountLists({ driver_id,id_name,telephone,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    rewardDriver({ commit }, { driver_id,amount,body }){
      return new Promise((resolve, reject) => {
        rewardDriver({ driver_id,amount,body }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    fineDriver({ commit }, { driver_id,amount,body }){
      return new Promise((resolve, reject) => {
        fineDriver({ driver_id,amount,body }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDriverInoutLists({ commit }, { driver_id,in_out,type,id_name,telephone,start_time,end_time,offset,limit }){
      return new Promise((resolve, reject) => {
        getDriverInoutLists({ driver_id,in_out,type,id_name,telephone,start_time,end_time,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //司机提现
    getDriverWithdrawHost({ commit }){
      return new Promise((resolve, reject) => {
        getDriverWithdrawHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDriverWithdrawLists({ commit }, { in_out_id,driver_id,withdraw_type,withdraw_status,id_name,telephone,start_time,end_time,offset,limit }){
      return new Promise((resolve, reject) => {
        getDriverWithdrawLists({ in_out_id,driver_id,withdraw_type,withdraw_status,id_name,telephone,start_time,end_time,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    manageDriverWithdraw({ commit }, { id,withdraw_comment,withdraw_img_path }){
      return new Promise((resolve, reject) => {
        manageDriverWithdraw({ id,withdraw_comment,withdraw_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    rejectDriverWithdraw({ commit }, { id,withdraw_comment,withdraw_img_path }){
      return new Promise((resolve, reject) => {
        rejectDriverWithdraw({ id,withdraw_comment,withdraw_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //客户对账单
    getCutsomerReconciliationHost({ commit }){
      return new Promise((resolve, reject) => {
        getCutsomerReconciliationHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    createCustomerReconciliation({ commit }, { customer_id,start_date,end_date }){
      return new Promise((resolve, reject) => {
        createCustomerReconciliation({ customer_id,start_date,end_date }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCustomerReconciliayionLists({ commit }, { id,name,telephone,pay_status,confirm_status,start_time,end_time,offset,limit }){
      return new Promise((resolve, reject) => {
        getCustomerReconciliayionLists({ id,name,telephone,pay_status,confirm_status,start_time,end_time,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    payCustomerReconciliation({ commit }, { id }){
      return new Promise((resolve, reject) => {
        payCustomerReconciliation({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    confirmCustomerReconciliation({ commit }, { id }){
      return new Promise((resolve, reject) => {
        confirmCustomerReconciliation({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delCustomerReconciliation({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delCustomerReconciliation({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCustomerId({ commit }, { name,telephone }){
      return new Promise((resolve, reject) => {
        getCustomerId({ name,telephone }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //财务记录
    getFinanceHost({ commit }){
      return new Promise((resolve, reject) => {
        getFinanceHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getFinanceLists({ commit }, { start_time,end_time,offset,limit }){
      return new Promise((resolve, reject) => {
        getFinanceLists({ start_time,end_time,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //车辆列表
    getCarLists({ commit }, { id,status,car_template_id,start_time,end_time,car_no,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getCarLists({ id,status,car_template_id,start_time,end_time,car_no,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addCar({ commit }, { status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }){
      return new Promise((resolve, reject) => {
        addCar({ status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editCar({ commit }, { id,status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }){
      return new Promise((resolve, reject) => {
        editCar({ id,status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delCar({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delCar({ id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    authCarStatus({ commit }, { id,status }){
      return new Promise((resolve, reject) => {
        authCarStatus({ id,status }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    bindingDriver({ commit }, { car_id,driver_id }){
      return new Promise((resolve, reject) => {
        bindingDriver({ car_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    unbindingDriver({ commit }, { car_id,driver_id }){
      return new Promise((resolve, reject) => {
        unbindingDriver({ car_id,driver_id }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //客户列表
    getCustomerLists({ commit }, { id,status,type,start_time,end_time,name,telephone,contact,search,offset,limit }){
      return new Promise((resolve, reject) => {
        getCustomerLists({ id,status,type,start_time,end_time,name,telephone,contact,search,offset,limit }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    addCustomer({ commit }, { status,type,name,telephone,address,comment,contact,email,bussiness_path,other_img_path }){
      return new Promise((resolve, reject) => {
        addCustomer({ status,type,name,telephone,address,comment,contact,email,bussiness_path,other_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    editCustomer({ commit }, { id,status,type,name,telephone,address,comment,amount,contact,email,bussiness_path,other_img_path }){
      return new Promise((resolve, reject) => {
        editCustomer({ id,status,type,name,telephone,address,comment,amount,contact,email,bussiness_path,other_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    authCustomerStatus({ commit }, { id,status,auth_comment }){
      return new Promise((resolve, reject) => {
        authCustomerStatus({ id,status,auth_comment }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    delCustomer({ commit }, { id }){
      return new Promise((resolve, reject) => {
        delCustomer({ id }).then(res => {
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
    setCompanyBaseConfig({ commit }, { company_name,telephone,address,address_location,bussiness_path,introduction,service_tel }){
      return new Promise((resolve, reject) => {
        setCompanyBaseConfig({ company_name,telephone,address,address_location,bussiness_path,introduction,service_tel }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDriverRegisterUrl({ commit }){
      return new Promise((resolve, reject) => {
        getDriverRegisterUrl().then(res => {
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
    getTemplateHost({ commit }){
      return new Promise((resolve, reject) => {
        getTemplateHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //订单基础配置
    setCompanyOrderBaseConfig({ commit }, { pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time,order_amount_show,order_notice }){
      return new Promise((resolve, reject) => {
        setCompanyOrderBaseConfig({ pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time,order_amount_show,order_notice }).then(res => {
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
    //订单价格配置
    addOrderType({ commit }, { order_type,use_car_type_id,amount,status,limit_km,addition_amount, }){
      return new Promise((resolve, reject) => {
        addOrderType({ order_type,use_car_type_id,amount,status,limit_km,addition_amount, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editOrderType({ commit }, { id,order_type,use_car_type_id,amount,status,limit_km,addition_amount }){
      return new Promise((resolve, reject) => {
        editOrderType({ id,order_type,use_car_type_id,amount,status,limit_km,addition_amount }).then(res => {
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
    //结算配置
    setCompanySettleConfig({ commit }, { change_order_amount,plat_amount_type,plat_amount,customer_cancel_amount,customer_cancel_time,auto_settle,withdraw_type,withdraw_date,withdraw_start_time,withdraw_end_time }){
      return new Promise((resolve, reject) => {
        setCompanySettleConfig({ change_order_amount,plat_amount_type,plat_amount,customer_cancel_amount,customer_cancel_time,auto_settle,withdraw_type,withdraw_date,withdraw_start_time,withdraw_end_time }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCompanySettleConfig({ commit }){
      return new Promise((resolve, reject) => {
        getCompanySettleConfig().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //员工配置
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

    editAdminUserNoPwdSuper({ commit }, { id,name,telephone,role,status, }){
      return new Promise((resolve, reject) => {
        editAdminUserNoPwdSuper({ id,name,telephone,role,status, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editAdminUserSuper({ commit }, { id,name,telephone,role,password,status, }){
      return new Promise((resolve, reject) => {
        editAdminUserSuper({ id,name,telephone,role,password,status, }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    editAdminUserNoPwd({ commit }, { id,name,telephone,role,permission,status, }){
      return new Promise((resolve, reject) => {
        editAdminUserNoPwd({ id,name,telephone,role,permission,status, }).then(res => {
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
    getAdminUserHost({ commit }){
      return new Promise((resolve, reject) => {
        getAdminUserHost().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCustomerInfo({ commit }){
      return new Promise((resolve, reject) => {
        getCustomerInfo().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setCustomer({ commit }, { name,type,telephone,address,contact,email,bussiness_path,other_img_path }){
      return new Promise((resolve, reject) => {
        setCustomer({ name,type,telephone,address,contact,email,bussiness_path,other_img_path }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getChangeCustomerPassword({ commit }, { password }){
      return new Promise((resolve, reject) => {
        getChangeCustomerPassword({ password }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOrderDescription({ commit }){
      return new Promise((resolve, reject) => {
        getOrderDescription().then(res => {
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
