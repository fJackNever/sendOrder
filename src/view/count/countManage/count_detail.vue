<template>
  <div style="padding:0 24px 24px;">
        <Card shadow class="indentCard" >
            <div slot="title" class="cardSlot">
                <div style="width:200px;margin-top:6px;">{{cardTitle}}</div>
                <Steps :current="6" v-if="count_status === 1">
                    <Step title="待处理"></Step>
                    <Step title="待抢单"></Step>
                    <Step title="已接单"></Step>
                    <Step title="出发接乘客"></Step>
                    <Step title="已接到乘客"></Step>
                    <Step title="已完成"></Step>
                    <Step title="已结算"></Step>
                </Steps>
                <Steps :current="6" v-if="count_status === 0">
                    <Step title="待处理"></Step>
                    <Step title="待抢单"></Step>
                    <Step title="已接单"></Step>
                    <Step title="出发接乘客"></Step>
                    <Step title="已接到乘客"></Step>
                    <Step title="已完成"></Step>
                    <Step title="未结算"></Step>
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

                        <FormItem label="结算备注" prop="driver_settle_comment" style="width:400px;">
                            <Input v-model="formValidate.driver_settle_comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入结算备注" disabled></Input>
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
                    </Form>
                </Col>
            </Row>
        </Card>
        
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
  name: 'count_detail',
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
                key: 'driver_name'
            },
            {
                title: '品牌车型',
                key: 'car_template',
            },
            {
                title: '用车类型',
                key: 'use_car_type_name',
            },
            {
                title: '车身颜色',
                key: 'car_color',
            },
            {
                title: '操作',
                slot: 'action',
                width: 200,
                align: 'center'
            }
      ],
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
      ruleValidate: {

      },
      busyVisible:false,
      sendVisible:false,
      pageTotal:0,
      pageSize:10,
      pageCurrent:1,
      driverId:'',
      useCarArr:[],
      orderStatus:'',
      driveTime:'',
      driveDistance:'',
      driverLocation:'',
      passengerDistance:'',
      passengerTime:'',
      first_show:true,
      sec_show:true,
      third_show:true,
      fourth_show:true,
      fifth_show:true,
      sixth_show:true,
      start_location:'',
      end_location:'',
      count_status:'',
    }
  },
  methods: {
    ...mapActions([
      'getOrderDriverLists',
      'getCompanyCityLists',
      'getOrderLists',
      'getUseCarTypeLists',
      'getOrderInfo',
      'orderToDriver',
      'changeOrderToGrab',
      'getSettleOrderLists',
    ]),
  },
  mounted () {

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

                this.getSettleOrderLists({ id:this.$route.query.id,order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {

                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);
                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id);
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].order_comment);
                    this.$set(this.formValidate,'driver_settle_comment',data.data.data.rows[0].driver_settle_comment);

                    this.$set(this.formValidate,'driverName',data.data.data.rows[0].driver_name || '');
                    this.$set(this.formValidate,'driverPhone',data.data.data.rows[0].driver_tel || '');
                    this.$set(this.formValidate,'carNum',data.data.data.rows[0].car_no || '');
                    this.$set(this.formValidate,'brandModel',data.data.data.rows[0].car_template || '');
                    this.$set(this.formValidate,'carType',data.data.data.rows[0].car_template || '');
                    this.$set(this.formValidate,'carColor',data.data.data.rows[0].car_color || '');

                    this.count_status = data.data.data.rows[0].driver_settle_status

                })

            })

        })

  },
  activated () {

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

                this.getSettleOrderLists({ id:this.$route.query.id,order_entity_id:'',driver_name:'',customer_name:'',driver_tel:'',driver_settle_status:'',customer_settle_status:'',start_time:'',end_time:'',search:'',offset:0,limit:10 }).then((data) => {

                    this.$set(this.formValidate,'indentType',data.data.data.rows[0].order_type);
                    this.$set(this.formValidate,'modelRequire',data.data.data.rows[0].use_car_type_id);
                    this.$set(this.formValidate,'indentStartDate',data.data.data.rows[0].start_date);
                    this.$set(this.formValidate,'indentStartTime',data.data.data.rows[0].start_time);
                    this.$set(this.formValidate,'indentCity',data.data.data.rows[0].city_id);
                    this.$set(this.formValidate,'cusName',data.data.data.rows[0].customer_name);
                    this.$set(this.formValidate,'startAddress',data.data.data.rows[0].start_address);
                    this.start_location = data.data.data.rows[0].start_location
                    this.$set(this.formValidate,'endAddress',data.data.data.rows[0].end_address);
                    this.end_location = data.data.data.rows[0].end_location
                    this.$set(this.formValidate,'platformPrice',data.data.data.rows[0].plat_amount/100);
                    this.$set(this.formValidate,'indentPrice',data.data.data.rows[0].amount/100);
                    this.$set(this.formValidate,'deiverPrice',data.data.data.rows[0].driver_amount/100);
                    this.$set(this.formValidate,'passengerName',data.data.data.rows[0].passenger_name);
                    this.$set(this.formValidate,'passengerPhone',data.data.data.rows[0].passenger_tel);
                    this.$set(this.formValidate,'desc',data.data.data.rows[0].order_comment);
                    this.$set(this.formValidate,'driver_settle_comment',data.data.data.rows[0].driver_settle_comment);

                    this.$set(this.formValidate,'driverName',data.data.data.rows[0].driver_name || '');
                    this.$set(this.formValidate,'driverPhone',data.data.data.rows[0].driver_tel || '');
                    this.$set(this.formValidate,'carNum',data.data.data.rows[0].car_no || '');
                    this.$set(this.formValidate,'brandModel',data.data.data.rows[0].car_template || '');
                    this.$set(this.formValidate,'carType',data.data.data.rows[0].car_template || '');
                    this.$set(this.formValidate,'carColor',data.data.data.rows[0].car_color || '');

                    this.count_status = data.data.data.rows[0].driver_settle_status

                })

            })

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
