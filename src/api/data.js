import axios from '@/libs/api.request'

export const checkLogin = () => {
  return axios.request({
    url: '/company/login/checkLogin',
    method: 'post'
  })
}

export const uploadPic = ({ base64Img }) => {
  const data = {
    base64Img
  }
  return axios.request({
    url: '/company/index/uploadImgBase64',
    data,
    method: 'post'
  })
}

export const getCompanyBaseConfig = () => {
  return axios.request({
    url: '/company/company/getCompanyBaseConfig',
    method: 'post'
  })
}

export const getDriverRegisterUrl = () => {
  return axios.request({
    url: '/company/company/getDriverRegisterUrl',
    method: 'post'
  })
}


//首页工作台
export const getIndexHost = () => {
  return axios.request({
    url: '/company/index/getIndexHost',
    method: 'post'
  })
}

export const getIndexLists = ({ start_time,end_time,date_type }) => {
  const data = {
    start_time,
    end_time,
    date_type
  }
  return axios.request({
    url: '/company/index/getIndexLists',
    data,
    method: 'post'
  })
}

//加盟司机
export const getDriverHost = () => {
  return axios.request({
    url: '/company/driver/getDriverHost',
    method: 'post'
  })
}

export const getDriverLists = ({ id,fleet_id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }) => {
  const data = {
    id,
    fleet_id,
    status,
    city_id,
    start_time,
    end_time,
    id_name,
    telephone,
    auth_status,
    is_binding,
    is_server,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/driver/getDriverLists',
    data,
    method: 'post'
  })
}

export const addDriver = ({ auth_status,telephone,city_id,header_img_path,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }) => {
  const data = {
    auth_status,
    telephone,
    city_id,
    header_img_path,
    id_name,
    id_no,
    id_img_path,
    driver_name,
    driver_get_date,
    driver_type,
    driver_img_path,
    net_driver_img_path,
    status,
    id_sex,
    id_address,
    id_back_img_path,
    driver_no,
    driver_valid_date,
    driver_copy_img_path,
    net_car_img_path
  }
  return axios.request({
    url: '/company/driver/addDriver',
    data,
    method: 'post'
  })
}

export const editDriver = ({ id,auth_status,city_id,telephone,id_name,id_no,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,header_img_path,status,id_sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }) => {
  const data = {
    id,
    auth_status,
    city_id,
    telephone,
    id_name,
    id_no,
    id_img_path,
    driver_name,
    driver_get_date,
    driver_type,
    driver_img_path,
    net_driver_img_path,
    header_img_path,
    status,
    id_sex,
    id_address,
    id_back_img_path,
    driver_no,
    driver_valid_date,
    driver_copy_img_path,
    net_car_img_path
  }
  return axios.request({
    url: '/company/driver/editDriver',
    data,
    method: 'post'
  })
}

export const delDriver = ({ id }) => {
  const data = {
    id,
  }
  return axios.request({
    url: '/company/driver/delDriver',
    data,
    method: 'post'
  })
}

export const bindingCar = ({ car_id,driver_id }) => {
  const data = {
    car_id,
    driver_id
  }
  return axios.request({
    url: '/company/driver/bindingCar',
    data,
    method: 'post'
  })
}

export const unbindingCar = ({ car_id,driver_id }) => {
  const data = {
    car_id,
    driver_id
  }
  return axios.request({
    url: '/company/driver/unbindingCar',
    data,
    method: 'post'
  })
}

export const authDriverStatus = ({ id,auth_status,is_server,auth_comment }) => {
  const data = {
    id,
    auth_status,
    is_server,
    auth_comment,
  }
  return axios.request({
    url: '/company/driver/authDriverStatus',
    data,
    method: 'post'
  })
}


export const editDriverStatus = ({ id,status,server_comment }) => {
  const data = {
    id,
    status,
    server_comment
  }
  return axios.request({
    url: '/company/driver/editDriverStatus',
    data,
    method: 'post'
  })
}

//车队管理
export const getFleetLists = ({ id,status,fleet_no,fleet_name,search,offset,limit }) => {
  const data = {
    id,
    status,
    fleet_no,
    fleet_name,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/driver/getFleetLists',
    data,
    method: 'post'
  })
}

export const addMemberToFleet = ({ fleet_id,driver_id }) => {
  const data = {
    fleet_id,
    driver_id
  }
  return axios.request({
    url: '/company/driver/addMemberToFleet',
    data,
    method: 'post'
  })
}

