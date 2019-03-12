<template>
  <div style="padding:0 24px 24px;">
    <div class="top_title_option">
      <div class="top_title">加盟统计</div>
      <div class="timeSelect">
        <div class="typeSelect">
          <ul>
            <li :class="{'active':typeLeagueSelected === 1}"  @click="selectLeagueTypeLi(1)" >本月</li>
            <li :class="{'active':typeLeagueSelected === 2}"  @click="selectLeagueTypeLi(2)" >上月</li>
          </ul>
        </div>
        <div class="year_month_select">
          <DatePicker type="month" placeholder="请选择时间" style="width: 200px" transfer ></DatePicker>
        </div>
        <div class="year_month_select">
          <Select v-model="motorCadeSelected" style="width:150px;margin-right:10px;" placeholder="请选择车队" transfer>
              <Option v-for="(item,key) in Motorcade" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <topHost :itemCol="leagueDriverData" :style="{ border:'1px solid #F0F0F0',borderBottom:'none'}"></topHost>
    <topHost :itemCol="leagueIndentData" :style="{ border:'1px solid #F0F0F0',borderTop:'none'}"></topHost>
    <Row style="margin-top:30px;" :gutter="20">
      <Col span="18">
        <Card shadow id="chartCard">
          <div id="mychart" style="width:100%;height:400px;" ></div>
        </Card>
      </Col>
      <Col span="6">
        <Card shadow title="工作提醒" class="workCard">
          <div class="ant-card-grid" v-for="(item,key) in cautionData">
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
        </Card>
      </Col>
    </Row>

    <div class="top_title_option">
      <div class="top_title">对公统计</div>
      <div class="timeSelect">
        <div class="typeSelect">
          <ul>
            <li :class="{'active':typeTeamSelected === 1}"  @click="selectTeamTypeLi(1)" >本月</li>
            <li :class="{'active':typeTeamSelected === 2}"  @click="selectTeamTypeLi(2)" >上月</li>
          </ul>
        </div>
        <div class="year_month_select">
          <DatePicker type="month" placeholder="请选择时间" style="width: 200px" transfer ></DatePicker>
        </div>
        <div class="year_month_select">
          <Select v-model="teamCompanySelected" style="width:150px;margin-right:10px;" placeholder="请选择合作公司" transfer>
              <Option v-for="(item,key) in TeamCompany" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>

    <topHost :itemCol="publicDriverData" :style="{ border:'1px solid #F0F0F0',borderBottom:'none'}"></topHost>
    <topHost :itemCol="publicIndentData" :style="{ border:'1px solid #F0F0F0',borderBottom:'none'}"></topHost>
    <topHost :itemCol="publicInRange" :style="{ border:'1px solid #F0F0F0',borderTop:'none'}"></topHost>

    <div class="top_title_option">
      <div class="top_title">租车统计</div>
      <div class="timeSelect">
        <div class="typeSelect">
          <ul>
            <li :class="{'active':typeTeamSelected === 1}"  @click="selectTeamTypeLi(1)" >本月</li>
            <li :class="{'active':typeTeamSelected === 2}"  @click="selectTeamTypeLi(2)" >上月</li>
          </ul>
        </div>
        <div class="year_month_select">
          <DatePicker type="month" placeholder="请选择时间" style="width: 200px" transfer ></DatePicker>
        </div>
      </div>
    </div>

    <topHost :itemCol="rentCarData" :style="{ border:'1px solid #F0F0F0',borderBottom:'none'}"></topHost>
    <topHost :itemCol="rentLicenceData" :style="{ border:'1px solid #F0F0F0',borderBottom:'none'}"></topHost>
    <topHost :itemCol="saleCarData" :style="{ border:'1px solid #F0F0F0',borderTop:'none'}"></topHost>

  </div>
</template>

