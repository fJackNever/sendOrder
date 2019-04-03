<template>
  <div style="padding:0 24px 24px;">
      <Card shadow title="司机位置" style="margin-top:10px;">
        <span style="font-size:14px;padding-right:10px;">城市</span>
        <Select v-model="citySelected" style="width:150px;margin-right:10px;" transfer>
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in city_arr" :value="item.id" :key="index">{{ item.city }}</Option>
        </Select>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">车队</span>
        <Select v-model="carTeamSelected" style="width:150px;margin-right:10px;" transfer>
            <Option :value="-1">全部</Option>
            <Option v-for="(item,index) in carTeamOptions" :value="item.id" :key="index">{{ item.fleet_name }}</Option>
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
        @on-search="searchName"
        @on-select="selectName"
        placeholder="请输入司机姓名"
        style="width:200px" transfer>
            <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
        </AutoComplete>

        <span style="font-size:14px;padding-right:10px;padding-left:20px;">司机手机号</span>
        <Input v-model="driverPhone" placeholder="请输入司机手机号" style="width:200px"></Input>

        <Button type="success" style="margin-left:30px;" >查询</Button>
      </Card>
      <Row :gutter="16" style="background:#fff;margin:10px 0;">
        <Col span="20">
          <Card  style="margin-top:10px;">
              <baidu-map class="bm-view" center="上海" ak="A1KbCD1wUrTDiAxu46BtmVhI" :zoom="10">
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
      citySelected:-1,
      city_arr:[],
      carTeamSelected:-1,
      carTeamOptions:[],
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
      ],
      inputNameShake:'',
      driverName:'',
      driverGather:[],
      driverPhone:'',
    }
  },
  methods: {
    ...mapActions([
      'getCompanyCityLists',
      'getFleetLists',
      'getDriverLists',
    ]),
    searchName(value){
      if(this.inputNameShake) clearTimeout(this.inputNameShake)
        this.inputNameShake = setTimeout(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:value,telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.driverGather = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.driverGather,i,data.data.data.rows[i])
                }
            })
        },600)
    },
    selectName(val){
        this.getDriverLists({ id:val,fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.driverName = data.data.data.rows[0].id_name
            this.driverPhone = data.data.data.rows[0].telephone
        })
    },
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
    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.city_arr,i,data.data.data.rows[i])
        }
    })

    this.getFleetLists({ id:'',status:1,fleet_no:'',fleet_name:'',search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.carTeamOptions,i,data.data.data.rows[i])
        }
    })

  },
  activated () {

    this.getCompanyCityLists({ id:'',search:'',offset:0,limit:10,status:1 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.city_arr,i,data.data.data.rows[i])
        }
    })

    this.getFleetLists({ id:'',status:1,fleet_no:'',fleet_name:'',search:'',offset:0,limit:10000 }).then((data) => {
        for(let i=0; i<data.data.data.rows.length; i++){
            this.$set(this.carTeamOptions,i,data.data.data.rows[i])
        }
    })

  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.ant-card-grid{
  cursor:pointer;
  border-bottom: 1px solid #e8eaec;
}
</style>