export const removeMemberToFleet = ({ fleet_id,driver_id }) => {
  const data = {
    fleet_id,
    driver_id
  }
  return axios.request({
    url: '/company/driver/removeMemberToFleet',
    data,
    method: 'post'
  })
}


export const getCanJoinFleetDriverLists = ({ id,search,offset,limit }) => {
  const data = {
    id,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/driver/getCanJoinFleetDriverLists',
    data,
    method: 'post'
  })
}


export const delFleet = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/driver/delFleet',
    data,
    method: 'post'
  })
}

export const addFleet = ({ fleet_name,comment,logo_path,max_member,status }) => {
  const data = {
    fleet_name,
    comment,
    logo_path,
    max_member,
    status
  }
  return axios.request({
    url: '/company/driver/addFleet',
    data,
    method: 'post'
  })
}

export const editFleet = ({ id,fleet_name,comment,logo_path,max_member,status }) => {
  const data = {
    id,
    fleet_name,
    comment,
    logo_path,
    max_member,
    status
  }
  return axios.request({
    url: '/company/driver/editFleet',
    data,
    method: 'post'
  })
}

//订单管理
export const getOrderHost = () => {
  return axios.request({
    url: '/company/order/getOrderHost',
    method: 'post'
  })
}

export const getWorkReminder = () => {
  return axios.request({
    url: '/company/index/getWorkReminder',
    method: 'post'
  })
}

export const getOrderLists = ({ id,entity_id,customer_id,city_id,use_car_type_id,status,other_status,start_start_time,start_end_time,create_start_time,create_end_time,driver_name,customer_name,passenger_tel,offset,limit }) => {
  const data = {
    id,
    entity_id,
    customer_id,
    city_id,
    use_car_type_id,
    status,
    other_status,
    start_start_time,
    start_end_time,
    create_start_time,
    create_end_time,
    driver_name,
    customer_name,
    passenger_tel,
    offset,
    limit
  }
  return axios.request({
    url: '/company/order/getOrderLists',
    data,
    method: 'post'
  })
}

export const cancelOrder = ({ entity_id }) => {
  const data = {
    entity_id
  }
  return axios.request({
    url: '/company/order/cancelOrder',
    data,
    method: 'post'
  })
}

export const getOrderDriverLists = ({ order_id,key_words,car_color }) => {
  const data = {
    order_id,
    key_words,
    car_color 
  }
  return axios.request({
    url: '/company/driver/getOrderDriverLists',
    data,
    method: 'post'
  })
}

export const getOrderInfo = ({ order_id }) => {
  const data = {
    order_id
  }
  return axios.request({
    url: '/company/order/getOrderInfo',
    data,
    method: 'post'
  })
}

export const orderToDriver = ({ entity_id,driver_id }) => {
  const data = {
    entity_id,
    driver_id
  }
  return axios.request({
    url: '/company/order/orderToDriver',
    data,
    method: 'post'
  })
}

export const changeOrderToGrab = ({ entity_id }) => {
  const data = {
    entity_id
  }
  return axios.request({
    url: '/company/order/changeOrderToGrab',
    data,
    method: 'post'
  })
}

export const checkOrderGetAmount = ({ order_type,use_car_type_id,city_id,customer_id,start_date,start_time,start_location,end_location }) => {
  const data = {
    order_type,
    use_car_type_id,
    city_id,
    customer_id,
    start_date,
    start_time,
    start_location,
    end_location
  }
  return axios.request({
    url: '/company/order/checkOrderGetAmount',
    data,
    method: 'post'
  })
}

export const addOrder = ({ order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }) => {
  const data = {
    order_type,
    use_car_type_id,
    start_date,
    start_time,
    city_id,
    customer_id,
    start_address,
    start_location,
    end_address,
    end_location,
    plat_amount,
    amount,
    driver_amount,
    passenger_name,
    passenger_tel,
    comment,
    distance
  }
  return axios.request({
    url: '/company/order/addOrder',
    data,
    method: 'post'
  })
}

