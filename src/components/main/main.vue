<template>
  <Layout style="height: 100%" class="main">
    <Header class="mainHeader">
      <Menu mode="horizontal" theme="dark" :active-name="menuName" ref="menuRef" @on-select="changeManage" :style="{background:'#26394E'}">
          <div class="layout-nav">
              <div class="menuIcon">
                <img :src="diuberLogo" />
                <span>嘀友用车</span>
              </div>
              <MenuItem name="1">工作台统计</MenuItem>
              <MenuItem name="2">司机管理</MenuItem>
              <MenuItem name="3">订单管理</MenuItem>
              <MenuItem name="4">结算管理</MenuItem>
              <MenuItem name="5">车辆管理</MenuItem>
              <MenuItem name="6">客户管理</MenuItem>
              <MenuItem name="7">配置管理</MenuItem>
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
      menuName:"1",
      teamDriverModal:false,
      routerNext:'',
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
      'setAccess'
    ]),
    ...mapActions([
      'hideSider'
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
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCloseTag (res, type, route) {
      
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName);
          this.hideSider({
            siderShowType:false,
            menuName:"1"
          });
          this.menuName = "1"
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
        this.menuName = "1";
        this.hideSider({
          siderShowType:false,
          menuName:"1"
        })
      }else if(item.meta.menuType === 2){
        this.menuName = "2";
        this.hideSider({
          siderShowType:true,
          menuName:"2"
        })
      }else if(item.meta.menuType === 3){
        this.menuName = "3";
        this.hideSider({
          siderShowType:true,
          menuName:"3"
        })
      }else if(item.meta.menuType === 4){
        this.menuName = "4";
        this.hideSider({
          siderShowType:true,
          menuName:"4"
        })
      }else if(item.meta.menuType === 5){
        this.menuName = "5";
        this.hideSider({
          siderShowType:true,
          menuName:"5"
        })
      }else if(item.meta.menuType === 6){
        this.menuName = "6";
        this.hideSider({
          siderShowType:true,
          menuName:"6"
        })
      }
    },
    changeManage (name){
      this.menuName = name;
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
      this.menuName = window.localStorage.getItem('MenuName')
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

