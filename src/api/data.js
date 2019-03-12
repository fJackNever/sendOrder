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

//加盟司机
export const getDriverLists = ({ id,status,city_id,start_time,end_time,id_name,telephone,auth_status,is_binding,is_server,search,offset,limit }) => {
  const data = {
    id,
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

export const editDriver = ({ id,auth_status,city_id,telephone,idName,idNo,id_img_path,driver_name,driver_get_date,driver_type,driver_img_path,net_driver_img_path,header_img_path,status,sex,id_address,id_back_img_path,driver_no,driver_valid_date,driver_copy_img_path,net_car_img_path }) => {
  const data = {
    id,
    auth_status,
    city_id,
    telephone,
    idName,
    idNo,
    id_img_path,
    driver_name,
    driver_get_date,
    driver_type,
    driver_img_path,
    net_driver_img_path,
    header_img_path,
    status,
    sex,
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

//公司信息配置
export const setCompanyBaseConfig = ({ company_name,telephone,address,address_location,bussiness_path,introduction }) => {
  const data = {
    company_name,
    telephone,
    address,
    address_location,
    bussiness_path,
    introduction,
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

export const setCompanyOrderBaseConfig = ({ pre_create_order_limit_time,pre_create_order_time,create_order_start_time,create_order_end_time,create_order_notice,is_auto_change_order,create_order_notice_time,auto_change_order_time,order_wait_limit_time,driver_mess_order_notice,distance_order_start_time,is_allow_driver_change_order,can_change_order_time }) => {
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
    can_change_order_time
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

export const editOrderType = ({ id,order_type,use_car_type_id,amount,status }) => {
  const data = {
    id,
    order_type,
    use_car_type_id,
    amount,
    status
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