export const editOrder = ({ id,order_type,use_car_type_id,start_date,start_time,city_id,customer_id,start_address,start_location,end_address,end_location,plat_amount,amount,driver_amount,passenger_name,passenger_tel,comment,distance }) => {
  const data = {
    id,
    order_type,
    use_car_type_id,
    start_date,
    start_time,
    city_id,
    customer_id,
    start_address,
    start_location,
    end_address,
    end_location,
    plat_amount,
    amount,
    driver_amount,
    passenger_name,
    passenger_tel,
    comment,
    distance
  }
  return axios.request({
    url: '/company/order/editOrder',
    data,
    method: 'post'
  })
}


//改派订单
export const getResaaignHost = () => {
  return axios.request({
    url: '/company/order/getResaaignHost',
    method: 'post'
  })
}

export const getReassignApplyLists = ({ order_id,order_entity_id,city_id,reassign_manage_status,start_time,end_time,driver_name,customer_name,passenger_tel,offset,limit }) => {
  const data = {
    order_id,
    order_entity_id,
    city_id,
    reassign_manage_status,
    start_time,
    end_time,
    driver_name,
    customer_name,
    passenger_tel,
    offset,
    limit
  }
  return axios.request({
    url: '/company/order/getReassignApplyLists',
    data,
    method: 'post'
  })
}

export const reassignOrder = ({ entity_id }) => {
  const data = {
    entity_id
  }
  return axios.request({
    url: '/company/order/reassignOrder',
    data,
    method: 'post'
  })
}

export const rejectReassignApply = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/order/rejectReassignApply',
    data,
    method: 'post'
  })
}


//异常订单
export const getAbnormalHost = () => {
  return axios.request({
    url: '/company/order/getAbnormalHost',
    method: 'post'
  })
}

export const getAbnormalOrderLists = ({ entity_id,status,city_id,driver_name,customer_name,start_start_time,start_end_time,create_start_time,create_end_time }) => {
  const data = {
    entity_id,
    status,
    city_id,
    driver_name,
    customer_name,
    start_start_time,
    start_end_time,
    create_start_time,
    create_end_time
  }
  return axios.request({
    url: '/company/order/getAbnormalOrderLists',
    data,
    method: 'post'
  })
}

export const forcedEndOrder = ({ entity_id }) => {
  const data = {
    entity_id
  }
  return axios.request({
    url: '/company/order/forcedEndOrder',
    data,
    method: 'post'
  })
}

//订单结算列表
export const getSettleHost = () => {
  return axios.request({
    url: '/company/settlement/getSettleHost',
    method: 'post'
  })
}

export const getSettleOrderLists = ({ id,order_entity_id,driver_name,customer_name,driver_tel,driver_settle_status,customer_settle_status,start_time,end_time,search,offset,limit }) => {
  const data = {
    id,
    order_entity_id,
    driver_name,
    customer_name,
    driver_tel,
    driver_settle_status,
    customer_settle_status,
    start_time,
    end_time,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getSettleOrderLists',
    data,
    method: 'post'
  })
}

export const preDriverSettle = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/settlement/preDriverSettle',
    data,
    method: 'post'
  })
}

export const driverSettle = ({ id,order_amount,driver_amount,plat_amount,driver_settle_comment }) => {
  const data = {
    id,
    order_amount,
    driver_amount,
    plat_amount,
    driver_settle_comment
  }
  return axios.request({
    url: '/company/settlement/driverSettle',
    data,
    method: 'post'
  })
}

export const getDriverReconciliayionLists = ({ id,name,telephone,start_time,end_time,search,offset,limit }) => {
  const data = {
    id,
    name,
    telephone,
    start_time,
    end_time,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getDriverReconciliayionLists',
    data,
    method: 'post'
  })
}

export const delDriverReconciliation = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/settlement/delDriverReconciliation',
    data,
    method: 'post'
  })
}


export const createDriverReconciliation = ({ driver_id,start_date,end_date }) => {
  const data = {
    driver_id,
    start_date,
    end_date
  }
  return axios.request({
    url: '/company/settlement/createDriverReconciliation',
    data,
    method: 'post'
  })
}

export const getDriverId = ({ name,telephone }) => {
  const data = {
    name,
    telephone
  }
  return axios.request({
    url: '/company/driver/getDriverId',
    data,
    method: 'post'
  })
}


//司机钱包
export const getDriverAmountLists = ({ driver_id,id_name,telephone,offset,limit }) => {
  const data = {
    driver_id,
    id_name,
    telephone,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getDriverAmountLists',
    data,
    method: 'post'
  })
}

