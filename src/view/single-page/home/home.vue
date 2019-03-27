<template>
  <div style="padding:0 24px 24px;">
    <div class="pageHeaderContent">
      <div class="avatar">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png">
      </div>
      <div class="content">
        <div class="contentTitle">欢迎您，{{this.user_name}} 管理员</div>
        <div>今天是 ：{{this.TodayTime}} &nbsp;&nbsp; {{ weekday }}</div>
      </div>
    </div>
    <Row :style="{marginTop:'30px'}">
      <Col span="16">
        <topHostHome :itemCol="leagueDriverData" @transferdata="top_skip"></topHostHome>
      </Col>
      <Col span="8">
        <Card shadow title="工作提醒" class="workCard">
          <div class="ant-card-grid" v-for="(item,key) in cautionData" v-if="cautionData && cautionData.length > 0">
            <div class="ant-card">
              <div class="ivu-card-body">
                <div class="ant-card-meta">
                  <div class="ant-card-meta-detail">
                    {{item.content}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="no_work_caution" v-if="cautionData && cautionData.length === 0">
            暂无工作提醒
          </div>
        </Card>
      </Col>
    </Row>
    <Card shadow id="chartCard" :style="{marginTop:'30px'}">
      <div class="top_title_option">
          <div class="top_title">按时间统计</div>
          <div class="timeSelect">
            <div class="typeSelect">
              <ul>
                <li :class="{'active':typeLeagueSelected === 1}"  @click="selectLeagueTypeLi(1)" >今日</li>
                <li :class="{'active':typeLeagueSelected === 2}"  @click="selectLeagueTypeLi(2)" >本周</li>
                <li :class="{'active':typeLeagueSelected === 3}"  @click="selectLeagueTypeLi(3)" >本月</li>
              </ul>
            </div>
            <div class="year_month_select">
              <DatePicker type="daterange" @on-change="changeDate" :value="date_val" :start-date="new Date()" placement="bottom-end" placeholder="请选择时间范围" style="width: 200px;margin-left:20px;"></DatePicker>
            </div>
          </div>
      </div>
      <div id="mychart_bar" style="width:100%;height:400px;" v-show="bar_show"></div>
      <div id="mychart_line" style="width:100%;height:400px;" v-show="line_show"></div>
    </Card>

  </div>
</template>

<script>
import topHostHome from '_c/top-host-home'
import { Row,Card,Col,DatePicker,Select,Option } from 'iview'
// 引入 ECharts 主模块
import * as echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { mapState,mapActions,mapMutations } from 'vuex'
import moment from 'moment' 

// {content:'2019.1.23升级信息--- 嘀友管车【集团版本】已开放欢迎汽车租赁集团公司体验，支持集团管理员查看集团汇总信息、集团内部管理账号，价格更实惠！'},
      
export default {
  name: 'home',
  components: {
    topHostHome,
    Row,
    Col,
    Card,
    DatePicker,
    Select,
    Option
  },
  data () {
    return {
      typeLeagueSelected:1,
      typeTeamSelected:1,
      leagueDriverData: [],
      mychart_bar: null,
      mychart_line:null,
      changeChartsShake:'',
      Motorcade:[
        {label:'1号车队',value:1},
        {label:'2号车队',value:2}
      ],
      cautionData:[],
      teamCompanySelected:1,
      TeamCompany:[
        {label:'嘀嘀打车',value:1},
        {label:'风行顺风车',value:2}
      ],
      TodayTime:'',
      weekday:'',
      user_name:'',
      changeChartsShake:'',
      date_val:[moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')],
      bar_show:true,
      line_show:false,
      chart_data:'',
    }
  },
   computed: {
    ...mapState([
        'app',
    ]),
    siderShow () {
      return this.$store.state.app.siderShow
    },
  },
  methods: {
    ...mapMutations([
      'setAccess',
      'setMenuName',
    ]),
    ...mapActions([
      'getIndexHost',
      'getIndexLists',
      'hideSider',
    ]),
    top_skip(index){
      let new_arr = JSON.parse(window.localStorage.getItem("izuxbcniushdfdebfud_permission"))
      if(new_arr[0] === '9999'){
          if(index === 0){
              this.hideSider({
                siderShowType:true,
                menuName:"2"
              })
              this.setAccess(['leagueCheck'])
              this.setMenuName('2')
            this.$router.push({name:'driverManage'});
          }else{
            this.hideSider({
              siderShowType:true,
              menuName:"3"
            })
            this.setAccess(['indentCheck'])
            this.setMenuName('3')
            this.$router.push({name:'indentManage'});
          }
       }else{
         let permission_val = '';
         if(index === 0){
            if(new_arr[2000]){
             for(let i=0; i<new_arr[2000].length; i++){
               if(new_arr[2000][i] === '2001'){
                 permission_val = 2001
               }
             }

             if(permission_val === 2001){
                this.hideSider({
                  siderShowType:true,
                  menuName:"2"
                })
                this.setMenuName('2')
                this.setAccess(['leagueCheck'])
                this.$router.push({name:'driverManage'});
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
          }else{

            if(new_arr[5000]){
             for(let i=0; i<new_arr[5000].length; i++){
               if(new_arr[5000][i] === '5003'){
                 permission_val = 5003
               }
             }

             if(permission_val === 5003){
                this.hideSider({
                  siderShowType:true,
                  menuName:"3"
                })
                this.setMenuName('3')
                this.setAccess(['indentCheck'])
                this.$router.push({name:'indentManage'});
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
    selectLeagueTypeLi (type) {
      this.typeLeagueSelected = type;
      this.drawPie(type)
    },
    drawPie (type) {
      this.getIndexLists({ start_time:'',end_time:'',date_type:type}).then((data) => {
        this.chart_data = data.data.data.rows;
        if(data.data.data.rows && data.data.data.rows.length>0){
            if(type === 1){
              this.bar_show = true;
              this.line_show = false;
              this.mychart_bar = echarts.init(document.getElementById('mychart_bar'));
              let new_arr = [];
              new_arr.push(data.data.data.rows[0].new_driver);
              new_arr.push(data.data.data.rows[0].new_order);
              new_arr.push(data.data.data.rows[0].new_amount);
              new_arr.push(data.data.data.rows[0].online_driver)

              this.mychart_bar.setOption({
                xAxis: {
                    type: 'category',
                    data: ['新增司机数', '新增订单数', '流水', '上线司机']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: new_arr,
                    type: 'bar'
                }]
              })
            }else{
              this.bar_show = false;
              this.line_show = true;
              this.mychart_line = echarts.init(document.getElementById('mychart_line'));
              let x_arr = [],driver_arr = [],indent_arr = [],count_arr = [],on_line_driver = [];
              for(let i=0; i<data.data.data.rows.length; i++){
                x_arr.push(data.data.data.rows[i].today);
                driver_arr.push(data.data.data.rows[i].new_driver)
                indent_arr.push(data.data.data.rows[i].new_order)
                count_arr.push(data.data.data.rows[i].new_amount)
                on_line_driver.push(data.data.data.rows[i].online_driver)
              }
              
              this.mychart_line.setOption({
                  title: {
                      text: ''
                  },
                  tooltip : {
                      trigger: 'axis'
                  },
                  legend: {
                      data:['新增司机数','新增订单数','流水','上线司机']
                  },
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                  },
                  xAxis : [
                      {
                          type : 'category',
                          boundaryGap: false,
                          data : x_arr,
                      }
                  ],
                  yAxis : [
                      {
                          type : 'value'
                      }
                  ],
                  series : [
                      {
                          name:'新增司机数',
                          type:'line',
                          data:driver_arr,
                          itemStyle:{
                            color:'#1890FF'
                          }
                      },
                      {
                          name:'新增订单数',
                          type:'line',
                          data:indent_arr,
                          itemStyle:{
                            color:'#ED7D31'
                          }
                      },
                      {
                          name:'流水',
                          type:'line',
                          data:count_arr,
                          itemStyle:{
                            color:'#17B496'
                          }
                      },
                      {
                          name:'上线司机',
                          type:'line',
                          data:on_line_driver,
                          itemStyle:{
                            color:'#A0522D'
                          }
                      },
                  ]
              });
            }
        }

        return data;
      }).then((data)=>{
        if(data.data.data.rows && data.data.data.rows.length>0){
          if(type === 1){
            this.mychart_bar.resize()
            window.addEventListener('resize',()=>{
              this.mychart_bar.resize()
            })
          }else{
            this.mychart_line.resize()
            window.addEventListener('resize',()=>{
              this.mychart_line.resize()
            })
          }
        }
      })
    },
    changeDate(){

    }
  },
  mounted () {
    this.getIndexHost().then((data) => {
        this.$set(this.leagueDriverData,0,{ title:'全部加盟司机',colSpan:5,value:data.data.data.total_driver,em:true})
        this.$set(this.leagueDriverData,1,{ title:'已完成订单量',colSpan:5,value:data.data.data.count,em:true})
        this.$set(this.leagueDriverData,2,{ title:'已完成订单流水',colSpan:5,value:data.data.data.amount/100,em:false})
    })

    let nowTime = new Date();
    let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    this.TodayTime = nowTime.getFullYear()+'年'+(nowTime.getMonth()+1)+'月'+nowTime.getDate()+'日';
    this.weekday = week[nowTime.getDay()]
    this.user_name = window.localStorage.getItem("izuxbcniushdfdebfud_userName");

    let self = this
    setTimeout(() => {
      self.drawPie(1);
    }, 20)

    setTimeout(() => {
      if(this.chart_data && this.chart_data.length > 0){
        self.mychart_bar.resize()
      }
    }, 350)

  },
  activated () {
    this.getIndexHost().then((data) => {
        this.$set(this.leagueDriverData,0,{ title:'全部加盟司机',colSpan:4,value:data.data.data.total_driver,em:true})
        this.$set(this.leagueDriverData,1,{ title:'已完成订单量',colSpan:4,value:data.data.data.count,em:true})
        this.$set(this.leagueDriverData,2,{ title:'已完成订单流水',colSpan:4,value:data.data.data.amount/100,em:false})
    })

    let nowTime = new Date();
    let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    this.TodayTime = nowTime.getFullYear()+'年'+(nowTime.getMonth()+1)+'月'+nowTime.getDate()+'日';
    this.weekday = week[nowTime.getDay()]
    this.user_name = window.localStorage.getItem("izuxbcniushdfdebfud_userName");

    let self = this
    setTimeout(() => {
      self.drawPie(1);
    }, 20)

    setTimeout(() => {
      if(this.chart_data && this.chart_data.length > 0){
        self.mychart_bar.resize()
      }
    }, 350)

  },
  watch: {  
    siderShow() {
      let self = this
      if(self.changeChartsShake) clearTimeout(self.changeChartsShake)
      self.changeChartsShake = setTimeout(() => {
        if(this.chart_data && this.chart_data.length > 0){
          if(self.bar_show){
            self.mychart_bar.resize()
          }else{
            self.mychart_line.resize()
          }
        }
      },350) 
    }
  },
}
</script>

<style lang="less">

.pageHeaderContent {
  margin: -15px -24px 0px;
  background: #fff;
  padding: 16px 32px 12px;
  display: flex;
  .avatar {
    flex: 0 1 72px;
    margin-bottom: 8px;
    & > span {
      border-radius: 72px;
      display: block;
      width: 72px;
      height: 72px;
    }
    img{
      width: 100%;
      height:100%;
    }
  }
  .content {
    position: relative;
    top: 4px;
    margin-left: 24px;
    margin-bottom: 16px;
    flex: 1 1 auto;
    color: rgba(0,0,0,.45);
    line-height: 22px;
    font-size: 14px;
    .contentTitle {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0,0,0,.85);
      margin-bottom: 12px;
    }
  }
}

.ant-layout, .ant-layout * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.workCard{
  border-radius: 0 !important;
  .ivu-card-head{
    border-bottom: none !important;
  }
  .ivu-card-body{
    padding:0;
    .ant-card-grid{
      border-radius: 0;
      border: 0;
      -webkit-box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8, 1px 0 0 0 #e8e8e8 inset, 0 1px 0 0 #e8e8e8 inset;
      box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8, inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
      float: left;
      padding: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      width: 100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background: #fff;
      .ant-card{
        font-size: 14px;
        line-height: 1.5;
        color: rgba(0,0,0,.65);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        border-radius: 2px;
        position: relative;
        -webkit-transition: all .3s;
        transition: all .3s;
        .ant-card-meta {
            margin: -4px 0;
            zoom: 1;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            .ant-card-meta-detail {
                overflow: hidden;
                color: rgba(0, 0, 0, 0.65);
            }
        }
      }
    }
  }
}

.top_title_option{
  margin:25px 0;
  display: flex;
  align-items: center;
  .top_title{
    color:#757C87;
    font-size: 16px;
  }

  .timeSelect{
    display: flex;
    .typeSelect{
      margin-left: 50px;
      width:100px;
      ul{
        width: 100%;
        height:100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li{
          color:#757C87;
          list-style: none;
          cursor: pointer;
          font-size: 14px;
        }
        li.active{
          color:#1890FF;
        }
      }
    }

    .year_month_select{
      margin-left:20px;
    }

  }
}

.no_work_caution{
  border-top: 1px solid #d9d9d9;
  text-align: center;
  color: rgba(0,0,0,.45);
  font-size: 14px;
  padding:10px 0;
}
</style>
