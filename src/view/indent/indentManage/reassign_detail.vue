<template>
  <div style="padding:0 24px 24px;">
        <Card shadow class="checkCard">
            <div slot="title">
                司机信息列表
            </div>
            <div slot="extra">
                <AutoComplete
                v-model="driverName"
                @on-search="searchName"
                @on-select="selectName"
                placeholder="请输入司机姓名"
                style="width:250px;margin-right:15px;" transfer>
                    <Option v-for="(item,index) in driverGather" :value="item.id" :key="index" >{{ item.id_name }}</Option>
                </AutoComplete>
                <Button type="primary" @click="getAllDriver()">获取全部司机信息</Button>
            </div>
            <Table border :columns="order_columns" :data="order_data">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px" @click="selectAssigned(row.id)">选择指派</Button>
                </template>
            </Table>
            <Page ref="Pagination" :total="pageTotal" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:15px;"/>
        </Card>
        <Card shadow class="indentCard" >
            <div slot="title" class="cardSlot">
                <div style="width:200px;margin-top:6px;">{{cardTitle}}</div>
                <Steps :current="2">
                    <Step title="发单"></Step>
                    <Step title="接单"></Step>
                    <Step title="改派待处理"></Step>
                </Steps>
            </div>
            <Row>
                <Col span="12">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                        <div style="margin:10px 0;">订单信息</div>
                        <FormItem label="订单类型" prop="indentType">
                            <Select v-model="formValidate.indentType" placeholder="请选择订单类型" style="width:200px" disabled>
                                <Option :value="1">日租包车</Option>
                                <Option :value="2">半日租包车</Option>
                                <Option :value="3">点对点用车</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="车型要求" prop="modelRequire">
                            <Select v-model="formValidate.modelRequire" placeholder="请选择车型要求" style="width:200px" disabled>
                                <Option v-for="(item,index) in useCarArr" :value="item.id" :key="index">{{ item.name }}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="订单开始时间" prop="indentStartDate" :label-width="100">
                            <DatePicker type="date" placeholder="请选择领证日期" v-model="formValidate.indentStartDate" style="width:200px" disabled></DatePicker>
                        </FormItem>
                        <FormItem prop="indentStartTime" :label-width="100">
                            <TimePicker type="time" v-model="formValidate.indentStartTime" placeholder="请选择时间" style="width: 168px" disabled></TimePicker>
                        </FormItem>

                        <FormItem label="订单城市" prop="indentCity">
                            <Select v-model="formValidate.indentCity" placeholder="请选择订单城市" style="width:200px" disabled>
                                <Option v-for="(item,index) in cityArr" :value="item.id" :key="index">{{item.city}}</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="订单起点" prop="startAddress">
                            <Input v-model="formValidate.startAddress" placeholder="请输入订单起点" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="订单终点" prop="endAddress">
                            <Input v-model="formValidate.endAddress" placeholder="请输入订单终点" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="平台价格" prop="platformPrice">
                            <InputNumber :min="0" v-model="formValidate.platformPrice" disabled></InputNumber>
                        </FormItem>

                        <FormItem label="订单价格" prop="indentPrice">
                            <InputNumber :min="0" v-model="formValidate.indentPrice" disabled></InputNumber>
                        </FormItem>

                        <FormItem label="司机价格" prop="deiverPrice">
                            <InputNumber :min="0" v-model="formValidate.deiverPrice" disabled></InputNumber>
                        </FormItem>

                    </Form>
                </Col>
                <Col span="12">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                        <div style="margin:10px 0;">司机信息</div>
                        <FormItem label="司机姓名" prop="driverName">
                            <Input v-model="formValidate.driverName" placeholder="请输入司机姓名" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="司机电话" prop="driverPhone">
                            <Input v-model="formValidate.driverPhone" placeholder="请输入司机电话" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="车牌号" prop="carNum">
                            <Input v-model="formValidate.carNum" placeholder="请输入车牌号" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="品牌车型" prop="brandModel">
                            <Input v-model="formValidate.brandModel" placeholder="请输入品牌车型" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="用车类型" prop="carType">
                            <Input v-model="formValidate.carType" placeholder="请输入用车类型" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="车身颜色" prop="carColor">
                            <Input v-model="formValidate.carColor" placeholder="请输入车身颜色" style="width:200px" disabled></Input>
                        </FormItem>

                        <div style="margin:10px 0;">乘客信息</div>
                        <FormItem label="乘客称呼" prop="passengerName">
                            <Input v-model="formValidate.passengerName" placeholder="请输入乘客称呼" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="乘客电话" prop="passengerPhone">
                            <Input v-model="formValidate.passengerPhone" placeholder="请输入乘客电话" style="width:200px" disabled></Input>
                        </FormItem>

                        <FormItem label="注意事项" prop="desc" style="width:400px;">
                            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入注意事项" disabled></Input>
                        </FormItem>
                        <FormItem v-if="busyBtnShow">
                            <Button type="primary" @click="becomeBusyIndent()">成为抢单</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </Card>
        
        <Card shadow style="margin-top:30px;" >
            <baidu-map class="bm-view" center="上海" ak="A1KbCD1wUrTDiAxu46BtmVhI">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-driving
                    :start="indentStartAddress"
                    :end="indentEndAddress"
                    :auto-viewport="true"
                    policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
                    :panel="false"
                    :location="addressCity">
                </bm-driving>
                <!-- <bm-marker :position="{lng: 121.540749, lat: 31.159538}" title="三林世博家园b区" :icon="{url: driverLogo, size: {width: 35, height: 30}}"></bm-marker> -->
            </baidu-map>
        </Card>
        <Modal 
            title="是否成为抢单"
            v-model="busyVisible" 
            @on-ok="confirmBusy"
            @on-cancel="cancelBusy"
            ok-text="是"
            cancel-text="否"
            class="busyModal"
        >
        </Modal>
        <Modal 
            title="是否指派该司机"
            v-model="sendVisible" 
            @on-ok="confirmSend"
            @on-cancel="cancelSend"
            ok-text="是"
            cancel-text="否"
            class="busyModal"
        >
            
        </Modal>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation,BmDriving,BmMarker } from 'vue-baidu-map'