export const rewardDriver = ({ driver_id,amount,body }) => {
  const data = {
    driver_id,
    amount,
    body
  }
  return axios.request({
    url: '/company/settlement/rewardDriver',
    data,
    method: 'post'
  })
}

export const fineDriver = ({ driver_id,amount,body }) => {
  const data = {
    driver_id,
    amount,
    body
  }
  return axios.request({
    url: '/company/settlement/fineDriver',
    data,
    method: 'post'
  })
}

export const getDriverInoutLists = ({ driver_id,in_out,type,id_name,telephone,start_time,end_time,offset,limit }) => {
  const data = {
    driver_id,
    in_out,
    type,
    id_name,
    telephone,
    start_time,
    end_time,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getDriverInoutLists',
    data,
    method: 'post'
  })
}

//司机提现
export const getDriverWithdrawHost = () => {
  return axios.request({
    url: '/company/settlement/getDriverWithdrawHost',
    method: 'post'
  })
}

export const getDriverWithdrawLists = ({ in_out_id,driver_id,withdraw_type,withdraw_status,id_name,telephone,start_time,end_time,offset,limit }) => {
  const data = {
    in_out_id,
    driver_id,
    withdraw_type,
    withdraw_status,
    id_name,
    telephone,
    start_time,
    end_time,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getDriverWithdrawLists',
    data,
    method: 'post'
  })
}

export const manageDriverWithdraw = ({ id,withdraw_comment,withdraw_img_path }) => {
  const data = {
    id,
    withdraw_comment,
    withdraw_img_path,
  }
  return axios.request({
    url: '/company/settlement/manageDriverWithdraw',
    data,
    method: 'post'
  })
}

export const rejectDriverWithdraw = ({ id,withdraw_comment,withdraw_img_path }) => {
  const data = {
    id,
    withdraw_comment,
    withdraw_img_path,
  }
  return axios.request({
    url: '/company/settlement/rejectDriverWithdraw',
    data,
    method: 'post'
  })
}

//客户对账单
export const getCutsomerReconciliationHost = () => {
  return axios.request({
    url: '/company/settlement/getCutsomerReconciliationHost',
    method: 'post'
  })
}

export const createCustomerReconciliation = ({ customer_id,start_date,end_date }) => {
  const data = {
    customer_id,
    start_date,
    end_date
  }
  return axios.request({
    url: '/company/settlement/createCustomerReconciliation',
    data,
    method: 'post'
  })
}

export const getCustomerReconciliayionLists = ({ id,name,telephone,pay_status,confirm_status,start_time,end_time,offset,limit }) => {
  const data = {
    id,
    name,
    telephone,
    pay_status,
    confirm_status,
    start_time,
    end_time,
    offset,
    limit
  }
  return axios.request({
    url: '/company/settlement/getCustomerReconciliayionLists',
    data,
    method: 'post'
  })
}

export const confirmCustomerReconciliation = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/settlement/confirmCustomerReconciliation',
    data,
    method: 'post'
  })
}

export const payCustomerReconciliation = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/settlement/payCustomerReconciliation',
    data,
    method: 'post'
  })
}


export const delCustomerReconciliation = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/settlement/delCustomerReconciliation',
    data,
    method: 'post'
  })
}

export const getCustomerId = ({ name,telephone }) => {
  const data = {
    name,
    telephone
  }
  return axios.request({
    url: '/company/customer/getCustomerId',
    data,
    method: 'post'
  })
}


//财务记录
export const getFinanceHost = () => {
  return axios.request({
    url: '/company/settlement/getFinanceHost',
    method: 'post'
  })
}

export const getFinanceLists = ({ start_time,end_time,offset,limit }) => {
  const data = {
    start_time,
    end_time,
    offset,limit
  }
  return axios.request({
    url: '/company/settlement/getFinanceLists',
    data,
    method: 'post'
  })
}

//车辆管理
export const getCarLists = ({ id,status,car_template_id,start_time,end_time,car_no,search,offset,limit }) => {
  const data = {
    id,
    status,
    car_template_id,
    start_time,
    end_time,
    car_no,
    search,
    offset,
    limit,
  }
  return axios.request({
    url: '/company/car/getCarLists',
    data,
    method: 'post'
  })
}