<script>
import topHost from '_c/top-host'
import { Row,Card,Col,DatePicker,Select,Option } from 'iview'
// 引入 ECharts 主模块
import * as echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    topHost,
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
      leagueDriverData: [
        { title:'全部加盟司机',colSpan:4,value:60,em:true},
        { title:'已加盟司机',colSpan:4,value:8,em:true},
        { title:'注册司机',colSpan:4,value:8,em:true},
        { title:'待审核司机',colSpan:4,value:60,em:true},
        { title:'取消加盟的司机',colSpan:4,value:60,em:true},
        { title:'在线司机',colSpan:4,value:60,em:false},
      ],
      leagueIndentData:[
        { title:'订单量',colSpan:4,value:60,em:true},
        { title:'完成订单',colSpan:4,value:8,em:true},
        { title:'进行中的订单',colSpan:4,value:8,em:true},
        { title:'未进行订单',colSpan:4,value:60,em:true},
        { title:'取消订单',colSpan:4,value:60,em:true},
        { title:'流水金额',colSpan:4,value:60,em:false},
      ],
      myChart: null,
      changeChartsShake:'',
      motorCadeSelected:1,
      Motorcade:[
        {label:'1号车队',value:1},
        {label:'2号车队',value:2}
      ],
      cautionData:[
        {content:'2019.1.23升级信息--- 嘀友管车【集团版本】已开放欢迎汽车租赁集团公司体验，支持集团管理员查看集团汇总信息、集团内部管理账号，价格更实惠！'},
        {content:'今日还有3个抢单没有司机接单，请处理！'},
      ],
      teamCompanySelected:1,
      TeamCompany:[
        {label:'嘀嘀打车',value:1},
        {label:'风行顺风车',value:2}
      ],
      publicDriverData:[
        { title:'全部对公司机',colSpan:3,value:60,em:true},
        { title:'A级司机',colSpan:3,value:8,em:true},
        { title:'B级司机',colSpan:3,value:8,em:true},
        { title:'C级司机',colSpan:3,value:60,em:true},
        { title:'快车司机',colSpan:3,value:60,em:true},
        { title:'专车司机',colSpan:3,value:60,em:true},
        { title:'豪华车司机',colSpan:3,value:60,em:true},
        { title:'萌芽司机',colSpan:3,value:60,em:false},
      ],
      publicIndentData:[
        { title:'订单量',colSpan:3,value:60,em:true},
        { title:'完成订单',colSpan:3,value:8,em:true},
        { title:'取消订单',colSpan:3,value:60,em:true},
        { title:'接单率',colSpan:3,value:60,em:true},
        { title:'差评订单',colSpan:3,value:60,em:true},
        { title:'差评率',colSpan:3,value:60,em:true},
        { title:'平均评分',colSpan:3,value:60,em:true},
        { title:'&nbsp;',colSpan:3,value:'&nbsp;',em:false},
      ],
      publicInRange:[
        { title:'入围司机',colSpan:3,value:60,em:true},
        { title:'未入围司机',colSpan:3,value:8,em:true},
        { title:'入围率',colSpan:3,value:8,em:true},
        { title:'日均时长',colSpan:3,value:60,em:true},
        { title:'流水金额',colSpan:3,value:60,em:true},
        { title:'对公提成',colSpan:3,value:60,em:true},
        { title:'&nbsp;',colSpan:3,value:'&nbsp;',em:true},
        { title:'&nbsp;',colSpan:3,value:'&nbsp;',em:false},
      ],
      rentCarData:[
        { title:'全部租车司机',colSpan:3,value:60,em:true},
        { title:'待租司机',colSpan:3,value:8,em:true},
        { title:'租车中司机',colSpan:3,value:8,em:true},
        { title:'续租中司机',colSpan:3,value:60,em:true},
        { title:'已退车司机',colSpan:3,value:60,em:true},
        { title:'违章司机',colSpan:3,value:60,em:true},
        { title:'租金代缴司机',colSpan:3,value:60,em:true},
        { title:'即将到期司机',colSpan:3,value:60,em:false},
      ],
      rentLicenceData:[
        { title:'全部租牌司机',colSpan:3,value:60,em:true},
        { title:'待租牌司机',colSpan:3,value:8,em:true},
        { title:'租牌中司机',colSpan:3,value:8,em:true},
        { title:'续租中司机',colSpan:3,value:60,em:true},
        { title:'已退牌司机',colSpan:3,value:60,em:true},
        { title:'违章司机',colSpan:3,value:60,em:true},
        { title:'租金代缴司机',colSpan:3,value:60,em:true},
        { title:'即将到期司机',colSpan:3,value:60,em:false},
      ],
      saleCarData:[
        { title:'全部售车司机',colSpan:3,value:60,em:true},
        { title:'待售车司机',colSpan:3,value:8,em:true},
        { title:'全款售车司机',colSpan:3,value:8,em:true},
        { title:'首付分期司机',colSpan:3,value:60,em:true},
        { title:'以租代购司机',colSpan:3,value:60,em:true},
        { title:'违章司机',colSpan:3,value:60,em:true},
        { title:'租金代缴司机',colSpan:3,value:60,em:true},
        { title:'&nbsp;',colSpan:3,value:'&nbsp;',em:false},
      ]
    }
  },
   computed: {
    ...mapState([
        'app',
    ]),
    siderShow () {
      return this.$store.state.app.siderShow
    }
  },
  methods: {
    selectLeagueTypeLi (type) {
      this.typeLeagueSelected = type;
    },
    selectTeamTypeLi (type) {
      this.typeTeamSelected = type;
    },
    drawPie () {
      this.myChart = echarts.init(document.getElementById('mychart'));
      // 绘制图表
      this.myChart.setOption({
          title: {
              text: '调度情况'
          },
          tooltip : {
              trigger: 'axis'
          },
          legend: {
              data:['已完成','进行中','未完成']
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
                  data : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'已完成',
                  type:'line',
                  data:[320,332,301,334,390,330,320,320,332,301,334,390,330,320,320,332,301,334,390,330,320,320,332,301,334,390,330,320,278,190,350],
                  itemStyle:{
                    color:'#1890FF'
                  }
              },
              {
                  name:'进行中',
                  type:'line',
                  data:[120,132,101,134,90,230,210,120,132,101,134,90,230,210,120,132,101,134,90,230,210,120,132,101,134,90,230,210,240,238,311],
                  itemStyle:{
                    color:'#ED7D31'
                  }
              },
              {
                  name:'未完成',
                  type:'line',
                  data:[220,182,191,234,290,330,310,220,182,191,234,290,330,310,220,182,191,234,290,330,310,220,182,191,234,290,330,310,110,147,189],
                  itemStyle:{
                    color:'#17B496'
                  }
              },
          ]
      });
    },
  },
  mounted () {
    let self = this
    setTimeout(() => {
      self.drawPie();
      self.myChart.resize()
      window.addEventListener('resize',()=>{
        self.myChart.resize()
      })
    }, 20)

    setTimeout(() => {
      self.myChart.resize()
    }, 350)
  },
  watch: {  
    siderShow() {
      let self = this
      if(self.changeChartsShake) clearTimeout(self.changeChartsShake)
      self.changeChartsShake = setTimeout(() => {
        self.myChart.resize()
      },350) 
    }
  },
}
</script>

<style lang="less">

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
  justify-content: space-between;
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

</style>
