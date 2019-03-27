<template>
  <Layout style="height: 100%" class="main">
    <Header class="mainHeader">
      <Menu mode="horizontal" theme="dark" :active-name="app.topMenuName" ref="menuRef" @on-select="changeManage" :style="{background:'#26394E'}">
          <div class="layout-nav">
              <div class="menuIcon">
                <img :src="diuberLogo" />
                <span>嘀友用车</span>
              </div>
              <MenuItem name="1">工作台统计</MenuItem>
              <MenuItem name="2" v-if="driver_show">司机管理</MenuItem>
              <MenuItem name="3" v-if="indent_show">订单管理</MenuItem>
              <MenuItem name="4" v-if="count_show">结算管理</MenuItem>
              <MenuItem name="5" v-if="car_show">车辆管理</MenuItem>
              <MenuItem name="6" v-if="cus_show">客户管理</MenuItem>
              <MenuItem name="7" v-if="configure_show">配置管理</MenuItem>
          </div>
          <header-bar :collapsed="collapsed" >
            <user :message-unread-count="unreadCount" />
          </header-bar>
      </Menu>
    </Header>

    <Modal
      v-model="teamDriverModal"
      title="退出确认"
      @on-ok="okQuit"
      @on-cancel="cancelQuit">
      <p style="color:#f10215;font-size: 16px;">是否退出新增加盟司机操作!</p>
    </Modal>
    
    <Layout>
      <transition name='fade'>
        <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" v-show="app.siderShow" >
          <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList"></side-menu>
        </Sider>
      </transition>
      <Layout class="main-layout-con">
        <Content class="main-content-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Content>
      </Layout>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import { mapMutations, mapActions, mapState } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import diuberLogo from '@/assets/images/logo-min.jpg'
import { Layout,Sider,Menu,MenuItem,Modal } from 'iview'

