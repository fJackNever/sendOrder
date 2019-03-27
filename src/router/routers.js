import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },

  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
      requireIsLogin: true,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home',
          menuType:1,
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInBread: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'driverManage',
        name: 'driverManage',
        meta: {
          icon: 'md-contact',
          title: '加盟司机',
          menuType:2
        },
        component: () => import('@/view/driver/driverManage/driverManage.vue'),
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'checkDriver',
        name: 'checkDriver',
        meta: {
          title: '查看加盟司机',
          menuType:2
        },
        component: () => import('@/view/driver/driverManage/checkDriver.vue')
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'newDriver',
        name: 'newDriver',
        meta: {
          title: '新增加盟司机',
          menuType:2
        },
        component: () => import('@/view/driver/driverManage/newDriver.vue')
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'editDriver',
        name: 'editDriver',
        meta: {
          title: '修改加盟司机',
          menuType:2
        },
        component: () => import('@/view/driver/driverManage/editDriver.vue')
      },
    ]
  },

  // {
  //   path: '/league',
  //   name: 'league',
  //   meta: {
  //     hideInBread: true,
  //     access:['leagueCheck'],
  //     requireIsLogin: true,
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'expandManage',
  //       name: 'expandManage',
  //       meta: {
  //         icon: 'md-megaphone',
  //         title: '加盟推广',
  //         menuType:2
  //       },
  //       component: () => import('@/view/driver/expandManage/expandManage.vue')
  //     },
  //   ]
  // },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInBread: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'motorcadeManage',
        name: 'motorcadeManage',
        meta: {
          icon: 'ios-car',
          title: '车队管理',
          menuType:2
        },
        component: () => import('@/view/driver/motorcadeManage/motorcadeManage.vue')
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'newMotorcade',
        name: 'newMotorcade',
        meta: {
          title: '创建车队',
          menuType:2
        },
        component: () => import('@/view/driver/motorcadeManage/newMotorcade.vue')
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'editMotorcade',
        name: 'editMotorcade',
        meta: {
          title: '修改车队',
          menuType:2
        },
        component: () => import('@/view/driver/motorcadeManage/editMotorcade.vue')
      },
    ]
  },

  {
    path: '/league',
    name: 'league',
    meta: {
      hideInMenu: true,
      access:['leagueCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'motorcadeAward',
        name: 'motorcadeAward',
        meta: {
          title: '车队奖励',
          menuType:2
        },
        component: () => import('@/view/driver/motorcadeManage/motorcadeAward.vue')
      },
    ]
  },
  

  // {
  //   path: '/league',
  //   name: 'league',
  //   meta: {
  //     hideInBread: true,
  //     access:['leagueCheck'],
  //     requireIsLogin: true,
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'driverLocation',
  //       name: 'driverLocation',
  //       meta: {
  //         icon: 'ios-contact-outline',
  //         title: '司机位置状态',
  //         menuType:2
  //       },
  //       component: () => import('@/view/driver/driverLocation/driverLocation.vue')
  //     },
  //   ]
  // },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInBread: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'indentManage',
        name: 'indentManage',
        meta: {
          icon: 'ios-list-box-outline',
          title: '订单管理',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/indentManage.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInMenu: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'new_indent',
        name: 'new_indent',
        meta: {
          title: '新增订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/new_indent.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInMenu: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'edit_indent',
        name: 'edit_indent',
        meta: {
          title: '修改订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/edit_indent.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInMenu: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'check_indent',
        name: 'check_indent',
        meta: {
          title: '查看订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/check_indent.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInBread: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'reassign_indent',
        name: 'reassign_indent',
        meta: {
          icon: 'ios-create-outline',
          title: '改派订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/reassign_indent.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInMenu: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'reassign_detail',
        name: 'reassign_detail',
        meta: {
          title: '改派详情',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/reassign_detail.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInBread: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'unusual_indent',
        name: 'unusual_indent',
        meta: {
          icon: 'ios-information-circle-outline',
          title: '异常订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/unusual/unusual_indent.vue')
      },
    ]
  },

  {
    path: '/indent',
    name: 'indent',
    meta: {
      hideInMenu: true,
      access:['indentCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'check_unusual',
        name: 'check_unusual',
        meta: {
          title: '查看异常订单',
          menuType:3
        },
        component: () => import('@/view/indent/indentManage/unusual/check_unusual.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'countList',
        name: 'countList',
        meta: {
          icon: 'ios-calculator',
          title: '订单结算列表',
          menuType:4
        },
        component: () => import('@/view/count/countManage/countList.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'driverBill',
        name: 'driverBill',
        meta: {
          icon: 'ios-paper-outline',
          title: '司机账单',
          menuType:4
        },
        component: () => import('@/view/count/countManage/driverBill.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInMenu: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'driver_bill_detail',
        name: 'driver_bill_detail',
        meta: {
          icon: 'ios-paper-outline',
          title: '司机账单详情',
          menuType:4
        },
        component: () => import('@/view/count/countManage/driver_bill_detail.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'driverWallet',
        name: 'driverWallet',
        meta: {
          icon: 'logo-yen',
          title: '司机钱包',
          menuType:4
        },
        component: () => import('@/view/count/countManage/driverWallet.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInMenu: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'get_pay_detail',
        name: 'get_pay_detail',
        meta: {
          icon: 'logo-yen',
          title: '司机收支详情',
          menuType:4
        },
        component: () => import('@/view/count/countManage/get_pay_detail.vue')
      },
    ]
  },
  

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'withdraw',
        name: 'withdraw',
        meta: {
          icon: 'md-card',
          title: '司机提现',
          menuType:4
        },
        component: () => import('@/view/count/countManage/withdraw.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInMenu: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'withdraw_detail',
        name: 'withdraw_detail',
        meta: {
          icon: 'logo-yen',
          title: '司机提现详情',
          menuType:4
        },
        component: () => import('@/view/count/countManage/withdraw_detail.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'createBill',
        name: 'createBill',
        meta: {
          icon: 'ios-copy-outline',
          title: '客户对账单',
          menuType:4
        },
        component: () => import('@/view/count/countManage/statement_account/createBill.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInMenu: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'edit_count',
        name: 'edit_count',
        meta: {
          title: '客户对账单详情',
          menuType:4
        },
        component: () => import('@/view/count/countManage/statement_account/edit_count.vue')
      },
    ]
  },

  {
    path: '/count',
    name: 'count',
    meta: {
      hideInBread: true,
      access:['countCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'financeRecord',
        name: 'financeRecord',
        meta: {
          icon: 'md-albums',
          title: '财务记录',
          menuType:4
        },
        component: () => import('@/view/count/countManage/financeRecord.vue')
      },
    ]
  },

  {
    path: '/vehicle',
    name: 'vehicle',
    meta: {
      hideInBread: true,
      access:['vehicleCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'vehicleList',
        name: 'vehicleList',
        meta: {
          icon: 'md-car',
          title: '车辆列表',
          menuType:5
        },
        component: () => import('@/view/vehicle/vehicleManage/vehicleList.vue')
      },
    ]
  },

  {
    path: '/vehicle',
    name: 'vehicle',
    meta: {
      hideInMenu: true,
      access:['vehicleCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'new_vehicle',
        name: 'new_vehicle',
        meta: {
          title: '新增车辆',
          menuType:5
        },
        component: () => import('@/view/vehicle/vehicleManage/new_vehicle.vue')
      },
    ]
  },

  {
    path: '/vehicle',
    name: 'vehicle',
    meta: {
      hideInMenu: true,
      access:['vehicleCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'edit_vehicle',
        name: 'edit_vehicle',
        meta: {
          title: '修改车辆',
          menuType:5
        },
        component: () => import('@/view/vehicle/vehicleManage/edit_vehicle.vue')
      },
    ]
  },

  {
    path: '/vehicle',
    name: 'vehicle',
    meta: {
      hideInMenu: true,
      access:['vehicleCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'check_vehicle',
        name: 'check_vehicle',
        meta: {
          title: '查看与审核车辆',
          menuType:5
        },
        component: () => import('@/view/vehicle/vehicleManage/check_vehicle.vue')
      },
    ]
  },

  {
    path: '/customer',
    name: 'customer',
    meta: {
      hideInBread: true,
      access:['customerCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'customerList',
        name: 'customerList',
        meta: {
          icon: 'md-contacts',
          title: '客户列表',
          menuType:6
        },
        component: () => import('@/view/customer/customerManage/customerList.vue')
      },
    ]
  },

  {
    path: '/customer',
    name: 'customer',
    meta: {
      hideInMenu: true,
      access:['customerCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'new_customer',
        name: 'new_customer',
        meta: {
          title: '新增客户',
          menuType:6
        },
        component: () => import('@/view/customer/customerManage/new_customer.vue')
      },
    ]
  },

  {
    path: '/customer',
    name: 'customer',
    meta: {
      hideInMenu: true,
      access:['customerCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'edit_customer',
        name: 'edit_customer',
        meta: {
          title: '修改客户',
          menuType:6
        },
        component: () => import('@/view/customer/customerManage/edit_customer.vue')
      },
    ]
  },

  // {
  //   path: '/customer',
  //   name: 'customer',
  //   meta: {
  //     hideInBread: true,
  //     access:['customerCheck'],
  //     requireIsLogin: true,
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'customerRecruit',
  //       name: 'customerRecruit',
  //       meta: {
  //         icon: 'md-add',
  //         title: '客户招募',
  //         menuType:6
  //       },
  //       component: () => import('@/view/customer/customerManage/customerRecruit.vue')
  //     },
  //   ]
  // },

  // {
  //   path: '/customer',
  //   name: 'customer',
  //   meta: {
  //     hideInBread: true,
  //     access:['customerCheck'],
  //     requireIsLogin: true,
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'customerAudit',
  //       name: 'customerAudit',
  //       meta: {
  //         icon: 'ios-search',
  //         title: '客户审核',
  //         menuType:6
  //       },
  //       component: () => import('@/view/customer/customerManage/customerAudit.vue')
  //     },
  //   ]
  // },

  {
    path: '/configure',
    name: 'configure',
    meta: {
      hideInBread: true,
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'companyInfo',
        name: 'companyInfo',
        meta: {
          icon: 'ios-podium',
          title: '公司信息配置',
          menuType:7
        },
        component: () => import('@/view/configure/companyInfo.vue')
      },
    ]
  },

  {
    path: '/configure',
    name: 'configure',
    meta: {
      hideInBread: true,
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'city',
        name: 'city',
        meta: {
          icon: 'md-pin',
          title: '城市配置',
          menuType:7
        },
        component: () => import('@/view/configure/city.vue')
      },
    ]
  },

  {
    path: '/carConfigure',
    name: 'carConfigure',
    meta: {
      icon: 'md-car',
      title: '车型配置',
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'useCarType',
        name: 'useCarType',
        meta: {
          title: '用车类型',
          menuType:7
        },
        component: () => import('@/view/configure/carType/useCarType.vue')
      },
      {
        path: 'brandType',
        name: 'brandType',
        meta: {
          title: '品牌车型',
          menuType:7
        },
        component: () => import('@/view/configure/carType/brandType.vue')
      },
    ]
  },

  {
    path: '/indentConfigure',
    name: 'indentConfigure',
    meta: {
      icon: 'ios-browsers-outline',
      title: '订单配置',
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'indentDefaultConfigure',
        name: 'indentDefaultConfigure',
        meta: {
          title: '订单基础配置',
          menuType:7
        },
        component: () => import('@/view/configure/indentConfigure/indentDefaultConfigure.vue')
      },
      {
        path: 'indentPriceConfigure',
        name: 'indentPriceConfigure',
        meta: {
          title: '订单价格配置',
          menuType:7
        },
        component: () => import('@/view/configure/indentConfigure/indentPriceConfigure.vue')
      },
    ]
  },

  {
    path: '/configure',
    name: 'configure',
    meta: {
      hideInBread: true,
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'countConfigure',
        name: 'countConfigure',
        meta: {
          icon: 'logo-yen',
          title: '结算配置',
          menuType:7
        },
        component: () => import('@/view/configure/count.vue')
      },
    ]
  },

  {
    path: '/configure',
    name: 'configure',
    meta: {
      hideInBread: true,
      access:['configureCheck'],
      requireIsLogin: true,
    },
    component: Main,
    children: [
      {
        path: 'staffConfigure',
        name: 'staffConfigure',
        meta: {
          icon: 'ios-person-outline',
          title: '员工配置',
          menuType:7
        },
        component: () => import('@/view/configure/staffConfigure.vue')
      },
    ]
  },

  // {
  //   path: '/appConfigure',
  //   name: 'appConfigure',
  //   meta: {
  //     icon: 'ios-phone-portrait',
  //     title: 'App配置',
  //     access:['configureCheck'],
  //     requireIsLogin: true,
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'noticeMsg',
  //       name: 'noticeMsg',
  //       meta: {
  //         title: '公告通知',
  //         menuType:7
  //       },
  //       component: () => import('@/view/configure/appConfigure/noticeMsg.vue')
  //     },
  //     {
  //       path: 'signIn',
  //       name: 'signIn',
  //       meta: {
  //         title: '每日签到',
  //         menuType:7
  //       },
  //       component: () => import('@/view/configure/appConfigure/signIn.vue')
  //     },
  //     {
  //       path: 'trainKnowledge',
  //       name: 'trainKnowledge',
  //       meta: {
  //         title: '培训知识',
  //         menuType:7
  //       },
  //       component: () => import('@/view/configure/appConfigure/trainKnowledge.vue')
  //     },
  //     {
  //       path: 'newsMsg',
  //       name: 'newsMsg',
  //       meta: {
  //         title: '新闻资讯',
  //         menuType:7
  //       },
  //       component: () => import('@/view/configure/appConfigure/newsMsg.vue')
  //     },
  //   ]
  // },

  // {
  //   path: '/tools_methods',
  //   name: 'tools_methods',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tools_methods_page',
  //       name: 'tools_methods_page',
  //       meta: {
  //         icon: 'ios-hammer',
  //         title: '工具方法',
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/tools-methods/tools-methods.vue')
  //     }
  //   ]
  // },

  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