export const addCar = ({ status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }) => {
  const data = {
    status,
    travel_img_path,
    car_no,
    owner,
    frame_no,
    engine_no,
    car_person_img_path,
    register_date,
    car_template_id,
    car_color
  }
  return axios.request({
    url: '/company/car/addCar',
    data,
    method: 'post'
  })
}

export const editCar = ({ id,status,travel_img_path,car_no,owner,frame_no,engine_no,car_person_img_path,register_date,car_template_id,car_color }) => {
  const data = {
    id,
    status,
    travel_img_path,
    car_no,
    owner,
    frame_no,
    engine_no,
    car_person_img_path,
    register_date,
    car_template_id,
    car_color
  }
  return axios.request({
    url: '/company/car/editCar',
    data,
    method: 'post'
  })
}

export const delCar = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/car/delCar',
    data,
    method: 'post'
  })
}


export const authCarStatus = ({ id,status }) => {
  const data = {
    id,
    status
  }
  return axios.request({
    url: '/company/car/authCarStatus',
    data,
    method: 'post'
  })
}

export const bindingDriver = ({ car_id,driver_id }) => {
  const data = {
    car_id,
    driver_id
  }
  return axios.request({
    url: '/company/car/bindingDriver',
    data,
    method: 'post'
  })
}

export const unbindingDriver = ({ car_id,driver_id }) => {
  const data = {
    car_id,
    driver_id
  }
  return axios.request({
    url: '/company/car/unbindingDriver',
    data,
    method: 'post'
  })
}

//客户列表
export const getCustomerLists = ({ id,status,type,start_time,end_time,name,telephone,contact,search,offset,limit }) => {
  const data = {
    id,
    status,
    type,
    start_time,
    end_time,
    name,
    telephone,
    contact,
    search,
    offset,
    limit
  }
  return axios.request({
    url: '/company/customer/getCustomerLists',
    data,
    method: 'post'
  })
}

export const addCustomer = ({ status,type,name,telephone,address,comment,contact,email,bussiness_path,other_img_path }) => {
  const data = {
    status,
    type,
    name,
    telephone,
    address,
    comment,
    contact,
    email,
    bussiness_path,
    other_img_path
  }
  return axios.request({
    url: '/company/customer/addCustomer',
    data,
    method: 'post'
  })
}

export const editCustomer = ({ id,status,type,name,telephone,address,comment,amount,contact,email,bussiness_path,other_img_path }) => {
  const data = {
    id,
    status,
    type,
    name,
    telephone,
    address,
    comment,
    amount,
    contact,
    email,
    bussiness_path,
    other_img_path
  }
  return axios.request({
    url: '/company/customer/editCustomer',
    data,
    method: 'post'
  })
}

export const authCustomerStatus = ({ id,status,auth_comment }) => {
  const data = {
    id,
    status,
    auth_comment
  }
  return axios.request({
    url: '/company/customer/authCustomerStatus',
    data,
    method: 'post'
  })
}

export const delCustomer = ({ id }) => {
  const data = {
    id,
  }
  return axios.request({
    url: '/company/customer/delCustomer',
    data,
    method: 'post'
  })
}

//公司信息配置
export const setCompanyBaseConfig = ({ company_name,telephone,address,address_location,bussiness_path,introduction,service_tel }) => {
  const data = {
    company_name,
    telephone,
    address,
    address_location,
    bussiness_path,
    introduction,
    service_tel,
  }
  return axios.request({
    url: '/company/company/setCompanyBaseConfig',
    data,
    method: 'post'
  })
}

export const getLngLat = ({ address }) => {
  return axios.request({
    url: 'https://restapi.amap.com/v3/geocode/geo?key=1dff6242050886eb0c3cc11303869e90&address='+address+'&output=JSON',
    method: 'get'
  })
}

export const changeLngLat = ({ lng,lat }) => {
  return axios.request({
    url: 'https://restapi.amap.com/v3/geocode/regeo?key=1dff6242050886eb0c3cc11303869e90&location='+lng+','+lat,
    method: 'get'
  })
}

//城市配置
export const addCompanyCity = ({ city,status }) => {
  const data = {
    city,
    status,
  }
  return axios.request({
    url: '/company/company/addCompanyCity',
    data,
    method: 'post'
  })
}

export const editCompanyCity = ({ id,status }) => {
  const data = {
    id,
    status,
  }
  return axios.request({
    url: '/company/company/editCompanyCity',
    data,
    method: 'post'
  })
}