import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    User,
    ABackTop,
    Layout,
    Sider,
    Menu,
    MenuItem,
    Modal,
  },
  data () {
    return {
      diuberLogo,
      collapsed: false,
      teamDriverModal:false,
      routerNext:'',
      driver_show:false,
      indent_show:false,
      count_show:false,
      car_show:false,
      cus_show:false,
      configure_show:false,
    }
  },
  computed: {
    ...mapState([
        'app',
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setHomeRoute',
      'closeTag',
      'setAccess',
      'setMenuName'
    ]),
    ...mapActions([
      'hideSider',
    ]),
    okQuit(){
      this.teamDriverModal = false;
      this.routerNext();
    },
    cancelQuit(){
      this.teamDriverModal = false;
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }

      let new_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
       if(new_arr[0] === '9999'){
          this.$router.push({
            name,
            params,
            query
          })
       }else{
         let permission_val = '';
         if(name === 'driverManage'){
           if(new_arr[2000]){
             for(let i=0; i<new_arr[2000].length; i++){
               if(new_arr[2000][i] === '2001'){
                 permission_val = 2001
               }
             }

             if(permission_val === 2001){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'motorcadeManage'){
           if(new_arr[4000]){
             for(let i=0; i<new_arr[4000].length; i++){
               if(new_arr[4000][i] === '4007'){
                 permission_val = 4007
               }
             }

             if(permission_val === 4007){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'indentManage' || name === 'reassign_indent' || name === 'unusual_indent'){
           if(new_arr[5000]){
             for(let i=0; i<new_arr[5000].length; i++){
               if(new_arr[5000][i] === '5003'){
                 permission_val = 5003
               }
             }

             if(permission_val === 5003){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'countList'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6001'){
                 permission_val = 6001
               }
             }

             if(permission_val === 6001){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'driverBill'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6002'){
                 permission_val = 6002
               }
             }

             if(permission_val === 6002){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'driverWallet'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6010'){
                 permission_val = 6010
               }
             }

             if(permission_val === 6010){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'withdraw'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6003'){
                 permission_val = 6003
               }
             }

             if(permission_val === 6003){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'createBill'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6006'){
                 permission_val = 6006
               }
             }

             if(permission_val === 6006){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'financeRecord'){
           if(new_arr[6000]){
             for(let i=0; i<new_arr[6000].length; i++){
               if(new_arr[6000][i] === '6013'){
                 permission_val = 6013
               }
             }

             if(permission_val === 6013){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'vehicleList'){
           if(new_arr[3000]){
             for(let i=0; i<new_arr[3000].length; i++){
               if(new_arr[3000][i] === '3003'){
                 permission_val = 3003
               }
             }

             if(permission_val === 3003){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'customerList'){
           if(new_arr[1000]){
             for(let i=0; i<new_arr[1000].length; i++){
               if(new_arr[1000][i] === '1002'){
                 permission_val = 1002
               }
             }

             if(permission_val === 1002){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'companyInfo'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7001'){
                 permission_val = 7001
               }
             }

             if(permission_val === 7001){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'city'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7006'){
                 permission_val = 7006
               }
             }

             if(permission_val === 7006){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'useCarType' || name === 'brandType'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7002'){
                 permission_val = 7002
               }
             }

             if(permission_val === 7002){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'indentDefaultConfigure' || name === 'indentDefaultConfigure'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7003'){
                 permission_val = 7003
               }
             }

             if(permission_val === 7003){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'countConfigure'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7004'){
                 permission_val = 7004
               }
             }

             if(permission_val === 7004){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }else if(name === 'staffConfigure'){
           if(new_arr[7000]){
             for(let i=0; i<new_arr[7000].length; i++){
               if(new_arr[7000][i] === '7005'){
                 permission_val = 7005
               }
             }

             if(permission_val === 7005){
                this.$router.push({
                  name,
                  params,
                  query
                })
             }else{
                this.$Notice.warning({
                    title: '嘀友提醒',
                    desc: '暂无权限访问！'
                });
             }
           }else{
              this.$Notice.warning({
                  title: '嘀友提醒',
                  desc: '暂无权限访问！'
              });
           }
         }
         
       }
      
    },
    handleCloseTag (res, type, route) {
      
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName);
          this.hideSider({
            siderShowType:false,
            menuName:"1"
          });
          this.setMenuName('1')
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }

      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
      if(item.meta.menuType === 1){
        this.setMenuName('1')
        this.hideSider({
          siderShowType:false,
          menuName:"1"
        })
      }else if(item.meta.menuType === 2){
        this.setMenuName('2')
        this.hideSider({
          siderShowType:true,
          menuName:"2"
        })
      }else if(item.meta.menuType === 3){
        this.setMenuName('3')
        this.hideSider({
          siderShowType:true,
          menuName:"3"
        })
      }else if(item.meta.menuType === 4){
        this.setMenuName('4')
        this.hideSider({
          siderShowType:true,
          menuName:"4"
        })
      }else if(item.meta.menuType === 5){
        this.setMenuName('5')
        this.hideSider({
          siderShowType:true,
          menuName:"5"
        })
      }else if(item.meta.menuType === 6){
        this.setMenuName('6')
        this.hideSider({
          siderShowType:true,
          menuName:"6"
        })
      }
    },
    changeManage (name){
      this.setMenuName(name)
      if(parseInt(name) === 1){
        this.$router.push({path:'/home'});
        this.hideSider({
          siderShowType:false,
          menuName:"1"
        });
      }else if(parseInt(name) === 2){
        this.hideSider({
          siderShowType:true,
          menuName:"2"
        })
        this.setAccess(['leagueCheck'])
      }else if(parseInt(name) === 3){
        this.hideSider({
          siderShowType:true,
          menuName:"3"
        })
        this.setAccess(['indentCheck'])
      }else if(parseInt(name) === 4){
        this.hideSider({
          siderShowType:true,
          menuName:"4"
        })
        this.setAccess(['countCheck'])
      }else if(parseInt(name) === 5){
        this.hideSider({
          siderShowType:true,
          menuName:"5"
        })
        this.setAccess(['vehicleCheck'])
      }else if(parseInt(name) === 6){
        this.hideSider({
          siderShowType:true,
          menuName:"6"
        })
        this.setAccess(['customerCheck'])
      }else if(parseInt(name) === 7){
        this.hideSider({
          siderShowType:true,
          menuName:"7"
        })
        this.setAccess(['configureCheck'])
      }
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    },
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }

    if(window.localStorage.getItem('SiderShow')){
      this.app.siderShow = JSON.parse(window.localStorage.getItem('SiderShow'));
    }
    
    if(window.localStorage.getItem('MenuName')){
      this.app.topMenuName = window.localStorage.getItem('MenuName')
    }

    let new_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))

    if(new_arr[0] === '9999'){
      this.driver_show = true;
      this.indent_show = true;
      this.count_show = true;
      this.car_show = true;
      this.cus_show = true;
      this.configure_show = true;
    }else{

      if(new_arr[2000]){
        this.driver_show = true;
      }

      if(new_arr[5000]){
        this.indent_show = true;
      }

      if(new_arr[6000]){
        this.count_show = true;
      }

      if(new_arr[3000]){
        this.car_show = true;
      }

      if(new_arr[1000]){
        this.cus_show = true;
      }

      if(new_arr[7000]){
        this.configure_show = true;
      }

    }
    
  },
  beforeRouteLeave (to, from, next) {
    if(from.name === 'newEditDriver' && !from.query.id){
      this.teamDriverModal = true;
      this.routerNext = next;
    }else{
      next()
    }
  },
}
</script>