import { Row,Col,Card,Input,Button,Divider,DatePicker,Select,Option,Table,AutoComplete,Form,FormItem,RadioGroup,Radio,Modal,Icon,Steps,Step,InputNumber,Page,TimePicker, } from 'iview'
import { mapActions } from 'vuex'
import driverLogo from '@/assets/images/driver.png'
import fetchJsonp from 'fetch-jsonp'
export default {
  name: 'reassign_detail',
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
    Table,
    AutoComplete,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Modal,
    Icon,
    BaiduMap,
    BmNavigation,
    BmDriving,
    BmMarker,
    Steps,
    Step,
    InputNumber,
    Page,
    TimePicker,
  },
  data () {
    return {
      driverLogo,
      cardTitle:'查看订单',
      driverName:'',
      driverGather:[],
      order_columns: [
            {
                title: '司机姓名',
                key: 'id_name'
            },
            {
                title: '品牌车型',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.brand_model),
                    ]);
                }
            },
            {
                title: '用车类型',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.use_car_type_name),
                    ]);
                }
            },
            {
                title: '车身颜色',
                key: 'binding_info',
                render: (h, params) => {
                    return h('div', [
                        h('div',params.row.binding_info.car_color),
                    ]);
                }
            },
            {
                title: '操作',
                slot: 'action',
                width: 110,
                align: 'center'
            }
      ],
      order_data: [],
      formValidate: {
          indentType: '1',
          indentStartDate: '',
          startAddress: '',
          endAddress: '',
          indentPrice: 0,
          deiverPrice:0,
          modelRequire: '1',
          indentCity:1,
          passengerName: '',
          passengerPhone: '',
      },
      cityArr:[],
      ruleValidate: {},
      busyVisible:false,
      sendVisible:false,
      pageTotal:0,
      pageSize:10,
      pageCurrent:1,
      driverId:'',
      useCarArr:[],
      minuteTime:'',
      busyBtnShow:true,
      orderStatus:'',
      driveTime:'',
      driveDistance:'',
      driverLocation:'',
      passengerDistance:'',
      passengerTime:'',

      addressCity:'',
      indentStartAddress:'',
      indentEndAddress:'',
      start_location:'',
      end_location:'',
    }
  },
  methods: {
    ...mapActions([
      'getDriverLists',
      'getCompanyCityLists',
      'getReassignApplyLists',
      'getUseCarTypeLists',
      'getOrderInfo',
      'orderToDriver',
      'changeOrderToGrab',
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
            this.driverId = val;
            this.order_data = []
            this.$set(this.order_data,0,data.data.data.rows[0])
            this.pageTotal = 1
        })
    },
    getAllDriver(){
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    changePage(page){
        this.pageCurrent = page;
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:(page-1)*this.pageSize,limit:this.pageSize }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
        })
    },
    changePageSize(size){
        this.pageSize = size;
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:size }).then((data) => {
            this.order_data = []
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })
    },
    selectAssigned(id){
        this.driver_id = id
        this.sendVisible = true;
    },
    confirmSend(){
        this.orderToDriver({ entity_id:this.order_entity_id,driver_id:this.driver_id }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('指派成功!');
                this.sendVisible = false;
            }
        }).then(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
            
            this.getOrderInfo({ order_id:this.$route.query.id }).then((data) => {
                this.$set(this.formValidate,'driverName',data.data.data.driver_name || '');
                this.$set(this.formValidate,'driverPhone',data.data.data.driver_telephone || '');
                this.$set(this.formValidate,'carNum',data.data.data.car_no || '');
                this.$set(this.formValidate,'brandModel',data.data.data.car_template || '');
                this.$set(this.formValidate,'carType',data.data.data.use_car_type_name || '');
                this.$set(this.formValidate,'carColor',data.data.data.car_color || '');
          })

        })
        
    },
    cancelSend(){
        this.sendVisible = false;
    },
    becomeBusyIndent(){
        this.busyVisible = true;
    },
    confirmBusy(){
        this.changeOrderToGrab({ entity_id:this.order_entity_id }).then((data) => {
            if(data.data.code === 1){
                this.$Message.success('设置成功!');
                this.busyVisible = false;
            }
        }).then(()=>{
            this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:10 }).then((data) => {
                this.order_data = []
                for(let i=0; i<data.data.data.rows.length; i++){
                    this.$set(this.order_data,i,data.data.data.rows[i])
                }
                this.pageTotal = data.data.data.total
            })
            
            this.getOrderInfo({ order_id:this.$route.query.id }).then((data) => {
                this.$set(this.formValidate,'driverName',data.data.data.driver_name || '');
                this.$set(this.formValidate,'driverPhone',data.data.data.driver_telephone || '');
                this.$set(this.formValidate,'carNum',data.data.data.car_no || '');
                this.$set(this.formValidate,'brandModel',data.data.data.car_template || '');
                this.$set(this.formValidate,'carType',data.data.data.use_car_type_name || '');
                this.$set(this.formValidate,'carColor',data.data.data.car_color || '');
          })

        })
    },
    cancelBusy(){
        this.busyVisible = false;
    },
  },
  mounted () {
          
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })

        this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useCarArr,i,data.data.data.rows[i])
            }
        }).then(()=>{

        this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.cityArr,i,data.data.data.rows[i])
            }
        }).then(()=>{

                this.getReassignApplyLists({ order_id:this.$route.query.id,order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.order_entity_id = data.data.data.rows[0].entity_id;
                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);
                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id);
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.cusId = data.data.data.rows[0].customer_id;
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);

                    this.addressCity = data.data.data.rows[0].city
                    this.indentStartAddress = data.data.data.rows[0].start_address;
                    this.indentEndAddress = data.data.data.rows[0].end_address;

                    if(data.data.data.rows[0].status > 1){
                        this.busyBtnShow = false
                    }
                })

            })

        })

        this.getOrderInfo({ order_id:this.$route.query.id }).then((data) => {
            this.$set(this.formValidate,'driverName',data.data.data.driver_name || '');
            this.$set(this.formValidate,'driverPhone',data.data.data.driver_telephone || '');
            this.$set(this.formValidate,'carNum',data.data.data.car_no || '');
            this.$set(this.formValidate,'brandModel',data.data.data.car_template || '');
            this.$set(this.formValidate,'carType',data.data.data.use_car_type_name || '');
            this.$set(this.formValidate,'carColor',data.data.data.car_color || '');
        })
  },
  activated () {
          
        this.getDriverLists({ id:'',fleet_id:'',status:'',city_id:'',start_time:'',end_time:'',id_name:'',telephone:'',auth_status:'',is_binding:'',is_server:'',search:'',offset:0,limit:this.pageSize }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.order_data,i,data.data.data.rows[i])
            }
            this.pageTotal = data.data.data.total
        })

        this.getUseCarTypeLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.useCarArr,i,data.data.data.rows[i])
            }
        }).then(()=>{

        this.getCompanyCityLists({ id:'',status:1,search:'',offset:0,limit:10000 }).then((data) => {
            for(let i=0; i<data.data.data.rows.length; i++){
                this.$set(this.cityArr,i,data.data.data.rows[i])
            }
        }).then(()=>{

                this.getReassignApplyLists({ order_id:this.$route.query.id,order_entity_id:'',city_id:'',reassign_manage_status:'',start_time:'',end_time:'',driver_name:'',customer_name:'',passenger_tel:'',offset:0,limit:10 }).then((data) => {
                    this.order_entity_id = data.data.data.rows[0].entity_id;
                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);
                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id);
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.cusId = data.data.data.rows[0].customer_id;
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].comment);

                    this.addressCity = data.data.data.rows[0].city
                    this.indentStartAddress = data.data.data.rows[0].start_address;
                    this.indentEndAddress = data.data.data.rows[0].end_address;

                    if(data.data.data.rows[0].status > 1){
                        this.busyBtnShow = false
                    }

                })

            })

        })

        this.getOrderInfo({ order_id:this.$route.query.id }).then((data) => {
            this.$set(this.formValidate,'driverName',data.data.data.driver_name || '');
            this.$set(this.formValidate,'driverPhone',data.data.data.driver_telephone || '');
            this.$set(this.formValidate,'carNum',data.data.data.car_no || '');
            this.$set(this.formValidate,'brandModel',data.data.data.car_template || '');
            this.$set(this.formValidate,'carType',data.data.data.use_car_type_name || '');
            this.$set(this.formValidate,'carColor',data.data.data.car_color || '');
        })
  }
}
</script>

<style lang="less">
.bm-view {
  width: 100%;
  height: 700px;
}
.checkCard{
    margin-top:10px;
    .ivu-card-head{
        padding:20px 16px;
    }
}
.indentCard{
    margin-top:10px;
    .cardSlot{
        display: flex;
        .ivu-steps{
            .ivu-steps-main{
                display: block;
                margin-top: 25px;
            }
        }
    }
}
.busyModal{
    .ivu-modal{
        width: 300px !important;
    }
    .ivu-modal-header{
        border-bottom:none;
        .ivu-modal-header-inner{
            text-align: center;
        }
    }
    .ivu-modal-body{
        display: none;
    }
    .ivu-modal-footer{
        border-top:none;
        text-align: center;
    }
}

.indentTitle{
    font-size:14px;
    padding-right:10px;
    padding-left:20px;
}
.indentData{
    font-weight: bold;
}
</style>