export const delCompanyCity = ({ id }) => {
  const data = {
    id,
  }
  return axios.request({
    url: '/company/company/delCompanyCity',
    data,
    method: 'post'
  })
}

export const getCompanyCityLists = ({ id,search,offset,limit,status }) => {
  const data = {
    id,
    search,
    offset,
    limit,
    status,
  }
  return axios.request({
    url: '/company/company/getCompanyCityLists',
    data,
    method: 'post'
  })
}

//车型配置
export const addUseCarType = ({ name,status }) => {
  const data = {
    name,
    status,
  }
  return axios.request({
    url: '/company/company/addUseCarType',
    data,
    method: 'post'
  })
}

export const editUseCarType = ({ id,name,status }) => {
  const data = {
    id,
    name,
    status,
  }
  return axios.request({
    url: '/company/company/editUseCarType',
    data,
    method: 'post'
  })
}

export const delUseCarType = ({ id }) => {
  const data = {
    id,
  }
  return axios.request({
    url: '/company/company/delUseCarType',
    data,
    method: 'post'
  })
}

export const getUseCarTypeLists = ({ id,status,search,offset,limit }) => {
  const data = {
    id,
    status,
    search,
    offset,
    limit,
  }
  return axios.request({
    url: '/company/company/getUseCarTypeLists',
    data,
    method: 'post'
  })
}

export const addCarTemplate = ({ use_car_type_id,brand,model,status }) => {
  const data = {
    use_car_type_id,
    brand,
    model,
    status,
  }
  return axios.request({
    url: '/company/company/addCarTemplate',
    data,
    method: 'post'
  })
}

export const editCarTemplate = ({ id,use_car_type_id,brand,model,status }) => {
  const data = {
    id,
    use_car_type_id,
    brand,
    model,
    status
  }
  return axios.request({
    url: '/company/company/editCarTemplate',
    data,
    method: 'post'
  })
}

export const delCarTemplate = ({ id }) => {
  const data = {
    id
  }
  return axios.request({
    url: '/company/company/delCarTemplate',
    data,
    method: 'post'
  })
}

export const getCarTemplateLists = ({ id,status,use_car_type_id,search,offset,limit }) => {
  const data = {
    id,
    status,
    use_car_type_id,
    search,
    offset,
    limit,
  }
  return axios.request({
    url: '/company/company/getCarTemplateLists',
    data,
    method: 'post'
  })
}

export const getTemplateHost = () => {
  return axios.request({
    url: '/company/company/getTemplateHost',
    method: 'post'
  })
}

//订单基础配置
export const setCompanyOrderBaseConfig = ({ pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time,order_amount_show,order_notice }) => {
  const data = {
    pre_create_order_limit_time,
    pre_create_order_time,
    create_order_start_time,
    create_order_end_time,
    create_order_notice,
    is_auto_change_order,
    create_order_notice_time,
    auto_change_order_time,
    order_wait_limit_time,
    driver_mess_order_notice,
    distance_order_start_time,
    is_allow_driver_change_order,
    can_change_order_time,
    order_amount_show,
    order_notice
  }
  return axios.request({
    url: '/company/company/setCompanyOrderBaseConfig',
    data,
    method: 'post'
  })
}

export const getCompanyOrderBaseConfig = () => {
  return axios.request({
    url: '/company/company/getCompanyOrderBaseConfig',
    method: 'post'
  })
}

//订单价格配置
export const addOrderType = ({ order_type,use_car_type_id,amount,status,limit_km,addition_amount, }) => {
  const data = {
    order_type,
    use_car_type_id,
    amount,
    status,
    limit_km,
    addition_amount,
  }
  return axios.request({
    url: '/company/company/addOrderType',
    data,
    method: 'post'
  })
}

export const editOrderType = ({ id,order_type,use_car_type_id,amount,status,limit_km,addition_amount }) => {
  const data = {
    id,
    order_type,
    use_car_type_id,
    amount,
    status,
    limit_km,
    addition_amount
  }
  return axios.request({
    url: '/company/company/editOrderType',
    data,
    method: 'post'
  })
}

