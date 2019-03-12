<template>
  <div style="padding:0 24px 24px;">
      <Card shadow title="司机位置" style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in cityOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队</span>
        <Select v-model="teamSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in teamOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">上线状态</span>
        <Select v-model="statusSelected" style="width:150px;margin-right:10px;" transfer>
            <Option v-for="(item,key) in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <DatePicker type="daterange" :start-date="new Date()" placement="bottom-end" placeholder="请选择上线时间时间范围" style="width: 200px;margin-left:20px;"></DatePicker>

        <Divider />

        <span style="font-size:14px;padding-right:10px;">司机姓名</span>
        <AutoComplete
        v-model="driverName"
        :data="driverGather"
        @on-search="searchName"
        placeholder="请输入司机姓名"
        style="width:200px" transfer></AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <AutoComplete
        v-model="driverPhone"
        :data="phoneGather"
        @on-search="searchPhone"
        placeholder="请输入司机手机号"
        style="width:200px" transfer></AutoComplete>

        <Button type="success" style="margin-left:30px;">查询</Button>
      </Card>
      <Row :gutter="16" style="background:#fff;margin:10px 0;">
        <Col span="20">
          <Card  style="margin-top:10px;">
              <baidu-map class="bm-view" center="上海" ak="A1KbCD1wUrTDiAxu46BtmVhI">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-driving
                    start="广兰路(地铁站)"
                    end="三林(地铁站)"
                    :auto-viewport="true"
                    policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
                    :panel="false"
                    location="上海"
                    :waypoints="[]">
                </bm-driving>
                <bm-marker :position="{lng: 121.540749, lat: 31.159538}" title="三林世博家园b区" :icon="{url: driverLogo, size: {width: 35, height: 30}}"></bm-marker>
              </baidu-map>
          </Card>
        </Col>
        <Col span="4">
          <Card  class="workCard" style="margin-top:10px;">
            <p slot="title">
                <span style="padding-right:20px;">上线人数/总人数</span>
                <span style="">18/100</span>
            </p>
            <div class="ant-card-grid" v-for="(item,key) in driverData">
              <div class="ant-card">
                <div class="ivu-card-body">
                  <div class="ant-card-meta">
                    <div class="ant-card-meta-detail">
                      <div style="margin:5px 0;">
                        <span>司机姓名:</span>
                        <span>{{ item.name}}</span>
                      </div>
                      <div style="margin:5px 0;">
                        <span>司机位置:</span>
                        <span>{{ item.location}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation,BmDriving,BmMarker } from 'vue-baidu-map'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,AutoComplete,Modal,Icon } from 'iview'
import { mapActions } from 'vuex'
import driverLogo from '@/assets/images/driver.png'
export default {
  name: 'driverLocation',
  components: {
    Row,
    Col,
    Card,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Option,
    AutoComplete,
    Modal,
    Icon,
    BaiduMap,
    BmNavigation,
    BmDriving,
    BmMarker,
  },
  data () {
    return {
      driverLogo,
      citySelected:'',
      cityOptions:[
        {label:'上海',value:1},
        {label:'南京',value:2}
      ],
      teamSelected:'',
      teamOptions:[
        {label:'车队1',value:1},
        {label:'车队2',value:2}
      ],
      statusSelected:1,
      statusOptions:[
        {label:'全部',value:1},
        {label:'注册',value:2},
        {label:'待审核',value:3},
        {label:'未通过',value:4},
        {label:'已通过',value:5},
        {label:'解除加盟',value:6},
      ],
      driverData:[
        { name:'张三',location:'浦东大道浦东大道浦东大道浦东大道浦东大道'},
        { name:'黎明',location:'浦东新区'}
      ]
    }
  },
  methods: {
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
  },
  mounted () {
      //console.log(this.$route.query.id)
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
</style>