export const getOrderTypeLists = ({ id,status,use_car_type_id,order_type,offset,limit,type, }) => {
  const data = {
    id,
    status,
    use_car_type_id,
    order_type,
    offset,
    limit,
    type,
  }
  return axios.request({
    url: '/company/company/getOrderTypeLists',
    data,
    method: 'post'
  })
}
//结算配置
export const setCompanySettleConfig = ({ change_order_amount,plat_amount_type,plat_amount,customer_cancel_amount,customer_cancel_time,auto_settle,withdraw_type,withdraw_date,withdraw_start_time,withdraw_end_time }) => {
  const data = {
    change_order_amount,
    plat_amount_type,
    plat_amount,
    customer_cancel_amount,
    customer_cancel_time,
    auto_settle,
    withdraw_type,
    withdraw_date,
    withdraw_start_time,
    withdraw_end_time
  }
  return axios.request({
    url: '/company/company/setCompanySettleConfig',
    data,
    method: 'post'
  })
}

export const getCompanySettleConfig = () => {
  return axios.request({
    url: '/company/company/getCompanySettleConfig',
    method: 'post'
  })
}
//员工配置
export const getPermissionLists = () => {
  return axios.request({
    url: '/company/company/getPermissionLists',
    method: 'post'
  })
}

export const addAdminUser = ({ name,telephone,role,password,permission,status, }) => {
  const data = {
    name,
    telephone,
    role,
    password,
    permission,
    status,
  }
  return axios.request({
    url: '/company/company/addAdminUser',
    data,
    method: 'post'
  })
}

export const editAdminUser = ({ id,name,telephone,role,password,permission,status, }) => {
  const data = {
    id,
    name,
    telephone,
    role,
    password,
    permission,
    status,
  }
  return axios.request({
    url: '/company/company/editAdminUser',
    data,
    method: 'post'
  })
}

export const editAdminUserNoPwdSuper = ({ id,name,telephone,role,status, }) => {
  const data = {
    id,
    name,
    telephone,
    role,
    status,
  }
  return axios.request({
    url: '/company/company/editAdminUser',
    data,
    method: 'post'
  })
}

export const editAdminUserSuper = ({ id,name,telephone,role,password,status, }) => {
  const data = {
    id,
    name,
    telephone,
    role,
    password,
    status,
  }
  return axios.request({
    url: '/company/company/editAdminUser',
    data,
    method: 'post'
  })
}

export const editAdminUserNoPwd = ({ id,name,telephone,role,permission,status }) => {
  const data = {
    id,
    name,
    telephone,
    role,
    permission,
    status
  }
  return axios.request({
    url: '/company/company/editAdminUser',
    data,
    method: 'post'
  })
}


export const getAdminUserLists = ({ id,status,search,offset,limit, }) => {
  const data = {
    id,
    status,
    search,
    offset,
    limit,
  }
  return axios.request({
    url: '/company/company/getAdminUserLists',
    data,
    method: 'post'
  })
}

export const getAdminUserHost = () => {
  return axios.request({
    url: '/company/company/getAdminUserHost',
    method: 'post'
  })
}


export const getCustomerInfo = () => {
  return axios.request({
    url: '/company/customer/getCustomerInfo',
    method: 'post'
  })
}

export const setCustomer = ({ name,type,telephone,address,contact,email,bussiness_path,other_img_path }) => {
  const data = {
    name,
    type,
    telephone,
    address,
    contact,
    email,
    bussiness_path,
    other_img_path
  }
  return axios.request({
    url: '/company/customer/setCustomer',
    data,
    method: 'post'
  })
}


export const getChangeCustomerPassword = ({ password }) => {
  const data = {
    password,
  }
  return axios.request({
    url: '/company/customer/getChangeCustomerPassword',
    data,
    method: 'post'
  })
}

export const getOrderDescription = () => {

  return axios.request({
    url: '/company/customer/getOrderDescription',
    method: 'post'
  })
}

// export const getDriverList = ({ driverId,search,offset,limit,status,type,sex,driveType,authCustomerStatus,authCarType,authCarTemplateId,authCarStatus,noticeBt }) => {
//   const data = {
//     driverId,
//     search,
//     offset,
//     limit,
//     status,
//     type,
//     sex,
//     driveType,
//     authCustomerStatus,
//     authCarType,
//     authCarTemplateId,
//     authCarStatus,
//     noticeBt,
//   }
//   return axios.request({
//     url: '/gd/company/getDriverList',
//     data,
//     method: 'post'
//   })
// }


